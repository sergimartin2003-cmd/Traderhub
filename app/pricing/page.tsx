import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { PricingToggle } from './pricing-toggle'

const checkIcon = (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.2} style={{ flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function FeatureItem({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5, color: 'var(--ink-2)' }}>
      {checkIcon}
      {label}
    </div>
  )
}

const faqs = [
  {
    q: '¿Puedo cancelar en cualquier momento?',
    a: 'Sí. Puedes cancelar tu suscripción Pro desde los ajustes de tu cuenta en cualquier momento. Seguirás teniendo acceso hasta el final del período de facturación.',
  },
  {
    q: '¿Qué métodos de pago aceptáis?',
    a: 'Aceptamos todas las tarjetas de crédito y débito principales (Visa, Mastercard, American Express) a través de Stripe, que garantiza la seguridad de tu información de pago.',
  },
  {
    q: '¿Hay descuento si pago anualmente?',
    a: 'Sí. El plan anual cuesta 180€/año (equivalente a 15€/mes), lo que supone un ahorro de 48€ respecto al pago mensual.',
  },
  {
    q: '¿Qué pasa si supero el límite del plan gratuito?',
    a: 'Si alcanzas el límite de 10 mensajes diarios en el plan gratuito, podrás seguir usando el servicio al día siguiente. Para uso ilimitado, actualiza a Pro en cualquier momento.',
  },
]

export default function PricingPage() {
  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      {/* Nav */}
      <div style={{ borderBottom: '1px solid var(--line)', background: 'var(--surface)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/">
          <Logo size={26} label="Norte" />
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-3)', textDecoration: 'none' }}>
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            style={{ fontSize: 14, fontWeight: 700, color: '#fff', background: 'var(--accent)', padding: '8px 18px', borderRadius: 'var(--r-full)', textDecoration: 'none' }}
          >
            Empezar gratis
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px 80px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--ink)', margin: '0 0 14px', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
            Precios simples y transparentes
          </h1>
          <p style={{ fontSize: 17, color: 'var(--ink-3)', margin: '0 0 32px', lineHeight: 1.5 }}>
            Empieza gratis. Actualiza cuando lo necesites.
          </p>
          <PricingToggle />
        </div>

        {/* Plans */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 64 }}>
          {/* Free */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-xl)',
              padding: '32px 28px',
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Gratuito
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--ink)' }}>0€</span>
                <span style={{ fontSize: 14, color: 'var(--ink-4)' }}>/mes</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--ink-3)', margin: '8px 0 0', lineHeight: 1.5 }}>
                Para empezar a explorar.
              </p>
            </div>

            <Link
              href="/register"
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 20px',
                borderRadius: 'var(--r-md)',
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--accent)',
                background: 'var(--accent-tint)',
                border: '1.5px solid var(--accent-tint-2)',
                textDecoration: 'none',
                textAlign: 'center',
                marginBottom: 24,
                boxSizing: 'border-box',
              }}
            >
              Empezar gratis
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <FeatureItem label="10 mensajes por día" />
              <FeatureItem label="3 herramientas básicas" />
              <FeatureItem label="IA estándar" />
              <FeatureItem label="Proyectos guardados (hasta 5)" />
            </div>
          </div>

          {/* Pro */}
          <div
            style={{
              background: 'var(--ink)',
              border: '1px solid var(--ink)',
              borderRadius: 'var(--r-xl)',
              padding: '32px 28px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'var(--gold)',
                color: '#000',
                fontSize: 12,
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 'var(--r-full)',
                letterSpacing: '0.02em',
              }}
            >
              MÁS POPULAR
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Pro
              </div>
              <div id="pricing-display" style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff' }}>19€</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>/mes</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: '8px 0 0', lineHeight: 1.5 }}>
                O 15€/mes con el plan anual (180€/año)
              </p>
            </div>

            <Link
              href="/dashboard"
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 20px',
                borderRadius: 'var(--r-md)',
                fontSize: 15,
                fontWeight: 700,
                color: '#000',
                background: '#fff',
                textDecoration: 'none',
                textAlign: 'center',
                marginBottom: 24,
                boxSizing: 'border-box',
              }}
            >
              Mejorar a Pro
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Mensajes ilimitados',
                'Todas las herramientas',
                'IA avanzada (Claude Sonnet)',
                'Proyectos ilimitados',
                'Soporte prioritario',
                'Acceso anticipado a nuevas funciones',
              ].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14.5, color: 'rgba(255,255,255,0.85)' }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={2.2} style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink)', textAlign: 'center', marginBottom: 32, fontFamily: 'var(--font-display)' }}>
            Preguntas frecuentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(({ q, a }) => (
              <div
                key={q}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-lg)',
                  padding: '20px 24px',
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{q}</div>
                <div style={{ fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.6 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/" style={{ fontSize: 14, color: 'var(--ink-4)', textDecoration: 'none', fontWeight: 500 }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
