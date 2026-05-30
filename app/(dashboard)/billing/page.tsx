import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Subscription } from '@/types'
import BillingPortalButton from './billing-portal-button'

interface Props {
  searchParams: Promise<{ success?: string; canceled?: string }>
}

export default async function BillingPage({ searchParams }: Props) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const params = await searchParams
  const isSuccess = params.success === 'true'
  const isCanceled = params.canceled === 'true'

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single<Subscription>()

  const isPro =
    subscription?.plan === 'pro' &&
    (subscription?.status === 'active' || subscription?.status === 'trialing')

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 100px' }}>
      {/* Success banner */}
      {isSuccess && (
        <div
          style={{
            padding: '16px 20px',
            background: 'var(--accent-tint)',
            border: '1px solid var(--accent-tint-2)',
            borderRadius: 'var(--r-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 28,
          }}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.2}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" />
            <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 15 }}>
              ¡Bienvenido a Norte Pro!
            </div>
            <div style={{ color: 'var(--accent-700)', fontSize: 13.5, marginTop: 2 }}>
              Tu suscripción está activa. Disfruta de todos los beneficios.
            </div>
          </div>
        </div>
      )}

      {/* Canceled banner */}
      {isCanceled && (
        <div
          style={{
            padding: '16px 20px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 'var(--r-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 28,
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2}>
            <circle cx={12} cy={12} r={10} />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 14, color: '#DC2626' }}>
            El pago fue cancelado. Puedes intentarlo de nuevo cuando quieras.
          </div>
        </div>
      )}

      <h1
        style={{
          margin: '0 0 8px',
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--ink)',
        }}
      >
        Facturación
      </h1>
      <p style={{ margin: '0 0 32px', fontSize: 15, color: 'var(--ink-3)' }}>
        Gestiona tu plan y método de pago.
      </p>

      {/* Current plan card */}
      <div
        style={{
          background: isPro
            ? 'linear-gradient(160deg, var(--gold-tint), var(--surface))'
            : 'var(--surface)',
          border: isPro ? '2px solid var(--gold-bright)' : '1px solid var(--line-2)',
          borderRadius: 'var(--r-xl)',
          padding: '24px 28px',
          marginBottom: 20,
          boxShadow: isPro ? '0 8px 32px rgba(245,158,11,0.12)' : 'var(--sh-xs)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Plan actual</h2>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 12px',
              borderRadius: 'var(--r-full)',
              fontSize: 12.5,
              fontWeight: 700,
              background: isPro ? 'var(--gold-tint)' : 'var(--surface-2)',
              color: isPro ? 'var(--gold)' : 'var(--ink-3)',
              border: isPro ? '1px solid var(--gold-tint-2)' : '1px solid var(--line-2)',
            }}
          >
            {isPro && (
              <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 20h20l-2-8-5 4-3-8-3 8-5-4-2 8z" />
              </svg>
            )}
            {isPro ? 'Pro activo' : 'Gratuito'}
          </span>
        </div>

        {isPro ? (
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
              Mensajes ilimitados · Todas las herramientas · IA avanzada
            </p>
            {subscription?.current_period_end && (
              <p style={{ margin: '0 0 18px', fontSize: 13.5, color: 'var(--ink-4)' }}>
                Activo hasta:{' '}
                <strong style={{ color: 'var(--ink-2)' }}>
                  {new Date(subscription.current_period_end).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </strong>
              </p>
            )}
            <BillingPortalButton />
          </div>
        ) : (
          <div>
            <p style={{ margin: '0 0 18px', fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
              10 mensajes/día · 3 herramientas básicas
            </p>
            <Link
              href="/upgrade"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '11px 20px',
                borderRadius: 'var(--r-md)',
                fontSize: 14,
                fontWeight: 700,
                color: '#3a2a05',
                background: 'linear-gradient(180deg, #FBBF24, var(--gold-bright, #F59E0B))',
                border: '1px solid #D9920A',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(245,158,11,0.30)',
              }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 20h20l-2-8-5 4-3-8-3 8-5-4-2 8z" />
              </svg>
              Mejorar a Pro — 19€/mes
            </Link>
          </div>
        )}
      </div>

      {/* Back link */}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--ink-3)',
            textDecoration: 'none',
          }}
        >
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Volver al panel
        </Link>
      </div>
    </div>
  )
}
