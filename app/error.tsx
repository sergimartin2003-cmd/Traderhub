'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Error]', error)
  }, [error])

  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif', background: '#FBFBFA', color: '#131316' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#FFFFFF',
              border: '1px solid #ECECEA',
              borderRadius: 16,
              padding: '40px 36px',
              boxShadow: '0 4px 16px rgba(19,19,22,0.06)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Logo size={30} label="Norte" />
            </Link>

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#E5484D" strokeWidth={1.8}>
                <circle cx={12} cy={12} r={10} />
                <line x1={12} y1={8} x2={12} y2={12} strokeLinecap="round" />
                <line x1={12} y1={16} x2={12.01} y2={16} strokeLinecap="round" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>
                Algo salió mal
              </h1>
              <p style={{ margin: 0, fontSize: 14.5, color: '#6B6B74', lineHeight: 1.6 }}>
                {error.message || 'Se produjo un error inesperado. Por favor, inténtalo de nuevo.'}
              </p>
              {error.digest && (
                <p style={{ margin: 0, fontSize: 12, color: '#9B9BA3', fontFamily: 'monospace' }}>
                  ID: {error.digest}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <button
                onClick={reset}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 12,
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: '#fff',
                  background: '#10B981',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Intentar de nuevo
              </button>
              <Link
                href="/"
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: 12,
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: '#3F3F46',
                  background: '#F7F7F6',
                  border: '1px solid #ECECEA',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
