'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/icons'
import { signOut } from '@/actions/auth'
import type { Profile, Subscription } from '@/types'

interface Props {
  profile: Profile | null
  subscription: Subscription | null
  userEmail: string
}

export default function SettingsClient({ profile, subscription, userEmail }: Props) {
  const { theme, setTheme } = useTheme()
  const isPro = subscription?.plan === 'pro' && (subscription?.status === 'active' || subscription?.status === 'trialing')

  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [saving, setSaving] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, bio }),
      })
      if (res.ok) {
        toast.success('Perfil actualizado')
      } else {
        toast.error('Error al guardar')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleManageBilling = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error('Error al abrir portal de facturación')
    } finally {
      setPortalLoading(false)
    }
  }

  const handleUpgrade = async () => {
    const priceId = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: priceId || 'price_monthly' }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else toast.error('Error al iniciar el pago')
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 100px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>
        Ajustes
      </h1>

      {/* Profile */}
      <Card style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Perfil</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6 }}>
              Email
            </label>
            <div style={{ fontSize: 14.5, color: 'var(--ink-3)' }}>{userEmail}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6 }}>
              Nombre completo
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre"
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 14.5, background: 'var(--surface)', color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6 }}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntanos sobre tu negocio..."
              rows={3}
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 14.5, background: 'var(--surface)', color: 'var(--ink)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <Button variant="primary" onClick={handleSaveProfile} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Apariencia */}
      <Card style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Apariencia</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          {([
            { value: 'system', label: 'Sistema', icon: (
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <rect x={2} y={3} width={20} height={14} rx={2} />
                <path d="M8 21h8M12 17v4" strokeLinecap="round" />
              </svg>
            )},
            { value: 'light', label: 'Claro', icon: (
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <circle cx={12} cy={12} r={5} />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
              </svg>
            )},
            { value: 'dark', label: 'Oscuro', icon: (
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )},
          ] as const).map(({ value, label, icon }) => {
            const active = theme === value
            return (
              <button
                key={value}
                onClick={() => setTheme(value)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 12px',
                  borderRadius: 'var(--r-md)',
                  border: active ? '2px solid var(--accent)' : '1.5px solid var(--line-2)',
                  background: active ? 'var(--accent-tint)' : 'var(--surface-2)',
                  color: active ? 'var(--accent-700)' : 'var(--ink-3)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  transition: 'border-color .15s, background .15s, color .15s',
                }}
              >
                {icon}
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Subscription */}
      <Card style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Plan</h2>
          {isPro
            ? <Badge tone="gold" icon="crown">Pro</Badge>
            : <Badge tone="neutral">Gratuito</Badge>
          }
        </div>
        {isPro ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-3)' }}>
              Mensajes ilimitados · Todas las herramientas · IA avanzada
              {subscription?.current_period_end && (
                <span style={{ display: 'block', marginTop: 4, fontSize: 13, color: 'var(--ink-4)' }}>
                  Activo hasta: {new Date(subscription.current_period_end).toLocaleDateString('es-ES')}
                </span>
              )}
            </p>
            <div>
              <Button variant="secondary" onClick={handleManageBilling} disabled={portalLoading}>
                {portalLoading ? 'Cargando...' : 'Gestionar facturación'}
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: 0, fontSize: 14.5, color: 'var(--ink-3)' }}>
              10 mensajes/día · 3 herramientas básicas
            </p>
            <div>
              <Button variant="gold" icon="crown" onClick={handleUpgrade}>
                Mejorar a Pro — 19€/mes
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Sign out */}
      <Card style={{ padding: 24 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 17, fontWeight: 700, color: 'var(--danger)' }}>Zona de peligro</h2>
        <form action={signOut}>
          <Button type="submit" variant="secondary">
            <Icon name="logout" size={16} />
            <span>Cerrar sesión</span>
          </Button>
        </form>
      </Card>
    </div>
  )
}
