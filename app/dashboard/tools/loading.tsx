import { Skeleton } from '@/components/ui/skeleton'

export default function ToolsLoading() {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '32px 24px' }}>
      <Skeleton width={280} height={32} style={{ marginBottom: 8 }} />
      <Skeleton width={420} height={18} style={{ marginBottom: 28 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={150} style={{ borderRadius: 'var(--r-lg)' }} />
        ))}
      </div>
    </div>
  )
}
