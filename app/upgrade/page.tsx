'use client'

import { useState } from 'react'
import Link from 'next/link'

const FEATURES_FREE = [
  '10 mensajes de IA al día',
  '3 herramientas básicas (Idea, Canvas, Marketing)',
  'Historial de conversaciones',
]

const FEATURES_PRO = [
  'Mensajes ilimitados con IA avanzada',
  'Las 6 herramientas premium',
  'Análisis profundo de competidores',
  'Generador de anuncios (Meta, Google, TikTok)',
  'Estrategia de precios con efecto señuelo',
  'Sin límites · respuestas prioritarias',
]

const FAQ = [
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí. Cancela desde el panel de facturación en cualquier momento. Conservas acceso Pro hasta el final del período.',
  },
  {
    q: '¿Hay período de prueba?',
    a: 'Empieza gratis sin tarjeta. Actualiza a Pro cuando quieras para desbloquear todo.',
  },
  {
    q: '¿Qué métodos de pago aceptáis?',
    a: 'Tarjetas Visa, Mastercard y American Express. Pagos procesados de forma segura con Stripe.',
  },
  {
    q: '¿Qué pasa con mis datos si cancelo?',
    a: 'Tus conversaciones y proyectos se conservan. Simplemente pierdes acceso a las herramientas y modelos Pro.',
  },
]

export default function UpgradePage() {
  const [annual, setAnnual] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const priceId = annual
        ? (process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID ?? '')
        : (process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ?? '')

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
      style={{
        minHeight: '100vh',
        background: 'var(--canvas)',
        padding: '0 24px 80px',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
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
          Volver al panel
        </Link>

        {/* Norte mark */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width={22} height={22} viewBox="0 0 32 32" fill="none">
            <path d="M16 3.5 19.2 16 16 28.5 12.8 16z" fill="var(--accent)" />
            <path d="M5 16 16 14.2 27 16 16 17.8z" fill="var(--accent)" opacity={0.4} />
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
            Norte
          </span>
        </Link>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '40px 0 48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 'var(--r-full)',
              background: 'var(--gold-tint)',
              border: '1px solid var(--gold-tint-2)',
              fontSize: 12.5,
              fontWeight: 700,
              color: 'var(--gold)',
              marginBottom: 20,
              letterSpacing: '0.03em',
            }}
          >
            ★ Plan Pro
          </div>
          <h1
            style={{
              margin: '0 0 14px',
              fontFamily: 'var(--font-display)',
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: 'var(--ink)',
            }}
          >
            Lo que tarda semanas,<br />resuelto en una tarde.
          </h1>
          <p
            style={{
              margin: '0 auto',
              maxWidth: 480,
              fontSize: 17,
              color: 'var(--ink-3)',
              lineHeight: 1.6,
            }}
          >
            Accede a la IA más avanzada, todas las herramientas de estrategia y cero límites.
          </p>
        </div>

        {/* Billing toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          <div
            style={{
              display: 'flex',
              gap: 4,
              background: 'var(--surface-2)',
              borderRadius: 'var(--r-lg)',
              padding: 4,
              border: '1px solid var(--line-2)',
            }}
          >
            <button
              onClick={() => setAnnual(false)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--r-md)',
                fontSize: 14,
                fontWeight: 600,
                background: !annual ? 'var(--surface)' : 'transparent',
                boxShadow: !annual ? 'var(--sh-xs)' : 'none',
                cursor: 'pointer',
                transition: 'all .15s',
                color: 'var(--ink)',
                fontFamily: 'inherit',
              }}
            >
              Mensual
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--r-md)',
                fontSize: 14,
                fontWeight: 600,
                background: annual ? 'var(--surface)' : 'transparent',
                boxShadow: annual ? 'var(--sh-xs)' : 'none',
                cursor: 'pointer',
                transition: 'all .15s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--ink)',
                fontFamily: 'inherit',
              }}
            >
              Anual
              <span
                style={{
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 'var(--r-full)',
                  background: 'var(--gold-tint)',
                  color: 'var(--gold)',
                  border: '1px solid var(--gold-tint-2)',
                }}
              >
                −21%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
            marginBottom: 60,
          }}
        >
          {/* Free */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-2xl)',
              padding: '30px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                Gratuito
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em' }}>0 €</span>
                <span style={{ color: 'var(--ink-4)', fontSize: 14 }}>/mes</span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--ink-3)' }}>
                Para empezar a explorar.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {FEATURES_FREE.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'var(--surface-3)',
                      color: 'var(--ink-3)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={{ color: 'var(--ink-2)' }}>{f}</span>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '12px 20px',
                borderRadius: 'var(--r-md)',
                fontSize: 14.5,
                fontWeight: 600,
                color: 'var(--ink-2)',
                border: '1.5px solid var(--line-2)',
                background: 'var(--surface)',
                textDecoration: 'none',
                transition: 'background .15s',
                marginTop: 'auto',
              }}
            >
              Continuar gratis
            </Link>
          </div>

          {/* Pro */}
          <div
            style={{
              background: 'linear-gradient(160deg, var(--gold-tint) 0%, var(--surface) 50%)',
              border: '2px solid var(--gold-bright)',
              borderRadius: 'var(--r-2xl)',
              padding: '30px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              position: 'relative',
              boxShadow: '0 8px 32px rgba(245,158,11,0.15)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -13,
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '4px 14px',
                borderRadius: 'var(--r-full)',
                background: 'linear-gradient(135deg, var(--gold-bright), var(--gold))',
                fontSize: 11.5,
                fontWeight: 700,
                color: '#3a2a05',
                whiteSpace: 'nowrap',
              }}
            >
              ★ Más popular
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                Pro
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em' }}>
                  {annual ? '15 €' : '19 €'}
                </span>
                <span style={{ color: 'var(--ink-4)', fontSize: 14 }}>
                  /mes{annual ? ' · 180 €/año' : ''}
                </span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--ink-3)' }}>
                {annual ? 'Ahorra 48 € al año.' : 'Cancela cuando quieras.'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {FEATURES_PRO.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'var(--accent-tint)',
                      color: 'var(--accent-700)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px 20px',
                borderRadius: 'var(--r-md)',
                fontSize: 15,
                fontWeight: 700,
                color: '#3a2a05',
                background: loading
                  ? 'var(--gold-tint-2)'
                  : 'linear-gradient(180deg, #FBBF24, var(--gold-bright, #F59E0B))',
                border: '1px solid #D9920A',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(245,158,11,0.35)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all .15s',
                fontFamily: 'inherit',
                marginTop: 'auto',
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 20h20l-2-8-5 4-3-8-3 8-5-4-2 8z" />
              </svg>
              {loading ? 'Redirigiendo…' : 'Continuar al pago'}
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 640, margin: '0 auto', marginBottom: 60 }}>
          <h2
            style={{
              textAlign: 'center',
              margin: '0 0 28px',
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '-0.03em',
            }}
          >
            Preguntas frecuentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {FAQ.map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line-2)',
                  borderRadius: 'var(--r-lg)',
                  overflow: 'hidden',
                  marginBottom: 8,
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '16px 20px',
                    fontSize: 15,
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    color: 'var(--ink)',
                  }}
                >
                  {item.q}
                  <svg
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    style={{
                      flexShrink: 0,
                      transform: openFaq === i ? 'rotate(180deg)' : 'none',
                      transition: 'transform .2s',
                      color: 'var(--ink-4)',
                    }}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div
                    style={{
                      padding: '0 20px 16px',
                      fontSize: 14.5,
                      color: 'var(--ink-3)',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--line)',
                      paddingTop: 14,
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trust line */}
        <div
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--ink-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Pagos seguros con Stripe
          </span>
          <span>·</span>
          <span>Cancela cuando quieras</span>
          <span>·</span>
          <span>Soporte en español</span>
        </div>
      </div>
    </div>
  )
}
