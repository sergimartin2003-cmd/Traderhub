import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import type { Subscription } from '@/types'

const PLAN_PRICE_IDS: Record<string, string | undefined> = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
  annual: process.env.STRIPE_ANNUAL_PRICE_ID,
}

const schema = z.object({
  // Accept either a plan name ('monthly'|'annual') or a raw priceId
  plan: z.enum(['monthly', 'annual']).optional(),
  priceId: z.string().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Validate body
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos de solicitud inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }
    const { plan, priceId: rawPriceId, successUrl, cancelUrl } = parsed.data

    // Resolve price ID: prefer plan name (server-side lookup) over raw priceId
    const resolvedPriceId = plan ? PLAN_PRICE_IDS[plan] : rawPriceId

    if (!resolvedPriceId) {
      return NextResponse.json(
        { error: 'Plan o precio no configurado' },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    // 3. Get or create Stripe customer
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single<Pick<Subscription, 'stripe_customer_id'>>()

    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      })
      customerId = customer.id

      // Upsert subscription row with the new customer ID
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('subscriptions')
        .upsert(
          { user_id: user.id, stripe_customer_id: customerId },
          { onConflict: 'user_id' }
        )
    }

    // 4. Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl ?? `${appUrl}/settings?upgraded=true`,
      cancel_url: cancelUrl ?? `${appUrl}/upgrade`,
      metadata: { userId: user.id },
      allow_promotion_codes: true,
    })

    // 5. Return session URL
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[Stripe Checkout] Error:', error)
    return NextResponse.json(
      { error: 'Error al crear la sesión de pago' },
      { status: 500 }
    )
  }
}
