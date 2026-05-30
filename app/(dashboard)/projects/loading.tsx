const skeletonStyle = {
  background: 'var(--surface-2)',
  borderRadius: 'var(--r-sm)',
  animation: 'norte-skeleton 1.5s ease-in-out infinite',
} satisfies React.CSSProperties

export default function ProjectsLoading() {
  return (
    <>
      <style>{`@keyframes norte-skeleton { 0%, 100% { opacity: .7 } 50% { opacity: .3 } }`}</style>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ ...skeletonStyle, height: 34, width: 220, marginBottom: 22 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-lg)',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                minHeight: 130,
              }}
            >
              <div style={{ ...skeletonStyle, width: 40, height: 40, borderRadius: 'var(--r-sm)' }} />
              <div style={{ ...skeletonStyle, height: 18, width: '75%' }} />
              <div style={{ ...skeletonStyle, height: 14, width: '45%' }} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
