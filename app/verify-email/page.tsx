import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { ResendVerificationButton } from './resend-button'

export default async function VerifyEmailPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--canvas)',
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
          maxWidth: 440,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-xl)',
          padding: '40px 36px',
          boxShadow: 'var(--sh-md)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          textAlign: 'center',
        }}
      >
        <Link href="/">
          <Logo size={32} label="Norte" />
        </Link>

        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--r-full)',
            background: 'var(--accent-tint)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.8}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
            }}
          >
            Verifica tu email
          </h1>
          {user?.email && (
            <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-3)' }}>
              Hemos enviado un enlace de verificación a{' '}
              <strong style={{ color: 'var(--ink-2)' }}>{user.email}</strong>
            </p>
          )}
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6 }}>
            Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta. Si no lo ves, mira en spam.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          {user?.email && <ResendVerificationButton email={user.email} />}

          <a
            href="/dashboard"
            style={{
              width: '100%',
              padding: '11px 20px',
              borderRadius: 'var(--r-md)',
              fontSize: 14.5,
              fontWeight: 600,
              color: 'var(--ink-2)',
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              textDecoration: 'none',
              display: 'block',
              boxSizing: 'border-box',
            }}
          >
            Ya lo verifiqué — ir al panel
          </a>
        </div>

        <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-4)' }}>
          ¿Quieres usar otra cuenta?{' '}
          <Link
            href="/login"
            style={{ color: 'var(--accent-700)', fontWeight: 600, textDecoration: 'none' }}
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
