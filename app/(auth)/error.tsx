'use client'

import { useEffect } from 'react'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Auth Error]', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--canvas)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-xl)',
          padding: '32px 28px',
          boxShadow: 'var(--sh-md)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--r-full)',
            background: '#FEF2F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth={1.8}>
            <circle cx={12} cy={12} r={10} />
            <line x1={12} y1={8} x2={12} y2={12} strokeLinecap="round" />
            <line x1={12} y1={16} x2={12.01} y2={16} strokeLinecap="round" />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
            Error de autenticación
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.5 }}>
            {error.message || 'Ocurrió un error. Inténtalo de nuevo.'}
          </p>
          {error.digest && (
            <p style={{ margin: 0, fontSize: 11.5, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)' }}>
              {error.digest}
            </p>
          )}
        </div>

        <button
          onClick={reset}
          style={{
            width: '100%',
            padding: '11px 20px',
            borderRadius: 'var(--r-md)',
            fontSize: 14.5,
            fontWeight: 700,
            color: '#fff',
            background: 'var(--accent)',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
          }}
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
