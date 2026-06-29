import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '32px 24px' }}>
      <Skeleton width={260} height={32} style={{ marginBottom: 8 }} />
      <Skeleton width={360} height={18} style={{ marginBottom: 28 }} />
      <Skeleton height={120} style={{ marginBottom: 28, borderRadius: 'var(--r-xl)' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={140} style={{ borderRadius: 'var(--r-lg)' }} />
        ))}
      </div>
    </div>
  )
}
