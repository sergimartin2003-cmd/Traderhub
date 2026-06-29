'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App Error]', error)
  }, [error])

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--canvas)' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ width: 64, height: 64, borderRadius: 'var(--r-lg)', background: '#FEF2F2', color: 'var(--danger)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
          <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </div>
        <h1 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>
          Algo ha ido mal
        </h1>
        <p style={{ margin: '0 0 24px', fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.5 }}>
          Ha ocurrido un error inesperado. Puedes reintentar o volver al inicio.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Button variant="primary" icon="refresh" onClick={() => reset()}>
            Reintentar
          </Button>
          <Link href="/dashboard">
            <Button variant="secondary">Ir al inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
