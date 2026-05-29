'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ─── Left panel ───────────────────────────────────────────────────────────────

function AuthAside() {
  return (
    <div
      className="auth-aside"
      style={{
        flex: 1,
        background: 'var(--ink)',
        color: '#fff',
        padding: '48px 44px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100%',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
        <svg width={26} height={26} viewBox="0 0 32 32" fill="none">
          <path d="M16 3.5 19.2 16 16 28.5 12.8 16z" fill="#10B981" />
          <path d="M5 16 16 14.2 27 16 16 17.8z" fill="#10B981" opacity={0.4} />
        </svg>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 17,
            letterSpacing: '-0.03em',
            color: '#fff',
          }}
        >
          Norte
        </span>
      </Link>

      {/* Tagline */}
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
            margin: '0 0 16px',
            maxWidth: 360,
          }}
        >
          El estratega que tu negocio necesita, hoy.
        </h2>
        <p
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.55,
            maxWidth: 340,
            margin: 0,
          }}
        >
          Valida ideas, diseña tu marketing y fija tus precios con criterio. Empieza gratis.
        </p>
      </div>

      {/* Security */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          fontSize: 13.5,
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          style={{ flexShrink: 0 }}
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Tus datos están protegidos con cifrado de extremo a extremo.
      </div>

      <style>{`@media (max-width: 860px){ .auth-aside{ display:none !important; } }`}</style>
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
}) {
  const [reveal, setReveal] = useState(false)
  const isPw = type === 'password'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={isPw && !reveal ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
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
            paddingRight: isPw ? 42 : 14,
          }}
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            style={{
              position: 'absolute',
              right: 10,
              color: 'var(--ink-4)',
              padding: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {reveal ? (
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1={1} y1={1} x2={23} y2={23} strokeLinecap="round" />
              </svg>
            ) : (
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx={12} cy={12} r={3} />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        setError('Email o contraseña incorrectos. Inténtalo de nuevo.')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Ocurrió un error. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (authError) setError('Error al conectar con Google.')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface)' }}>
      <AuthAside />

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Back link */}
        <div style={{ padding: '20px 24px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 13.5,
              fontWeight: 600,
              color: 'var(--ink-3)',
              textDecoration: 'none',
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver
          </Link>
        </div>

        {/* Form area */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            placeItems: 'center',
            padding: '20px 24px 40px',
          }}
        >
          <div style={{ width: '100%', maxWidth: 380 }}>
            {/* Mobile logo */}
            <div
              className="auth-logo-mobile"
              style={{ display: 'none', justifyContent: 'center', marginBottom: 24 }}
            >
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
                <svg width={24} height={24} viewBox="0 0 32 32" fill="none">
                  <path d="M16 3.5 19.2 16 16 28.5 12.8 16z" fill="#10B981" />
                  <path d="M5 16 16 14.2 27 16 16 17.8z" fill="#10B981" opacity={0.4} />
                </svg>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 17,
                    letterSpacing: '-0.03em',
                    color: 'var(--ink)',
                  }}
                >
                  Norte
                </span>
              </Link>
            </div>

            <h1
              style={{
                margin: '0 0 6px',
                fontFamily: 'var(--font-display)',
                fontSize: 27,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
              }}
            >
              Bienvenido de vuelta
            </h1>
            <p style={{ margin: '0 0 26px', fontSize: 15, color: 'var(--ink-3)' }}>
              Entra para seguir donde lo dejaste.
            </p>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '12px 20px',
                border: '1.5px solid var(--line-2)',
                borderRadius: 'var(--r-md)',
                background: 'var(--surface)',
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--ink)',
                cursor: 'pointer',
                marginBottom: 12,
                fontFamily: 'var(--font-display)',
              }}
            >
              <span style={{ fontWeight: 700, color: '#4285F4', fontSize: 17 }}>G</span>
              Continuar con Google
            </button>

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                margin: '4px 0 18px',
                color: 'var(--ink-4)',
                fontSize: 12.5,
              }}
            >
              <div style={{ flex: 1, height: 1, background: 'var(--line-2)' }} />
              o con tu email
              <div style={{ flex: 1, height: 1, background: 'var(--line-2)' }} />
            </div>

            {/* Error */}
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

            {/* Form */}
            <form
              onSubmit={handleLogin}
              style={{ display: 'flex', flexDirection: 'column', gap: 15 }}
            >
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="tu@email.com"
                autoComplete="email"
              />
              <Field
                label="Contraseña"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                autoComplete="current-password"
              />

              {/* Forgot password */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8 }}>
                <Link
                  href="/forgot-password"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--accent-700)',
                    textDecoration: 'none',
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  borderRadius: 'var(--r-md)',
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#fff',
                  background: loading || !email || !password ? 'var(--ink-4)' : 'var(--accent)',
                  border: 'none',
                  cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                  marginTop: 4,
                  fontFamily: 'var(--font-display)',
                  transition: 'background .15s',
                }}
              >
                {loading ? 'Entrando…' : 'Entrar'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--ink-3)' }}>
              ¿No tienes cuenta?{' '}
              <Link
                href="/register"
                style={{ fontWeight: 700, color: 'var(--accent-700)', textDecoration: 'none' }}
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 860px){ .auth-logo-mobile{ display:flex !important; } }`}</style>
    </div>
  )
}
