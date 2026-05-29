'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function Field({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
}) {
  const [reveal, setReveal] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type={reveal ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--line-2)')}
          style={{
            width: '100%',
            padding: '12px 42px 12px 14px',
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
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mismatch = confirm.length > 0 && password !== confirm
  const valid = password.length >= 6 && password === confirm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        setError('No se pudo actualizar la contraseña. El enlace puede haber expirado.')
        return
      }

      router.push('/login?reset=success')
    } catch {
      setError('Ocurrió un error. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
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
            Nueva contraseña
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.55 }}>
            Elige una contraseña segura de al menos 6 caracteres.
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <Field
              label="Nueva contraseña"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <Field
              label="Confirmar contraseña"
              value={confirm}
              onChange={setConfirm}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            {mismatch && (
              <p style={{ margin: '-8px 0 0', fontSize: 13, color: 'var(--danger)' }}>
                Las contraseñas no coinciden.
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !valid}
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: 'var(--r-md)',
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                background: loading || !valid ? 'var(--ink-4)' : 'var(--accent)',
                border: 'none',
                cursor: loading || !valid ? 'not-allowed' : 'pointer',
                marginTop: 4,
                fontFamily: 'var(--font-display)',
                transition: 'background .15s',
              }}
            >
              {loading ? 'Guardando…' : 'Guardar contraseña'}
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
