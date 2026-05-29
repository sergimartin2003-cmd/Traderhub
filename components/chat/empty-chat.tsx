'use client'

interface EmptyChatProps {
  onSuggestion: (text: string) => void
  brandName: string
}

const SUGGESTIONS = [
  { icon: '🎯', text: 'Valida mi idea de negocio' },
  { icon: '📣', text: 'Plan de marketing para mi lanzamiento' },
  { icon: '💰', text: '¿Cómo pongo precio a mi SaaS?' },
  { icon: '🔍', text: 'Analiza a mis competidores' },
]

function NorteMark({ size = 56 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        boxShadow: 'var(--sh-xs)',
      }}
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 32 32"
        fill="none"
      >
        <path d="M16 3.5 19.2 16 16 28.5 12.8 16z" fill="var(--accent)" />
        <path d="M5 16 16 14.2 27 16 16 17.8z" fill="var(--accent)" opacity={0.4} />
      </svg>
    </div>
  )
}

export function EmptyChat({ onSuggestion, brandName }: EmptyChatProps) {
  return (
    <div
      style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: '8vh 24px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'inline-flex', marginBottom: 20 }}>
        <NorteMark size={56} />
      </div>

      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: '-0.03em',
        }}
      >
        ¿En qué avanzamos hoy?
      </h2>

      <p
        style={{
          margin: '8px 0 28px',
          fontSize: 15.5,
          color: 'var(--ink-3)',
        }}
      >
        Pregúntame lo que sea sobre tu negocio. Pienso como un estratega y te
        doy el siguiente paso.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 12,
        }}
      >
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(s.text)}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                'var(--accent)'
              ;(e.currentTarget as HTMLButtonElement).style.transform =
                'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                'var(--line-2)'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'none'
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '14px 16px',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--line-2)',
              background: 'var(--surface)',
              textAlign: 'left',
              fontSize: 14,
              color: 'var(--ink-2)',
              transition: 'all .18s ease',
              boxShadow: 'var(--sh-xs)',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontSize: 18,
                flexShrink: 0,
                color: 'var(--accent)',
              }}
            >
              {s.icon}
            </span>
            <span>{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
