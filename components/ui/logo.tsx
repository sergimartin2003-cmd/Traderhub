interface LogoProps {
  size?: number
  label?: string
  color?: string
  className?: string
  style?: React.CSSProperties
}

export function Logo({
  size = 26,
  label,
  color = 'var(--accent)',
  className = '',
  style = {},
}: LogoProps) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        {/* anillo */}
        <circle
          cx={16}
          cy={16}
          r={14.5}
          stroke={color}
          strokeWidth={1.5}
          opacity={0.28}
        />
        {/* aguja norte (rombo alargado) */}
        <path d="M16 3.5 19.2 16 16 28.5 12.8 16z" fill={color} />
        <path
          d="M16 3.5 16 16 12.8 16z"
          fill="#fff"
          opacity={0.35}
        />
        {/* eje horizontal sutil */}
        <path
          d="M5 16 16 14.2 27 16 16 17.8z"
          fill={color}
          opacity={0.32}
        />
      </svg>

      {label && (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: size * 0.78,
            letterSpacing: '-0.03em',
            color: 'var(--ink)',
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

export default Logo
