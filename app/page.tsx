'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── Inline sub-components ───────────────────────────────────────────────────

function LMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 3.5 19.2 16 16 28.5 12.8 16z" fill="var(--accent)" />
      <path d="M5 16 16 14.2 27 16 16 17.8z" fill="var(--accent)" opacity={0.4} />
    </svg>
  )
}

function PremiumPill() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 10px',
        borderRadius: 'var(--r-full)',
        background: 'var(--gold-tint)',
        border: '1px solid var(--gold-bright)',
        fontSize: 12,
        fontWeight: 700,
        color: 'var(--gold)',
        letterSpacing: '0.02em',
      }}
    >
      ★ Pro
    </span>
  )
}

function ChatMockup() {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-2xl)',
        boxShadow: 'var(--sh-xl)',
        overflow: 'hidden',
        maxWidth: 460,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '13px 18px',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <LMark size={22} />
        <span style={{ fontWeight: 700, fontSize: 14 }}>Norte</span>
        <span
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 9px',
            borderRadius: 'var(--r-full)',
            background: 'var(--accent-tint)',
            border: '1px solid var(--accent-tint-2)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--accent-700)',
          }}
        >
          ✦ En vivo
        </span>
      </div>
      <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            alignSelf: 'flex-end',
            background: 'var(--ink)',
            color: '#fff',
            padding: '10px 15px',
            borderRadius: '16px 16px 4px 16px',
            fontSize: 14,
            maxWidth: '78%',
          }}
        >
          ¿Es viable una marca de snacks saludables?
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flexShrink: 0 }}>
            <LMark size={26} />
          </div>
          <div
            style={{
              background: 'var(--surface-2)',
              borderRadius: 'var(--r-md)',
              padding: '14px 16px',
              fontSize: 13.5,
              lineHeight: 1.55,
              color: 'var(--ink-2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  border: '4px solid var(--accent)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 700,
                  fontSize: 13,
                  color: 'var(--accent-700)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                79
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--ink)' }}>Viable</div>
                <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>Mercado en crecimiento</div>
              </div>
            </div>
            Tu mayor palanca es <strong>diferenciarte por ingrediente</strong>, no por precio.
            Empieza validando con 20 clientes.
          </div>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '20px 4px',
          textAlign: 'left',
          fontSize: 16.5,
          fontWeight: 650,
          letterSpacing: '-0.01em',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--ink)',
        }}
      >
        <span style={{ flex: 1 }}>{q}</span>
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          style={{
            color: 'var(--ink-4)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform .25s',
            flexShrink: 0,
          }}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        style={{
          maxHeight: open ? 200 : 0,
          overflow: 'hidden',
          transition: 'max-height .3s ease',
        }}
      >
        <p
          style={{
            margin: 0,
            padding: '0 4px 20px',
            fontSize: 15,
            color: 'var(--ink-3)',
            lineHeight: 1.6,
            maxWidth: 720,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: (
      <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx={12} cy={12} r={10} />
        <circle cx={12} cy={12} r={3} />
        <line x1={22} y1={12} x2={19} y2={12} />
        <line x1={2} y1={12} x2={5} y2={12} />
        <line x1={12} y1={2} x2={12} y2={5} />
        <line x1={12} y1={22} x2={12} y2={19} />
      </svg>
    ),
    t: 'Valida antes de invertir',
    d: 'Puntúa cualquier idea por demanda, margen, competencia y timing. Sabe si vale la pena antes de gastar un euro.',
  },
  {
    icon: (
      <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 11l19-9-9 19-2-8-8-2z" strokeLinejoin="round" />
      </svg>
    ),
    t: 'Marketing que convierte',
    d: 'Funnels, anuncios y calendarios de contenido generados para tu negocio y tu presupuesto real.',
  },
  {
    icon: (
      <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 3v18M3 12h18" strokeLinecap="round" />
        <path d="M4.5 7.5C4.5 5.8 6.8 4 9.5 4c2.6 0 4.5 1.8 4.5 4S12.1 12 9.5 12 4.5 10.2 4.5 8z" />
      </svg>
    ),
    t: 'Precios con estrategia',
    d: 'Arquitectura de planes con ancla de valor y efecto señuelo. Cobra lo que vales.',
  },
  {
    icon: (
      <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx={9} cy={7} r={4} />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    t: 'Conoce a tu competencia',
    d: 'Mapa competitivo automático y el hueco de mercado donde puedes ganar.',
  },
  {
    icon: (
      <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x={3} y={3} width={7} height={7} rx={1} />
        <rect x={14} y={3} width={7} height={7} rx={1} />
        <rect x={3} y={14} width={7} height={7} rx={1} />
        <rect x={14} y={14} width={7} height={7} rx={1} />
      </svg>
    ),
    t: 'Tu modelo en 9 bloques',
    d: 'Lean Canvas completo y editable en segundos, listo para presentar a inversores.',
  },
  {
    icon: (
      <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
      </svg>
    ),
    t: 'Un estratega 24/7',
    d: 'Memoria de tu negocio, contexto entre conversaciones y respuestas accionables, no teoría.',
  },
]

const USES = [
  {
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" />
      </svg>
    ),
    t: 'Tengo una idea',
    d: 'Valídala, modélala y sal con un plan de acción de esta semana.',
  },
  {
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    t: 'Estoy lanzando',
    d: 'Marketing, pricing y anuncios listos para tu primer cliente.',
  },
  {
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    t: 'Quiero crecer',
    d: 'Estrategia de crecimiento, análisis de competencia y nuevos canales.',
  },
]

const FAQS = [
  {
    q: '¿Necesito experiencia previa en negocios?',
    a: 'No. Norte está pensado para que cualquiera —desde quien tiene una idea hasta quien ya factura— avance con criterio de estratega, sin jerga.',
  },
  {
    q: '¿En qué se diferencia de un chat genérico?',
    a: 'Norte recuerda el contexto de tu negocio, estructura todo en frameworks accionables y genera entregables reales: validaciones, canvas, planes y anuncios.',
  },
  {
    q: '¿Qué incluye el plan gratuito?',
    a: 'Mensajes diarios limitados y las herramientas básicas (Validador, Lean Canvas y Plan de Marketing). Suficiente para empezar a validar.',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí. El plan Pro es mensual sin permanencia y con garantía de 14 días. Cancelas con un clic.',
  },
]

// ─── Check icon SVG ───────────────────────────────────────────────────────────

function CheckIcon({ color = 'var(--accent)' }: { color?: string }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      style={{ flexShrink: 0 }}
    >
      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      {/* ── Navbar ── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'rgba(251,251,250,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <LMark size={26} />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 17,
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
              }}
            >
              Norte
            </span>
          </Link>
          <div style={{ flex: 1 }} />
          {/* Nav links */}
          <div className="nav-links" style={{ display: 'flex', gap: 26, marginRight: 8 }}>
            {['Producto', 'Herramientas', 'Precios'].map((l) => (
              <a
                key={l}
                href="#"
                style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink-2)', textDecoration: 'none' }}
              >
                {l}
              </a>
            ))}
          </div>
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 16px',
              borderRadius: 'var(--r-md)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--ink-2)',
              textDecoration: 'none',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Entrar
          </Link>
          <Link
            href="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 18px',
              borderRadius: 'var(--r-md)',
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              background: 'var(--ink)',
              textDecoration: 'none',
            }}
          >
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '72px 24px 40px',
          textAlign: 'center',
        }}
      >
        {/* Badge */}
        <div style={{ display: 'inline-flex', marginBottom: 22 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 13px',
              borderRadius: 'var(--r-full)',
              background: 'var(--accent-tint)',
              border: '1px solid var(--accent-tint-2)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--accent-700)',
            }}
          >
            ✦ Tu copiloto de IA para emprender
          </span>
        </div>

        <h1
          style={{
            margin: '0 auto',
            maxWidth: 760,
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(38px, 6vw, 64px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.04,
            color: 'var(--ink)',
          }}
        >
          De la idea al negocio, con un estratega que nunca duerme
        </h1>

        <p
          style={{
            margin: '22px auto 0',
            maxWidth: 560,
            fontSize: 'clamp(16px, 2.4vw, 19px)',
            color: 'var(--ink-3)',
            lineHeight: 1.55,
          }}
        >
          Norte valida ideas, diseña tu marketing, fija tus precios y analiza a tu competencia.
          Resultados reales, no teoría.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            marginTop: 30,
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 28px',
              borderRadius: 'var(--r-lg)',
              fontSize: 16,
              fontWeight: 700,
              color: '#fff',
              background: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            Empieza gratis
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 28px',
              borderRadius: 'var(--r-lg)',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--ink-2)',
              background: 'var(--surface)',
              border: '1.5px solid var(--line-2)',
              textDecoration: 'none',
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={12} cy={12} r={10} />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
            </svg>
            Ver demo
          </Link>
        </div>

        <div style={{ marginTop: 56 }}>
          <ChatMockup />
        </div>
      </section>

      {/* ── Social proof ── */}
      <section
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '30px 24px 50px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--ink-4)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 22,
          }}
        >
          Usado por fundadores que ya facturan
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(24px,5vw,56px)',
            flexWrap: 'wrap',
            alignItems: 'center',
            opacity: 0.55,
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: '-0.02em',
          }}
        >
          {['Lumina', 'Vértiz', 'Cobalto', 'Mente', 'Raíz Studio'].map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <div
        style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
          padding: '72px 0',
        }}
      >
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px,4vw,40px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
              }}
            >
              Todo lo que un consultor caro haría
            </h2>
            <p
              style={{
                margin: '12px auto 0',
                maxWidth: 480,
                fontSize: 16.5,
                color: 'var(--ink-3)',
              }}
            >
              En segundos, por una fracción del coste y disponible 24/7.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 22,
            }}
          >
            {FEATURES.map((f, i) => (
              <div key={i} style={{ padding: 4 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 'var(--r-md)',
                    background: 'var(--accent-tint)',
                    color: 'var(--accent-700)',
                    display: 'grid',
                    placeItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    margin: '0 0 7px',
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'var(--ink)',
                  }}
                >
                  {f.t}
                </h3>
                <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.6 }}>
                  {f.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Use cases ── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px' }}>
        <h2
          style={{
            margin: '0 0 40px',
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px,4vw,40px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
          }}
        >
          Sea cual sea tu etapa
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {USES.map((u, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-xl)',
                padding: 28,
                boxShadow: 'var(--sh-xs)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--r-md)',
                  background: 'var(--ink)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  marginBottom: 18,
                }}
              >
                {u.icon}
              </div>
              <h3
                style={{
                  margin: '0 0 8px',
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)',
                }}
              >
                {u.t}
              </h3>
              <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.6 }}>
                {u.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <div
        style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--line)',
          padding: '72px 0',
        }}
      >
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <h2
            style={{
              margin: '0 0 12px',
              textAlign: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px,4vw,40px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
            }}
          >
            Empieza gratis, crece con Pro
          </h2>
          <p
            style={{
              margin: '0 auto 44px',
              textAlign: 'center',
              fontSize: 16.5,
              color: 'var(--ink-3)',
            }}
          >
            Sin tarjeta para empezar. Cancela cuando quieras.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 22,
              maxWidth: 760,
              margin: '0 auto',
            }}
          >
            {/* Free plan */}
            <div
              style={{
                border: '1px solid var(--line-2)',
                borderRadius: 'var(--r-2xl)',
                padding: 30,
                background: 'var(--surface)',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>Gratis</div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 6,
                  margin: '14px 0 20px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 38,
                    fontWeight: 700,
                    color: 'var(--ink)',
                  }}
                >
                  0 €
                </span>
                <span style={{ color: 'var(--ink-4)' }}>/mes</span>
              </div>
              {['10 mensajes al día', '3 herramientas básicas', 'Memoria de contexto'].map((x) => (
                <div
                  key={x}
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    fontSize: 14.5,
                    color: 'var(--ink-2)',
                    padding: '7px 0',
                  }}
                >
                  <CheckIcon />
                  {x}
                </div>
              ))}
              <div style={{ marginTop: 18 }}>
                <Link
                  href="/register"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '12px 20px',
                    borderRadius: 'var(--r-md)',
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--ink)',
                    background: 'var(--surface-2)',
                    border: '1.5px solid var(--line-2)',
                    textDecoration: 'none',
                  }}
                >
                  Empezar gratis
                </Link>
              </div>
            </div>

            {/* Pro plan */}
            <div
              style={{
                border: '2px solid var(--gold-bright)',
                borderRadius: 'var(--r-2xl)',
                padding: 30,
                background: 'linear-gradient(180deg, var(--gold-tint), var(--surface))',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', top: -13, left: 30 }}>
                <PremiumPill />
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>Pro</div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 6,
                  margin: '14px 0 20px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 38,
                    fontWeight: 700,
                    color: 'var(--ink)',
                  }}
                >
                  19 €
                </span>
                <span style={{ color: 'var(--ink-4)' }}>/mes</span>
              </div>
              {[
                'Mensajes ilimitados',
                'Todas las herramientas premium',
                'IA más avanzada',
                'Exportación y sin anuncios',
              ].map((x) => (
                <div
                  key={x}
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    fontSize: 14.5,
                    color: 'var(--ink-2)',
                    padding: '7px 0',
                  }}
                >
                  <CheckIcon color="var(--gold)" />
                  {x}
                </div>
              ))}
              <div style={{ marginTop: 18 }}>
                <Link
                  href="/register"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '12px 20px',
                    borderRadius: 'var(--r-md)',
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--ink)',
                    background: 'linear-gradient(135deg, var(--gold-bright), var(--gold))',
                    textDecoration: 'none',
                  }}
                >
                  ♛ Probar Pro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <section
        style={{
          maxWidth: 820,
          margin: '0 auto',
          padding: '72px 24px',
        }}
      >
        <h2
          style={{
            margin: '0 0 28px',
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px,4vw,40px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
          }}
        >
          Preguntas frecuentes
        </h2>
        {FAQS.map((f, i) => (
          <FAQItem key={i} q={f.q} a={f.a} />
        ))}
      </section>

      {/* ── CTA final ── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '20px 24px 80px' }}>
        <div
          style={{
            background: 'var(--ink)',
            borderRadius: 'var(--r-2xl)',
            padding: 'clamp(36px,6vw,64px)',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(26px,4vw,40px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
            }}
          >
            Tu próxima gran idea empieza hoy
          </h2>
          <p
            style={{
              margin: '14px auto 28px',
              maxWidth: 440,
              fontSize: 16.5,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.5,
            }}
          >
            Únete y valida tu primera idea en menos de cinco minutos.
          </p>
          <Link
            href="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 28px',
              borderRadius: 'var(--r-lg)',
              fontSize: 16,
              fontWeight: 700,
              color: '#fff',
              background: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            Empezar gratis
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '32px 0' }}>
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <LMark size={22} />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
              }}
            >
              Norte
            </span>
          </Link>
          <span style={{ fontSize: 13, color: 'var(--ink-4)' }}>© 2026 · Hecho para emprendedores</span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 22, fontSize: 13.5, color: 'var(--ink-3)' }}>
            {['Privacidad', 'Términos', 'Contacto'].map((l) => (
              <a key={l} href="#" style={{ color: 'var(--ink-3)', textDecoration: 'none' }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`@media (max-width: 640px){ .nav-links{ display:none !important; } }`}</style>
    </div>
  )
}
