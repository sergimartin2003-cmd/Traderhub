'use client'

import { useState } from 'react'
import { Icon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
}

const FEATURES = [
  'Mensajes ilimitados con la IA más avanzada',
  'Las 6 herramientas premium',
  'Análisis profundos y exportación',
  'Sin anuncios · respuestas prioritarias',
]

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const [annual, setAnnual] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const priceId = annual
        ? process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(19,19,22,0.42)', backdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center', padding: 24,
        animation: 'fadeIn .2s',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(520px, 100%)', background: 'var(--surface)',
          borderRadius: 'var(--r-2xl)', boxShadow: 'var(--sh-xl)',
          overflow: 'hidden', animation: 'pop .25s var(--ease-out)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '30px 32px 24px', background: 'linear-gradient(165deg, var(--gold-tint), transparent)', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: 18, right: 18, width: 32, height: 32, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', color: 'var(--ink-3)', cursor: 'pointer' }}
          >
            <Icon name="close" size={18} />
          </button>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--r-full)', background: 'linear-gradient(135deg, var(--gold-tint-2), var(--gold-tint))', border: '1px solid var(--gold-tint-2)', fontSize: 12, fontWeight: 700, color: 'var(--gold)' }}>
            <Icon name="crown" size={13} />
            Pro
          </div>
          <h2 style={{ margin: '14px 0 6px', fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>
            Construye más rápido con Pro
          </h2>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-3)', maxWidth: 380, lineHeight: 1.5 }}>
            Lo que hoy te toma semanas, con Pro lo resuelves en una tarde.
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 32px 28px' }}>
          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 22 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 14.5 }}>
                <span style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--accent-tint)', color: 'var(--accent-700)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon name="check" size={14} />
                </span>
                {f}
              </div>
            ))}
          </div>

          {/* Billing toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, background: 'var(--surface-2)', borderRadius: 'var(--r-md)', padding: 4 }}>
            <button
              onClick={() => setAnnual(false)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--r-sm)', fontSize: 13.5, fontWeight: 600, background: !annual ? 'var(--surface)' : 'transparent', boxShadow: !annual ? 'var(--sh-xs)' : 'none', cursor: 'pointer', transition: 'all .15s' }}
            >
              Mensual
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--r-sm)', fontSize: 13.5, fontWeight: 600, background: annual ? 'var(--surface)' : 'transparent', boxShadow: annual ? 'var(--sh-xs)' : 'none', cursor: 'pointer', transition: 'all .15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              Anual
              <Badge tone="gold" size="sm">−21%</Badge>
            </button>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 18 }}>
            <span className="mono" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em' }}>
              {annual ? '15 €' : '19 €'}
            </span>
            <span style={{ color: 'var(--ink-3)', fontSize: 14.5 }}>
              /mes{annual ? ' · facturado anualmente (180 €/año)' : ' · cancela cuando quieras'}
            </span>
          </div>

          <Button variant="gold" size="lg" icon="crown" full onClick={handleCheckout} disabled={loading}>
            {loading ? 'Redirigiendo...' : 'Continuar al pago'}
          </Button>
        </div>
      </div>
    </div>
  )
}
