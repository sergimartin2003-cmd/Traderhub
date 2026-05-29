'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (authError) {
        setError('No pudimos procesar tu solicitud. Inténtalo de nuevo.')
        return
      }

      setSuccess(true)
    } catch {
      setError('Ocurrió un error. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: 'var(--canvas)',
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 440,
            width: '100%',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-2xl)',
            padding: '40px 36px',
            textAlign: 'center',
            boxShadow: 'var(--sh-md)',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--r-full)',
              background: 'var(--accent-tint)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px',
            }}
          >
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h2
            style={{
              margin: '0 0 10px',
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
            }}
          >
            Revisa tu email
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.55 }}>
            Si existe una cuenta con <strong style={{ color: 'var(--ink)' }}>{email}</strong>,
            recibirás un enlace para restablecer tu contraseña en breve.
          </p>
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '10px 22px',
              borderRadius: 'var(--r-md)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--ink)',
              border: '1.5px solid var(--line-2)',
              background: 'var(--surface)',
              textDecoration: 'none',
            }}
          >
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--canvas)',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <svg width={26} height={26} viewBox="0 0 32 32" fill="none">
              <path d="M16 3.5 19.2 16 16 28.5 12.8 16z" fill="#10B981" />
              <path d="M5 16 16 14.2 27 16 16 17.8z" fill="#10B981" opacity={0.4} />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
              }}
            >
              Norte
            </span>
          </Link>
        </div>

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-2xl)',
            padding: '36px 32px',
            boxShadow: 'var(--sh-sm)',
          }}
        >
          <h1
            style={{
              margin: '0 0 8px',
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
            }}
          >
            Recuperar contraseña
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.55 }}>
            Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--r-md)',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                fontSize: 13.5,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--line-2)')}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid var(--line-2)',
                  borderRadius: 'var(--r-md)',
                  fontSize: 15,
                  outline: 'none',
                  transition: 'border-color .15s',
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-display)',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.includes('@')}
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: 'var(--r-md)',
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                background:
                  loading || !email.includes('@') ? 'var(--ink-4)' : 'var(--accent)',
                border: 'none',
                cursor: loading || !email.includes('@') ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-display)',
                transition: 'background .15s',
              }}
            >
              {loading ? 'Enviando…' : 'Enviar enlace'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--ink-3)' }}>
            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontWeight: 600,
                color: 'var(--ink-3)',
                textDecoration: 'none',
              }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
