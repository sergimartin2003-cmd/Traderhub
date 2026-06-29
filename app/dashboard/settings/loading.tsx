import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsLoading() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Skeleton width={160} height={32} />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} height={180} style={{ borderRadius: 'var(--r-xl)' }} />
      ))}
    </div>
  )
}
