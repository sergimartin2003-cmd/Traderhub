import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Norte',
    template: '%s | Norte',
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--canvas)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  )
}
