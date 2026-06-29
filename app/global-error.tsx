'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#FBFBFA' }}>
          <div style={{ textAlign: 'center', maxWidth: 420 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>Error crítico</h1>
            <p style={{ color: '#6b7280', margin: '0 0 24px' }}>
              {error.message || 'La aplicación ha encontrado un error inesperado.'}
            </p>
            <button
              onClick={() => reset()}
              style={{ padding: '10px 18px', borderRadius: 10, background: '#10B981', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
