import { Icon } from '@/components/icons'

interface BadgeProps {
  children?: React.ReactNode
  tone?: 'neutral' | 'accent' | 'gold' | 'info' | 'danger'
  size?: 'sm' | 'md'
  icon?: string
  className?: string
}

const TONES: Record<string, { bg: string; fg: string; bd: string }> = {
  neutral: { bg: 'var(--surface-3)', fg: 'var(--ink-3)', bd: 'transparent' },
  accent: { bg: 'var(--accent-tint)', fg: 'var(--accent-700)', bd: 'var(--accent-tint-2)' },
  gold: { bg: 'var(--gold-tint)', fg: 'var(--gold)', bd: 'var(--gold-tint-2)' },
  info: { bg: '#EFF6FF', fg: '#1D4ED8', bd: '#DBEAFE' },
  danger: { bg: '#FEF2F2', fg: '#C0383C', bd: '#FECDD3' },
}

export function Badge({ children, tone = 'neutral', size = 'md', icon, className = '' }: BadgeProps) {
  const t = TONES[tone]
  const sz = size === 'sm'
    ? { padding: '2px 8px', fontSize: 11.5, iconSize: 12 }
    : { padding: '4px 10px', fontSize: 12.5, iconSize: 14 }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: sz.padding,
        fontSize: sz.fontSize,
        fontWeight: 600,
        borderRadius: 'var(--r-full)',
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      {icon && <Icon name={icon} size={sz.iconSize} />}
      {children}
    </span>
  )
}

export default Badge
