'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Icon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/logo'
import { PLANS } from '@/lib/constants'

const FEATURES = [
  'Mensajes ilimitados con la IA más avanzada',
  'Las 6 herramientas premium desbloqueadas',
  'Análisis profundos y exportación de proyectos',
  'Respuestas prioritarias · sin anuncios',
  'Soporte por email',
]

export default function UpgradePage() {
  const router = useRouter()
  const [annual, setAnnual] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const priceId = annual
        ? process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: priceId || 'price_monthly' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error ?? 'Error al iniciar el pago')
        setLoading(false)
      }
    } catch {
      toast.error('Error al iniciar el pago')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--canvas)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--line)', background: 'var(--surface)' }}>
        <Logo size={24} />
        <Button variant="ghost" size="sm" icon="arrowLeft" onClick={() => router.push('/dashboard')}>
          Volver
        </Button>
      </header>

      <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '40px 24px 80px' }}>
        <div style={{ width: 'min(560px, 100%)' }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 'var(--r-full)', background: 'linear-gradient(135deg, var(--gold-tint-2), var(--gold-tint))', border: '1px solid var(--gold-tint-2)', fontSize: 12.5, fontWeight: 700, color: 'var(--gold)', marginBottom: 14 }}>
              <Icon name="crown" size={13} />
              Norte Pro
            </div>
            <h1 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em' }}>
              Construye más rápido con Pro
            </h1>
            <p style={{ margin: 0, fontSize: 16, color: 'var(--ink-3)', lineHeight: 1.5 }}>
              Lo que hoy te toma semanas, con Pro lo resuelves en una tarde.
            </p>
          </div>

          {/* Card */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-2xl)', boxShadow: 'var(--sh-lg)', border: '1px solid var(--line)', overflow: 'hidden' }}>
            <div style={{ padding: '28px 32px' }}>
              {/* Billing toggle */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 22, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', padding: 4 }}>
                <button
                  onClick={() => setAnnual(false)}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: 'var(--r-sm)', fontSize: 14, fontWeight: 600, background: !annual ? 'var(--surface)' : 'transparent', boxShadow: !annual ? 'var(--sh-xs)' : 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: 'var(--r-sm)', fontSize: 14, fontWeight: 600, background: annual ? 'var(--surface)' : 'transparent', boxShadow: annual ? 'var(--sh-xs)' : 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  Anual
                  <Badge tone="gold" size="sm">−21%</Badge>
                </button>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 22 }}>
                <span className="mono" style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em' }}>
                  {annual ? `${PLANS.annual.monthlyEquivalent} €` : `${PLANS.monthly.price} €`}
                </span>
                <span style={{ color: 'var(--ink-3)', fontSize: 15 }}>
                  /mes{annual ? ` · facturado anualmente (${PLANS.annual.price} €/año)` : ' · cancela cuando quieras'}
                </span>
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 26 }}>
                {FEATURES.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 15 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--accent-tint)', color: 'var(--accent-700)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Icon name="check" size={14} />
                    </span>
                    {f}
                  </div>
                ))}
              </div>

              <Button variant="gold" size="lg" icon="crown" full onClick={handleCheckout} disabled={loading}>
                {loading ? 'Redirigiendo...' : 'Continuar al pago'}
              </Button>

              <p style={{ margin: '14px 0 0', textAlign: 'center', fontSize: 12.5, color: 'var(--ink-4)' }}>
                Pago seguro con Stripe · cancela en cualquier momento
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
