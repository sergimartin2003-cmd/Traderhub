'use client'

import type { ToolDefinition } from '@/lib/constants'

interface ToolCardProps {
  tool: ToolDefinition
  isPro: boolean
  onClick: () => void
}

// ─── Lucide-style SVG icons matching TOOLS icon names ────────────────────────

function ToolIcon({ name, size = 22 }: { name: string; size?: number }) {
  const s = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2 as number,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  if (name === 'Lightbulb' || name === 'target')
    return (
      <svg {...s}>
        <circle cx={12} cy={12} r={10} />
        <circle cx={12} cy={12} r={6} />
        <circle cx={12} cy={12} r={2} />
      </svg>
    )
  if (name === 'LayoutTemplate' || name === 'grid')
    return (
      <svg {...s}>
        <rect x={3} y={3} width={7} height={7} rx={1} />
        <rect x={14} y={3} width={7} height={7} rx={1} />
        <rect x={3} y={14} width={7} height={7} rx={1} />
        <rect x={14} y={14} width={7} height={7} rx={1} />
      </svg>
    )
  if (name === 'Megaphone' || name === 'megaphone')
    return (
      <svg {...s}>
        <path d="M3 11v2a7 7 0 007 7M21 5.5l-2 2.5M21 5.5L3 11v2l18 5.5" />
        <circle cx={3} cy={12} r={1} />
      </svg>
    )
  if (name === 'Zap' || name === 'bolt')
    return (
      <svg {...s}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  if (name === 'Target' || name === 'users')
    return (
      <svg {...s}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx={9} cy={7} r={4} />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    )
  if (name === 'TrendingUp' || name === 'scale')
    return (
      <svg {...s}>
        <path d="M23 6l-9.5 9.5-5-5L1 18" />
        <path d="M17 6h6v6" />
      </svg>
    )

  // default spark icon
  return (
    <svg {...s}>
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
    </svg>
  )
}

export function ToolCard({ tool, isPro, onClick }: ToolCardProps) {
  const locked = tool.pro && !isPro

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        borderRadius: 'var(--r-xl)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        minHeight: 150,
        cursor: 'pointer',
        transition: 'box-shadow .18s, transform .18s',
        boxShadow: 'var(--sh-xs)',
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
      {/* Icon + Pro badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 'var(--r-md)',
            display: 'grid',
            placeItems: 'center',
            background: tool.accent + '18',
            color: tool.accent,
            flexShrink: 0,
          }}
        >
          <ToolIcon name={tool.icon} size={22} />
        </div>
        {tool.pro && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 7px',
              fontSize: 10.5,
              fontWeight: 700,
              borderRadius: 'var(--r-full)',
              background: 'var(--gold-tint, #FEF3C7)',
              color: 'var(--gold, #B7791F)',
              border: '1px solid var(--gold-tint-2, #FDE68A)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            <svg width={11} height={11} viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 20h20l-2-8-5 4-3-8-3 8-5-4-2 8z" />
            </svg>
            Pro
          </span>
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: 650,
            fontSize: 15.5,
            letterSpacing: '-0.02em',
            color: locked ? 'var(--ink-3)' : 'var(--ink)',
          }}
        >
          {tool.name}
        </div>
        <div
          style={{
            fontSize: 13,
            color: 'var(--ink-3)',
            marginTop: 4,
            lineHeight: 1.45,
          }}
        >
          {tool.description}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          color: locked ? 'var(--ink-4, #9CA3AF)' : 'var(--accent-700, #059669)',
        }}
      >
        {locked ? (
          <>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x={3} y={11} width={18} height={11} rx={2} />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span>Desbloquear con Pro</span>
          </>
        ) : (
          <>
            <span>Abrir herramienta</span>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </>
        )}
      </div>
    </div>
  )
}
