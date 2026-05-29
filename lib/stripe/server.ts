import Stripe from 'stripe'

// Lazy initialization — only throw at runtime when the key is actually used,
// not at module evaluation time during the build.
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Missing STRIPE_SECRET_KEY environment variable')
  return new Stripe(key)
}

export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

// ---------------------------------------------------------------------------
// Pricing plan configuration
// ---------------------------------------------------------------------------

export const PLANS = {
  monthly: {
    name: 'Pro Monthly',
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID ?? '',
    price: 19,
    currency: 'EUR',
    interval: 'month' as const,
  },
  annual: {
    name: 'Pro Annual',
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID ?? '',
    price: 180,
    currency: 'EUR',
    interval: 'year' as const,
    monthlyEquivalent: 15,
  },
} as const

// ---------------------------------------------------------------------------
// Session helpers
// ---------------------------------------------------------------------------

/**
 * Creates a Stripe Checkout session for upgrading to Pro.
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  plan: 'monthly' | 'annual',
  priceId: string
): Promise<Stripe.Checkout.Session> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return stripe.checkout.sessions.create({
    customer_email: email,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId, plan },
    success_url: `${appUrl}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/upgrade?canceled=true`,
    subscription_data: {
      metadata: { userId, plan },
    },
    allow_promotion_codes: true,
  })
}

/**
 * Creates a Stripe Customer Portal session so users can manage their subscription.
 */
export async function createCustomerPortalSession(
  customerId: string
): Promise<Stripe.BillingPortal.Session> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/dashboard/billing`,
  })
}

/**
 * Validates and constructs a Stripe webhook event from raw payload + signature.
 */
export function handleWebhookEvent(
  payload: string | Buffer,
  sig: string
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable')
  }
  return stripe.webhooks.constructEvent(payload, sig, secret)
}
