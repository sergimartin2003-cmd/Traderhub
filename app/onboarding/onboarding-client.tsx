'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'
import { completeOnboarding } from '@/actions/onboarding'

const GOALS = [
  { value: 'validar', label: 'Validar una idea de negocio', icon: 'target' },
  { value: 'lanzar', label: 'Lanzar mi producto al mercado', icon: 'rocket' },
  { value: 'crecer', label: 'Hacer crecer mi negocio actual', icon: 'trend' },
  { value: 'marketing', label: 'Mejorar mi marketing y ventas', icon: 'megaphone' },
]

const STYLES = [
  { value: 'idea', label: 'Tengo solo una idea' },
  { value: 'mvp', label: 'Tengo un MVP o prototipo' },
  { value: 'negocio', label: 'Ya tengo un negocio en marcha' },
]

export default function OnboardingClient({ initialName }: { initialName: string }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(initialName)
  const [business, setBusiness] = useState('')
  const [goal, setGoal] = useState('')
  const [style, setStyle] = useState('')

  const TOTAL = 3

  const canNext =
    step === 0 ? name.trim().length > 1 : step === 1 ? goal !== '' : step === 2 ? style !== '' : true

  const finish = async () => {
    setSaving(true)
    const res = await completeOnboarding({
      full_name: name,
      business,
      goal: GOALS.find((g) => g.value === goal)?.label ?? goal,
      trading_style: STYLES.find((s) => s.value === style)?.label ?? style,
    })
    if ('error' in res) {
      setSaving(false)
      toast.error(res.error)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  const next = () => {
    if (step < TOTAL - 1) setStep((s) => s + 1)
    else finish()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--canvas)' }}>
      {/* Header + progress */}
      <header style={{ padding: '22px 24px 0', maxWidth: 560, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <Logo size={26} label="Norte" />
          <span style={{ fontSize: 13, color: 'var(--ink-4)', fontWeight: 600 }}>
            Paso {step + 1} de {TOTAL}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: 'var(--surface-3)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((step + 1) / TOTAL) * 100}%`, background: 'var(--accent)', borderRadius: 999, transition: 'width .3s var(--ease-out)' }} />
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: 'min(520px, 100%)' }}>
          {step === 0 && (
            <div>
              <h1 style={titleStyle}>¡Bienvenido a Norte! 👋</h1>
              <p style={subStyle}>Tu copiloto de IA para emprender. Empecemos por conocerte.</p>
              <label style={labelStyle}>¿Cómo te llamas?</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canNext && next()}
                placeholder="Tu nombre"
                style={inputStyle}
              />
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 style={titleStyle}>¿Cuál es tu objetivo principal?</h1>
              <p style={subStyle}>Así Norte adapta sus respuestas a lo que necesitas.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                {GOALS.map((g) => (
                  <button key={g.value} onClick={() => setGoal(g.value)} style={optionStyle(goal === g.value)}>
                    <span style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: goal === g.value ? 'var(--accent-tint)' : 'var(--surface-3)', color: goal === g.value ? 'var(--accent-700)' : 'var(--ink-3)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <Icon name={g.icon} size={18} />
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{g.label}</span>
                  </button>
                ))}
              </div>
              <label style={labelStyle}>¿A qué se dedica tu negocio? (opcional)</label>
              <input
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="Ej: tienda online de ropa sostenible"
                style={inputStyle}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 style={titleStyle}>¿En qué punto estás?</h1>
              <p style={subStyle}>Último paso. Esto nos ayuda a darte el mejor punto de partida.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {STYLES.map((s) => (
                  <button key={s.value} onClick={() => setStyle(s.value)} style={optionStyle(style === s.value)}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{s.label}</span>
                    {style === s.value && <Icon name="checkCircle" size={20} style={{ marginLeft: 'auto', color: 'var(--accent)' }} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nav */}
          <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
            {step > 0 && (
              <Button variant="secondary" icon="arrowLeft" onClick={() => setStep((s) => s - 1)} disabled={saving}>
                Atrás
              </Button>
            )}
            <div style={{ flex: 1 }} />
            <Button
              variant="primary"
              iconRight={step === TOTAL - 1 ? 'check' : 'arrowRight'}
              onClick={next}
              disabled={!canNext || saving}
            >
              {saving ? 'Guardando...' : step === TOTAL - 1 ? 'Empezar' : 'Continuar'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

const titleStyle: React.CSSProperties = {
  margin: '0 0 8px',
  fontFamily: 'var(--font-display)',
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: '-0.03em',
}
const subStyle: React.CSSProperties = { margin: '0 0 24px', fontSize: 15.5, color: 'var(--ink-3)', lineHeight: 1.5 }
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 7 }
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: '1.5px solid var(--line-2)',
  borderRadius: 'var(--r-md)',
  fontSize: 15,
  background: 'var(--surface)',
  color: 'var(--ink)',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}
function optionStyle(active: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '14px 16px',
    borderRadius: 'var(--r-lg)',
    border: `1.5px solid ${active ? 'var(--accent)' : 'var(--line-2)'}`,
    background: active ? 'var(--accent-tint)' : 'var(--surface)',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    color: 'var(--ink)',
    transition: 'border-color .14s, background .14s',
  }
}
