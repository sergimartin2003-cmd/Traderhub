import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TOOLS } from '@/lib/constants'
import Link from 'next/link'

export default async function ToolsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single<{ plan: string; status: string }>()

  const isPro =
    subscription?.plan === 'pro' &&
    (subscription?.status === 'active' || subscription?.status === 'trialing')

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '36px 40px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            margin: '0 0 8px',
            fontFamily: 'var(--font-display)',
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: '-0.035em',
            color: 'var(--ink)',
          }}
        >
          Herramientas
        </h1>
        <p style={{ margin: 0, fontSize: 15.5, color: 'var(--ink-3)' }}>
          Todo lo que un consultor de estrategia haría, en segundos.
        </p>
      </div>

      {/* Tools grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}
      >
        {TOOLS.map((tool) => {
          const locked = tool.pro && !isPro

          return (
            <Link
              key={tool.id}
              href={locked ? '/upgrade' : `/dashboard/tools/${tool.id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                padding: '22px 24px',
                background: 'var(--surface)',
                border: '1px solid var(--line-2)',
                borderRadius: 'var(--r-xl)',
                textDecoration: 'none',
                boxShadow: 'var(--sh-xs)',
                transition: 'box-shadow .18s, transform .18s',
                position: 'relative',
                minHeight: 160,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--sh-md)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--sh-xs)'
                e.currentTarget.style.transform = 'none'
              }}
            >
              {/* Icon + Pro pill */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--r-md)',
                    background: tool.accent + '18',
                    color: tool.accent,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <ToolSvg name={tool.icon} />
                </div>
                {tool.pro && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '3px 9px',
                      fontSize: 11,
                      fontWeight: 700,
                      borderRadius: 'var(--r-full)',
                      background: 'var(--gold-tint)',
                      color: 'var(--gold)',
                      border: '1px solid var(--gold-tint-2)',
                    }}
                  >
                    ★ Pro
                  </span>
                )}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 17,
                    letterSpacing: '-0.02em',
                    color: locked ? 'var(--ink-3)' : 'var(--ink)',
                    marginBottom: 6,
                  }}
                >
                  {tool.name}
                </div>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.5 }}>
                  {tool.description}
                </p>
              </div>

              {/* CTA */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: locked ? 'var(--ink-4)' : 'var(--accent-700)',
                  marginTop: 4,
                }}
              >
                {locked ? (
                  <>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x={3} y={11} width={18} height={11} rx={2} />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    Desbloquear con Pro
                  </>
                ) : (
                  <>
                    Abrir herramienta
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" />
                    </svg>
                  </>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Upsell if not pro */}
      {!isPro && (
        <div
          style={{
            marginTop: 40,
            padding: '28px 32px',
            background: 'linear-gradient(135deg, var(--gold-tint), var(--surface))',
            border: '1.5px solid var(--gold-bright)',
            borderRadius: 'var(--r-2xl)',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Desbloquea todas las herramientas
            </div>
            <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.5 }}>
              Con Pro accedes al Generador de Anuncios, Análisis de Competencia y Estrategia de Precios.
            </p>
          </div>
          <Link
            href="/upgrade"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              borderRadius: 'var(--r-md)',
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--ink)',
              background: 'linear-gradient(135deg, var(--gold-bright), var(--gold))',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            ♛ Ver plan Pro
          </Link>
        </div>
      )}
    </div>
  )
}

function ToolSvg({ name }: { name: string }) {
  const props = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  if (name === 'Lightbulb')
    return (
      <svg {...props}>
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  if (name === 'LayoutTemplate')
    return (
      <svg {...props}>
        <rect x={3} y={3} width={7} height={7} rx={1} />
        <rect x={14} y={3} width={7} height={7} rx={1} />
        <rect x={3} y={14} width={7} height={7} rx={1} />
        <rect x={14} y={14} width={7} height={7} rx={1} />
      </svg>
    )
  if (name === 'Megaphone')
    return (
      <svg {...props}>
        <path d="M3 11v2a7 7 0 007 7M21 5.5l-2 2.5M21 5.5L3 11v2l18 5.5" />
      </svg>
    )
  if (name === 'Zap')
    return (
      <svg {...props}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  if (name === 'Target')
    return (
      <svg {...props}>
        <circle cx={12} cy={12} r={10} />
        <circle cx={12} cy={12} r={6} />
        <circle cx={12} cy={12} r={2} />
      </svg>
    )
  if (name === 'TrendingUp')
    return (
      <svg {...props}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    )
  return (
    <svg {...props}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
    </svg>
  )
}
