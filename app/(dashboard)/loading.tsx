const skeletonStyle = {
  background: 'var(--surface-2)',
  borderRadius: 'var(--r-sm)',
  animation: 'norte-skeleton 1.5s ease-in-out infinite',
} satisfies React.CSSProperties

export default function DashboardLoading() {
  return (
    <>
      <style>{`@keyframes norte-skeleton { 0%, 100% { opacity: .7 } 50% { opacity: .3 } }`}</style>
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Sidebar skeleton */}
        <div
          style={{
            width: 264,
            flexShrink: 0,
            height: '100%',
            borderRight: '1px solid var(--line)',
            background: 'var(--surface)',
            padding: '18px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ ...skeletonStyle, height: 28, width: 100, marginBottom: 8 }} />
          <div style={{ ...skeletonStyle, height: 36, borderRadius: 'var(--r-md)' }} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ ...skeletonStyle, height: 36, borderRadius: 'var(--r-md)' }} />
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ ...skeletonStyle, height: 44, borderRadius: 'var(--r-lg)' }} />
          <div style={{ ...skeletonStyle, height: 40, borderRadius: 'var(--r-md)' }} />
        </div>

        {/* Main content skeleton */}
        <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ ...skeletonStyle, height: 32, width: 200 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...skeletonStyle, height: 100, borderRadius: 'var(--r-lg)' }} />
            ))}
          </div>
          <div style={{ ...skeletonStyle, height: 24, width: 160 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ ...skeletonStyle, height: 60, borderRadius: 'var(--r-md)' }} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
