interface ProgressRingProps {
  value?: number
  size?: number
  stroke?: number
  color?: string
  track?: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function ProgressRing({
  value = 0,
  size = 44,
  stroke = 4,
  color = 'var(--accent)',
  track = 'var(--line-2)',
  children,
  className = '',
  style = {},
}: ProgressRingProps) {
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (value / 100) * circumference

  return (
    <div
      className={className}
      style={{ position: 'relative', width: size, height: size, ...style }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={stroke}
        />
        {/* progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .6s var(--ease-out)' }}
        />
      </svg>

      {children && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default ProgressRing
