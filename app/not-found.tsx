import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: 'var(--canvas)' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <Logo size={36} label="Norte" />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 72, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--accent)', lineHeight: 1 }}>
          404
        </div>
        <h1 style={{ margin: '12px 0 8px', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>
          Página no encontrada
        </h1>
        <p style={{ margin: '0 0 24px', fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.5 }}>
          La página que buscas no existe o se ha movido.
        </p>
        <Link href="/dashboard">
          <Button variant="primary" icon="home">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}
