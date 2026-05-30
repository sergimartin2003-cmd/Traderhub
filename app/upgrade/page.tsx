'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const FEATURES = [
  'Mensajes ilimitados con la IA más avanzada',
  'Las 6 herramientas premium desbloqueadas',
  'Análisis de competencia y estrategia de precios',
  'Generador de anuncios para Meta, Google y TikTok',
  'Sin límites diarios · respuestas prioritarias',
]

function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.2} style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function UpgradePage() {
  const router = useRouter()
  const [annual, setAnnual] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: annual ? 'annual' : 'monthly' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Error al iniciar el pago')
        setLoading(false)
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--canvas)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Back */}
        <div style={{ marginBottom: 28 }}>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 13.5,
              fontWeight: 600,
              color: 'var(--ink-3)',
              textDecoration: 'none',
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver
          </Link>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'var(--surface)',
            border: '2px solid var(--gold-bright)',
            borderRadius: 'var(--r-2xl)',
            overflow: 'hidden',
            boxShadow: 'var(--sh-xl)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '28px 32px 22px',
              background: 'linear-gradient(165deg, var(--gold-tint), transparent)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 'var(--r-full)',
                background: 'var(--gold-tint)',
                border: '1px solid var(--gold-tint-2)',
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--gold)',
                marginBottom: 14,
              }}
            >
              ♛ Pro
            </div>
            <h1
              style={{
                margin: '0 0 8px',
                fontFamily: 'var(--font-display)',
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
              }}
            >
              Construye más rápido con Pro
            </h1>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.5 }}>
              Lo que hoy te toma semanas, con Pro lo resuelves en una tarde.
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '22px 32px 28px' }}>
            {/* Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5 }}>
                  <CheckIcon />
                  {f}
                </div>
              ))}
            </div>

            {/* Billing toggle */}
            <div
              style={{
                display: 'flex',
                gap: 6,
                marginBottom: 18,
                background: 'var(--surface-2)',
                borderRadius: 'var(--r-md)',
                padding: 4,
              }}
            >
              <button
                onClick={() => setAnnual(false)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 'var(--r-sm)',
                  fontSize: 13.5,
                  fontWeight: 600,
                  background: !annual ? 'var(--surface)' : 'transparent',
                  boxShadow: !annual ? 'var(--sh-xs)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all .15s',
                }}
              >
                Mensual
              </button>
              <button
                onClick={() => setAnnual(true)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 'var(--r-sm)',
                  fontSize: 13.5,
                  fontWeight: 600,
                  background: annual ? 'var(--surface)' : 'transparent',
                  boxShadow: annual ? 'var(--sh-xs)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'all .15s',
                }}
              >
                Anual
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--gold)',
                    background: 'var(--gold-tint)',
                    padding: '2px 7px',
                    borderRadius: 'var(--r-full)',
                    border: '1px solid var(--gold-tint-2)',
                  }}
                >
                  −21%
                </span>
              </button>
            </div>

            {/* Price */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 34,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: 'var(--ink)',
                }}
              >
                {annual ? '15 €' : '19 €'}
              </span>
              <span style={{ color: 'var(--ink-3)', fontSize: 14.5 }}>
                {annual ? '/mes · 180 €/año facturado' : '/mes · cancela cuando quieras'}
              </span>
            </div>

            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  marginBottom: 14,
                  borderRadius: 'var(--r-md)',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  fontSize: 13.5,
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: 'var(--r-md)',
                fontSize: 16,
                fontWeight: 700,
                color: '#3a2a05',
                background: loading
                  ? 'var(--surface-2)'
                  : 'linear-gradient(135deg, var(--gold-bright), var(--gold))',
                border: loading ? '1px solid var(--line-2)' : '1px solid #D9920A',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'opacity .15s',
              }}
            >
              {loading ? 'Redirigiendo…' : '♛ Continuar al pago'}
            </button>

            <p style={{ margin: '14px 0 0', textAlign: 'center', fontSize: 12.5, color: 'var(--ink-4)' }}>
              Sin permanencia · cancela en un clic · pago seguro con Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
