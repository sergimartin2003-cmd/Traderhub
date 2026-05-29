import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCustomerPortalSession } from '@/lib/stripe/server'

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

    // 2. Get stripe_customer_id from subscriptions table
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single<Pick<import('@/types').Subscription, 'stripe_customer_id'>>()

    if (subError || !subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No se encontró una suscripción activa' },
        { status: 404 }
      )
    }

    // 3. Create customer portal session
    const session = await createCustomerPortalSession(subscription.stripe_customer_id)

    // 4. Return portal URL
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[Stripe Portal] Error:', error)
    return NextResponse.json(
      { error: 'Error al crear la sesión del portal' },
      { status: 500 }
    )
  }
}
