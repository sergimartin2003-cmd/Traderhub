'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-xl)',
          padding: '32px 28px',
          boxShadow: 'var(--sh-sm)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 'var(--r-full)',
            background: '#FEF2F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth={1.8}>
            <circle cx={12} cy={12} r={10} />
            <line x1={12} y1={8} x2={12} y2={12} strokeLinecap="round" />
            <line x1={12} y1={16} x2={12.01} y2={16} strokeLinecap="round" />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Algo salió mal
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6 }}>
            {error.message || 'Se produjo un error inesperado al cargar esta sección.'}
          </p>
          {error.digest && (
            <p style={{ margin: 0, fontSize: 11.5, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)' }}>
              {error.digest}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <button
            onClick={reset}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 'var(--r-md)',
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              background: 'var(--accent)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
            }}
          >
            Reintentar
          </button>
          <Link
            href="/dashboard"
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 'var(--r-md)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--ink-2)',
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Ir al panel
          </Link>
        </div>
      </div>
    </div>
  )
}
