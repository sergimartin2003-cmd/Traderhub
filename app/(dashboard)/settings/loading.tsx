const skeletonStyle = {
  background: 'var(--surface-2)',
  borderRadius: 'var(--r-sm)',
  animation: 'norte-skeleton 1.5s ease-in-out infinite',
} satisfies React.CSSProperties

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  borderRadius: 'var(--r-lg)',
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}

export default function SettingsLoading() {
  return (
    <>
      <style>{`@keyframes norte-skeleton { 0%, 100% { opacity: .7 } 50% { opacity: .3 } }`}</style>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 100px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ ...skeletonStyle, height: 34, width: 120 }} />

        {/* Profile card */}
        <div style={cardStyle}>
          <div style={{ ...skeletonStyle, height: 20, width: 80 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ ...skeletonStyle, height: 14, width: 60 }} />
              <div style={{ ...skeletonStyle, height: 40, borderRadius: 'var(--r-md)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ ...skeletonStyle, height: 14, width: 100 }} />
              <div style={{ ...skeletonStyle, height: 40, borderRadius: 'var(--r-md)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ ...skeletonStyle, height: 14, width: 40 }} />
              <div style={{ ...skeletonStyle, height: 80, borderRadius: 'var(--r-md)' }} />
            </div>
            <div style={{ ...skeletonStyle, height: 38, width: 140, borderRadius: 'var(--r-md)' }} />
          </div>
        </div>

        {/* Appearance card */}
        <div style={cardStyle}>
          <div style={{ ...skeletonStyle, height: 20, width: 100 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...skeletonStyle, flex: 1, height: 72, borderRadius: 'var(--r-md)' }} />
            ))}
          </div>
        </div>

        {/* Plan card */}
        <div style={cardStyle}>
          <div style={{ ...skeletonStyle, height: 20, width: 60 }} />
          <div style={{ ...skeletonStyle, height: 56, borderRadius: 'var(--r-md)' }} />
          <div style={{ ...skeletonStyle, height: 38, width: 180, borderRadius: 'var(--r-md)' }} />
        </div>
      </div>
    </>
  )
}
