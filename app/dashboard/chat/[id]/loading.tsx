import { Skeleton } from '@/components/ui/skeleton'

export default function ChatLoading() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '30px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 13, flexDirection: i % 2 ? 'row-reverse' : 'row' }}>
          <Skeleton width={30} height={30} rounded style={{ flexShrink: 0 }} />
          <Skeleton width={`${55 + (i % 3) * 12}%`} height={i % 2 ? 44 : 80} style={{ borderRadius: 'var(--r-lg)' }} />
        </div>
      ))}
    </div>
  )
}
