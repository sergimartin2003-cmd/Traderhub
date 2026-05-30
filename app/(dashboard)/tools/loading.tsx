const skeletonStyle = {
  background: 'var(--surface-2)',
  borderRadius: 'var(--r-sm)',
  animation: 'norte-skeleton 1.5s ease-in-out infinite',
} satisfies React.CSSProperties

export default function ToolsLoading() {
  return (
    <>
      <style>{`@keyframes norte-skeleton { 0%, 100% { opacity: .7 } 50% { opacity: .3 } }`}</style>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ ...skeletonStyle, height: 34, width: 180, marginBottom: 8 }} />
        <div style={{ ...skeletonStyle, height: 18, width: 300, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
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
              }}
            >
              <div style={{ ...skeletonStyle, width: 44, height: 44, borderRadius: 'var(--r-md)' }} />
              <div style={{ ...skeletonStyle, height: 20, width: '65%' }} />
              <div style={{ ...skeletonStyle, height: 14, width: '90%' }} />
              <div style={{ ...skeletonStyle, height: 14, width: '70%' }} />
              <div style={{ ...skeletonStyle, height: 36, borderRadius: 'var(--r-md)', marginTop: 4 }} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
