import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Subscription } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BillingActions } from './billing-actions'
import Link from 'next/link'

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single<Subscription>()

  const isPro =
    subscription?.plan === 'pro' &&
    (subscription?.status === 'active' || subscription?.status === 'trialing')

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 100px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>
        Facturación
      </h1>

      {/* Current plan */}
      <Card style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Plan actual</h2>
          {isPro
            ? <Badge tone="gold" icon="crown">Pro</Badge>
            : <Badge tone="neutral">Gratuito</Badge>
          }
        </div>

        {isPro ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 14, color: 'var(--ink-3)' }}>
                Mensajes ilimitados · Todas las herramientas · IA avanzada Claude Sonnet
              </div>
              {subscription?.status && (
                <div style={{ fontSize: 13.5, color: 'var(--ink-4)' }}>
                  Estado:{' '}
                  <span style={{ fontWeight: 600, color: subscription.status === 'active' ? 'var(--accent)' : 'var(--ink-3)' }}>
                    {subscription.status === 'active' ? 'Activo' : subscription.status === 'trialing' ? 'Período de prueba' : subscription.status}
                  </span>
                </div>
              )}
              {subscription?.current_period_end && (
                <div style={{ fontSize: 13.5, color: 'var(--ink-4)' }}>
                  Próxima renovación:{' '}
                  <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>
                    {new Date(subscription.current_period_end).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>
            <BillingActions isPro={isPro} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-3)' }}>
              Estás usando el plan gratuito: 10 mensajes/día, 3 herramientas básicas.
            </p>
            <div
              style={{
                background: 'linear-gradient(135deg, var(--gold-tint), var(--surface-2))',
                border: '1px solid var(--gold-tint-2)',
                borderRadius: 'var(--r-lg)',
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Actualiza a Pro</div>
                <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 4 }}>
                  Mensajes ilimitados, todas las herramientas y IA avanzada.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>19€</span>
                <span style={{ fontSize: 13.5, color: 'var(--ink-4)' }}>/mes</span>
                <span style={{ fontSize: 13, color: 'var(--ink-4)', marginLeft: 6 }}>o 15€/mes anual</span>
              </div>
              <BillingActions isPro={isPro} />
            </div>
          </div>
        )}
      </Card>

      {/* Invoices note */}
      <Card style={{ padding: 24 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 17, fontWeight: 700 }}>Facturas</h2>
        <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.6 }}>
          Para ver y descargar tus facturas completas, usa el portal de facturación de Stripe.
          Desde allí también puedes actualizar tu método de pago o cancelar tu suscripción.
        </p>
        {isPro && (
          <div style={{ marginTop: 14 }}>
            <BillingActions isPro={isPro} portalOnly />
          </div>
        )}
      </Card>

      {/* Links */}
      <div style={{ display: 'flex', gap: 16, fontSize: 13.5, color: 'var(--ink-4)' }}>
        <Link href="/terms" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Términos de servicio</Link>
        <span>·</span>
        <Link href="/privacy" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Política de privacidad</Link>
        <span>·</span>
        <Link href="/pricing" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Ver precios</Link>
      </div>
    </div>
  )
}
