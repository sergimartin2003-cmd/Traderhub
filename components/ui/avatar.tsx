interface AvatarProps {
  name?: string
  size?: number
  src?: string
  className?: string
  style?: React.CSSProperties
}

function hashName(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const GRADIENTS = [
  'linear-gradient(140deg, #2DD4A7, #0E9F6E)',
  'linear-gradient(140deg, #60A5FA, #2563EB)',
  'linear-gradient(140deg, #F472B6, #DB2777)',
  'linear-gradient(140deg, #FBBF24, #D97706)',
  'linear-gradient(140deg, #A78BFA, #7C3AED)',
  'linear-gradient(140deg, #34D399, #059669)',
  'linear-gradient(140deg, #FB923C, #EA580C)',
  'linear-gradient(140deg, #38BDF8, #0284C7)',
]

export function Avatar({ name = 'Tú', size = 36, src, className = '', style = {} }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const gradient = GRADIENTS[hashName(name) % GRADIENTS.length]

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: 'var(--r-full)',
          flexShrink: 0,
          objectFit: 'cover',
          ...style,
        }}
      />
    )
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--r-full)',
        flexShrink: 0,
        background: gradient,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.4,
        letterSpacing: '-0.02em',
        boxShadow:
          'inset 0 1px 1px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.08)',
        userSelect: 'none',
        ...style,
      }}
    >
      {initials}
    </div>
  )
}

export default Avatar
