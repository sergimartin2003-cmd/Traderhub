import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { handleWebhookEvent, stripe } from '@/lib/stripe/server'
import type { Database, Subscription } from '@/types'
import type Stripe from 'stripe'

// Webhook handler uses the service-role key so it can write without a user session.
function getServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Firma de webhook ausente' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = handleWebhookEvent(body, sig)
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Verificación de firma fallida' }, { status: 400 })
  }

  const supabase = getServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const subscriptionId = session.subscription as string | null

        if (!userId) break

        const stripeSubscription = subscriptionId
          ? await stripe.subscriptions.retrieve(subscriptionId)
          : null

        const periodEnd = stripeSubscription
          ? new Date((stripeSubscription as unknown as { current_period_end: number }).current_period_end * 1000).toISOString()
          : null

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('subscriptions')
          .upsert(
            {
              user_id: userId,
              plan: 'pro',
              status: 'active',
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscriptionId ?? null,
              current_period_end: periodEnd,
            },
            { onConflict: 'user_id' }
          )
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const statusMap: Record<Stripe.Subscription.Status, Subscription['status']> = {
          active: 'active',
          trialing: 'trialing',
          past_due: 'past_due',
          canceled: 'canceled',
          unpaid: 'past_due',
          incomplete: 'inactive',
          incomplete_expired: 'inactive',
          paused: 'inactive',
        }

        const mappedStatus: Subscription['status'] = statusMap[subscription.status] ?? 'inactive'

        const periodEnd = new Date(
          (subscription as unknown as { current_period_end: number }).current_period_end * 1000
        ).toISOString()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('subscriptions')
          .update({
            status: mappedStatus,
            current_period_end: periodEnd,
            stripe_subscription_id: subscription.id,
          })
          .eq('stripe_customer_id', customerId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('subscriptions')
          .update({
            plan: 'free',
            status: 'canceled',
            stripe_subscription_id: null,
            current_period_end: null,
          })
          .eq('stripe_customer_id', customerId)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_customer_id', customerId)
        break
      }

      default:
        // Unhandled event type — ignore silently
        break
    }
  } catch (err) {
    console.error(`[Stripe Webhook] Error handling event ${event.type}:`, err)
    // Return 200 so Stripe doesn't retry — internal errors shouldn't cause re-delivery loops
  }

  return NextResponse.json({ received: true })
}

// Next.js 15 route segment config: disable body parsing so we get the raw body
export const dynamic = 'force-dynamic'
