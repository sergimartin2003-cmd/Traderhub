const skeletonStyle = {
  background: 'var(--surface-2)',
  borderRadius: 'var(--r-sm)',
  animation: 'norte-skeleton 1.5s ease-in-out infinite',
} satisfies React.CSSProperties

export default function ChatLoading() {
  return (
    <>
      <style>{`@keyframes norte-skeleton { 0%, 100% { opacity: .7 } 50% { opacity: .3 } }`}</style>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px', gap: 16, maxWidth: 720, margin: '0 auto', width: '100%' }}>
        {/* Bubbles: alternating left/right */}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ ...skeletonStyle, height: 64, width: '60%', borderRadius: 'var(--r-lg)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ ...skeletonStyle, height: 40, width: '40%', borderRadius: 'var(--r-lg)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ ...skeletonStyle, height: 96, width: '72%', borderRadius: 'var(--r-lg)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ ...skeletonStyle, height: 40, width: '50%', borderRadius: 'var(--r-lg)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ ...skeletonStyle, height: 56, width: '55%', borderRadius: 'var(--r-lg)' }} />
        </div>

        {/* Input skeleton */}
        <div style={{ marginTop: 'auto', ...skeletonStyle, height: 52, borderRadius: 'var(--r-xl)' }} />
      </div>
    </>
  )
}
