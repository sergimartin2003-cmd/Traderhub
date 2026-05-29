'use client'

interface StatCardProps {
  icon: string
  label: string
  value: string | number
  tone?: 'gold' | 'accent'
  children?: React.ReactNode
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function StatIcon({ name, size = 19 }: { name: string; size?: number }) {
  const s = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 as number }

  if (name === 'flame')
    return <svg {...s}><path d="M12 2C9 7 5 10 5 14a7 7 0 0014 0c0-4-4-6-5-10-1 3-3 4-3 6a3 3 0 006 0c0-3-3-5-5-8z" /></svg>
  if (name === 'target')
    return <svg {...s}><circle cx={12} cy={12} r={10} /><circle cx={12} cy={12} r={6} /><circle cx={12} cy={12} r={2} /></svg>
  if (name === 'folder')
    return <svg {...s}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg>
  if (name === 'chat')
    return <svg {...s}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
  if (name === 'crown')
    return <svg {...s} fill="currentColor" stroke="none"><path d="M2 20h20l-2-8-5 4-3-8-3 8-5-4-2 8z" /></svg>

  // default circle
  return <svg {...s}><circle cx={12} cy={12} r={10} /></svg>
}

export function StatCard({ icon, label, value, tone, children }: StatCardProps) {
  const isGold = tone === 'gold'

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        borderRadius: 'var(--r-xl)',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: 'var(--sh-xs)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 'var(--r-sm)',
            display: 'grid',
            placeItems: 'center',
            background: isGold ? 'var(--gold-tint, #FEF3C7)' : 'var(--accent-tint, #ECFDF5)',
            color: isGold ? 'var(--gold, #B7791F)' : 'var(--accent-700, #059669)',
          }}
        >
          <StatIcon name={icon} size={19} />
        </div>
        {children}
      </div>
      <div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 5 }}>{label}</div>
      </div>
    </div>
  )
}
