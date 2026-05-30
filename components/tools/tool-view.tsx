'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RichText, ScoreCard, LeanCanvas, DataTable, DualList, Checklist, AdCard } from '@/components/chat/chat-blocks'

// ─── Tool configs ─────────────────────────────────────────────────────────────

interface FieldConfig {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

interface ToolConfig {
  id: string
  name: string
  icon: string
  accent: string
  pro: boolean
  tagline: string
  fields: FieldConfig[]
  prompt: (input: Record<string, string>) => string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: (result: any) => React.ReactNode[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fallback: any
}

const TOOL_CONFIGS: Record<string, ToolConfig> = {
  idea: {
    id: 'idea',
    name: 'Validador de Ideas',
    icon: 'target',
    accent: '#10B981',
    pro: false,
    tagline: 'Puntúa viabilidad, mercado y riesgo de tu idea con un veredicto accionable.',
    fields: [
      {
        key: 'idea',
        label: 'Describe tu idea de negocio',
        type: 'textarea',
        placeholder: 'Ej: una suscripción de café de especialidad entregado quincenalmente…',
      },
      {
        key: 'market',
        label: 'Mercado o país objetivo (opcional)',
        type: 'text',
        placeholder: 'Ej: España, profesionales 28-45',
      },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prompt: (i: any) =>
      `Valida esta idea de negocio: "${i.idea}". Mercado objetivo: "${i.market || 'general'}".
Devuelve JSON con esta forma exacta:
{"title":"nombre corto de la idea","verdict":"Viable|Con reservas|Arriesgada","overall":<0-100>,"metrics":[{"label":"Demanda de mercado","value":<0-100>},{"label":"Margen unitario","value":<0-100>},{"label":"Competencia","value":<0-100>},{"label":"Escalabilidad","value":<0-100>},{"label":"Timing","value":<0-100>}],"strengths":["3 fortalezas concretas"],"risks":["3 riesgos concretos"],"canvas":[{"k":"Problema","v":"..."},{"k":"Solución","v":"..."},{"k":"Métricas","v":"..."},{"k":"Ventaja","v":"..."},{"k":"Propuesta de valor","v":"..."},{"k":"Canales","v":"..."},{"k":"Clientes","v":"..."},{"k":"Ingresos","v":"..."}],"nextSteps":["3 siguientes pasos"]}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (r: any) => [
      <ScoreCard key="s" data={r} />,
      <DualList
        key="d"
        left={{ title: 'Fortalezas', items: r.strengths }}
        right={{ title: 'Riesgos', items: r.risks }}
      />,
      <LeanCanvas key="c" data={{ blocks: r.canvas }} />,
      <Checklist key="n" title="Siguientes pasos" items={r.nextSteps} />,
    ],
    fallback: {
      title: 'Café de especialidad por suscripción',
      verdict: 'Viable',
      overall: 82,
      metrics: [
        { label: 'Demanda de mercado', value: 84 },
        { label: 'Margen unitario', value: 78 },
        { label: 'Competencia', value: 56 },
        { label: 'Escalabilidad', value: 71 },
        { label: 'Timing', value: 88 },
      ],
      strengths: [
        'Ingresos recurrentes predecibles',
        'Tolera precio premium (40-55% margen)',
        'Bajo CAC si construyes comunidad',
      ],
      risks: [
        'Logística de envío frágil',
        'Churn si la curación falla',
        'Competencia de tostadores locales',
      ],
      canvas: [
        { k: 'Problema', v: 'Café inconsistente y caro' },
        { k: 'Solución', v: 'Suscripción curada quincenal' },
        { k: 'Métricas', v: 'MRR, churn, LTV/CAC' },
        { k: 'Ventaja', v: 'Relación directa con tostadores' },
        { k: 'Propuesta de valor', v: 'Café fresco de origen a tu puerta' },
        { k: 'Canales', v: 'Instagram · referidos · catas' },
        { k: 'Clientes', v: 'Profesionales 28-45' },
        { k: 'Ingresos', v: 'Suscripción 24€/mes + tienda' },
      ],
      nextSteps: [
        'Entrevista a 15 clientes potenciales',
        'Calcula coste logístico real',
        'Lanza una lista de espera',
      ],
    },
  },

  canvas: {
    id: 'canvas',
    name: 'Lean Canvas',
    icon: 'grid',
    accent: '#3B82F6',
    pro: false,
    tagline: 'Tu modelo de negocio completo en 9 bloques, autogenerado.',
    fields: [
      {
        key: 'idea',
        label: 'Describe tu negocio',
        type: 'textarea',
        placeholder: 'Ej: plataforma SaaS de facturación para autónomos…',
      },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prompt: (i: any) =>
      `Crea un Lean Canvas para: "${i.idea}".
Devuelve JSON: {"summary":"2 frases resumiendo el modelo","blocks":[{"k":"Problema","v":"..."},{"k":"Solución","v":"..."},{"k":"Métricas clave","v":"..."},{"k":"Ventaja injusta","v":"..."},{"k":"Propuesta de valor","v":"..."},{"k":"Canales","v":"..."},{"k":"Segmento de clientes","v":"..."},{"k":"Estructura de costes / ingresos","v":"..."}]}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (r: any) => [
      <div key="t">
        <RichText value={r.summary || ''} />
      </div>,
      <LeanCanvas key="c" data={{ blocks: r.blocks }} />,
    ],
    fallback: {
      summary:
        'Modelo SaaS de suscripción para autónomos que automatiza la facturación y reduce el tiempo administrativo.',
      blocks: [
        { k: 'Problema', v: 'Facturar es lento y propenso a errores' },
        { k: 'Solución', v: 'Facturación automática con IA' },
        { k: 'Métricas clave', v: 'MRR, activación, churn' },
        { k: 'Ventaja injusta', v: 'Integración con Hacienda' },
        { k: 'Propuesta de valor', v: 'Factura en 30 segundos' },
        { k: 'Canales', v: 'SEO · partnerships · referidos' },
        { k: 'Segmento de clientes', v: 'Autónomos y micro-pymes' },
        { k: 'Estructura de costes / ingresos', v: 'Suscripción 12€/mes' },
      ],
    },
  },

  marketing: {
    id: 'marketing',
    name: 'Plan de Marketing',
    icon: 'megaphone',
    accent: '#8B5CF6',
    pro: false,
    tagline: 'Funnel de 4 etapas con canales, mensajes y KPIs.',
    fields: [
      {
        key: 'product',
        label: 'Producto o servicio',
        type: 'text',
        placeholder: 'Ej: curso online de fotografía',
      },
      {
        key: 'audience',
        label: 'Público objetivo',
        type: 'text',
        placeholder: 'Ej: aficionados que quieren monetizar',
      },
      {
        key: 'budget',
        label: 'Presupuesto',
        type: 'select',
        options: ['Bajo (bootstrap)', 'Medio', 'Alto'],
      },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prompt: (i: any) =>
      `Diseña un plan de marketing para "${i.product}", público "${i.audience}", presupuesto "${i.budget}".
Devuelve JSON: {"summary":"2-3 frases con la estrategia","funnel":[{"stage":"Atracción","channel":"...","kpi":"...","action":"..."},{"stage":"Captación","channel":"...","kpi":"...","action":"..."},{"stage":"Nutrición","channel":"...","kpi":"...","action":"..."},{"stage":"Conversión","channel":"...","kpi":"...","action":"..."}]}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (r: any) => [
      <div key="t">
        <RichText value={r.summary || ''} />
      </div>,
      <DataTable
        key="tb"
        data={{
          cols: ['Etapa', 'Canal', 'KPI'],
          rows: (r.funnel || []).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (f: any, idx: number) =>
              Object.assign([f.stage, f.channel, f.kpi], idx === 1 ? { highlight: true } : {})
          ),
        }}
      />,
      <Checklist
        key="a"
        title="Acciones por etapa"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items={(r.funnel || []).map((f: any) => `${f.stage}: ${f.action}`)}
      />,
    ],
    fallback: {
      summary:
        'Estrategia de comunidad primero: genera valor gratuito, captura emails con un lead magnet y convierte con una oferta de lanzamiento con escasez real.',
      funnel: [
        {
          stage: 'Atracción',
          channel: 'Reels / TikTok',
          kpi: 'Alcance',
          action: 'Publica 3 piezas de valor por semana',
        },
        {
          stage: 'Captación',
          channel: 'Landing + lead magnet',
          kpi: 'Opt-in %',
          action: 'Ofrece una guía gratuita a cambio del email',
        },
        {
          stage: 'Nutrición',
          channel: 'Email',
          kpi: 'Open / CTR',
          action: 'Secuencia de 5 emails: historia → prueba → oferta',
        },
        {
          stage: 'Conversión',
          channel: 'Página de venta',
          kpi: 'Conversión %',
          action: 'Oferta de 7 días con bonus',
        },
      ],
    },
  },

  ads: {
    id: 'ads',
    name: 'Generador de Anuncios',
    icon: 'bolt',
    accent: '#F59E0B',
    pro: true,
    tagline: 'Copys y ángulos listos para Meta, Google y TikTok.',
    fields: [
      {
        key: 'product',
        label: 'Qué anuncias',
        type: 'text',
        placeholder: 'Ej: app de finanzas personales',
      },
      {
        key: 'angle',
        label: 'Ángulo o beneficio principal',
        type: 'text',
        placeholder: 'Ej: ahorra sin pensar',
      },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prompt: (i: any) =>
      `Genera 3 anuncios para "${i.product}", ángulo "${i.angle}", para plataformas distintas (Meta, Google, TikTok).
Devuelve JSON: {"ads":[{"platform":"Meta","format":"Feed","headline":"...","body":"...","cta":"..."},{"platform":"Google","format":"Search","headline":"...","body":"...","cta":"..."},{"platform":"TikTok","format":"Vídeo","headline":"...","body":"...","cta":"..."}]}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (r: any) => (r.ads || []).map((ad: any, i: number) => <AdCard key={i} ad={ad} />),
    fallback: {
      ads: [
        {
          platform: 'Meta',
          format: 'Feed',
          headline: 'Ahorra sin pensar',
          body: 'Conecta tu banco y deja que la app aparte dinero por ti cada semana. Sin esfuerzo.',
          cta: 'Probar gratis',
        },
        {
          platform: 'Google',
          format: 'Search',
          headline: 'App de ahorro automático',
          body: 'Aparta dinero automáticamente y alcanza tus metas antes. +50.000 usuarios.',
          cta: 'Descargar',
        },
        {
          platform: 'TikTok',
          format: 'Vídeo',
          headline: 'Así ahorré 1.200€ sin darme cuenta',
          body: 'POV: dejas que una app ahorre por ti mientras vives tu vida.',
          cta: 'Ver cómo',
        },
      ],
    },
  },

  competitor: {
    id: 'competitor',
    name: 'Análisis de Competencia',
    icon: 'users',
    accent: '#EC4899',
    pro: true,
    tagline: 'Mapa competitivo, fortalezas, huecos y tu posicionamiento.',
    fields: [
      {
        key: 'business',
        label: 'Tu negocio',
        type: 'text',
        placeholder: 'Ej: agencia de diseño para startups',
      },
      {
        key: 'competitors',
        label: 'Competidores que conoces (opcional)',
        type: 'textarea',
        placeholder: 'Ej: Agencia A, Agencia B…',
      },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prompt: (i: any) =>
      `Analiza la competencia para "${i.business}". Competidores conocidos: "${i.competitors || 'desconócelos e infiérelos'}".
Devuelve JSON: {"competitors":[{"name":"...","price":"$|$$|$$$","strength":"...","weakness":"..."}],"opportunity":"el hueco de mercado en 2 frases","positioning":"frase de posicionamiento recomendada"}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (r: any) => [
      <DataTable
        key="tb"
        data={{
          cols: ['Competidor', 'Precio', 'Fortaleza', 'Hueco'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rows: (r.competitors || []).map((c: any) => [c.name, c.price, c.strength, c.weakness]),
        }}
      />,
      <div key="o">
        <RichText
          value={`## Tu oportunidad\n${r.opportunity || ''}\n\n## Posicionamiento recomendado\n**${r.positioning || ''}**`}
        />
      </div>,
    ],
    fallback: {
      competitors: [
        { name: 'Líder A', price: '$$$', strength: 'Marca consolidada', weakness: 'Caro y lento' },
        {
          name: 'Retador B',
          price: '$$',
          strength: 'Buen producto',
          weakness: 'Soporte deficiente',
        },
        {
          name: 'Low-cost C',
          price: '$',
          strength: 'Precio',
          weakness: 'Calidad inconsistente',
        },
      ],
      opportunity:
        'Hay un hueco en rapidez + acompañamiento cercano para startups que el líder no atiende por ser demasiado corporativo y lento.',
      positioning: 'La agencia que se mueve a la velocidad de tu startup.',
    },
  },

  pricing: {
    id: 'pricing',
    name: 'Estrategia de Precios',
    icon: 'scale',
    accent: '#06B6D4',
    pro: true,
    tagline: 'Arquitectura de planes con ancla de valor y efecto señuelo.',
    fields: [
      {
        key: 'product',
        label: 'Tu producto',
        type: 'text',
        placeholder: 'Ej: herramienta SaaS de email marketing',
      },
      {
        key: 'model',
        label: 'Modelo',
        type: 'select',
        options: ['Suscripción SaaS', 'Pago único', 'Freemium', 'Marketplace'],
      },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prompt: (i: any) =>
      `Diseña una estrategia de precios para "${i.product}", modelo "${i.model}".
Devuelve JSON: {"summary":"2 frases con la lógica","plans":[{"name":"Starter","price":"...","target":"...","conversion":"..."},{"name":"Growth","price":"...","target":"...","conversion":"..."},{"name":"Scale","price":"...","target":"...","conversion":"..."}],"recommendations":["4 recomendaciones accionables"]}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (r: any) => [
      <div key="t">
        <RichText value={r.summary || ''} />
      </div>,
      <DataTable
        key="tb"
        data={{
          cols: ['Plan', 'Precio', 'Objetivo', 'Conversión'],
          rows: (r.plans || []).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (p: any, idx: number) =>
              Object.assign([p.name, p.price, p.target, p.conversion], idx === 1 ? { highlight: true } : {})
          ),
        }}
      />,
      <Checklist key="r" title="Recomendaciones" items={r.recommendations} />,
    ],
    fallback: {
      summary:
        'Tres planes con un ancla premium que empuja al plan del medio (efecto señuelo). Anclamos al valor, no al coste.',
      plans: [
        { name: 'Starter', price: '0 €', target: 'Adquisición', conversion: '—' },
        { name: 'Growth', price: '29 €', target: 'Caballo de batalla', conversion: '8-12%' },
        { name: 'Scale', price: '89 €', target: 'Ancla de valor', conversion: '2-3%' },
      ],
      recommendations: [
        'Destaca Growth visualmente como recomendado',
        'Cobra anual con 2 meses gratis',
        'Revisa precios cada 6 meses',
        'Pon las 3 funciones más deseadas en Growth',
      ],
    },
  },
}

// ─── FormField ────────────────────────────────────────────────────────────────

function FormField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig
  value: string
  onChange: (v: string) => void
}) {
  const baseStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid var(--line-2)',
    borderRadius: 'var(--r-md)',
    fontSize: 14.5,
    color: 'var(--ink)',
    background: 'var(--surface)',
    outline: 'none',
    transition: 'border-color .15s',
    fontFamily: 'inherit',
  }
  const onFocus = (e: React.FocusEvent<HTMLElement>) => {
    ;(e.target as HTMLElement).style.borderColor = 'var(--accent)'
  }
  const onBlur = (e: React.FocusEvent<HTMLElement>) => {
    ;(e.target as HTMLElement).style.borderColor = 'var(--line-2)'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' }}>
        {field.label}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus as React.FocusEventHandler<HTMLTextAreaElement>}
          onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement>}
          placeholder={field.placeholder}
          rows={3}
          style={{ ...baseStyle, resize: 'vertical', lineHeight: 1.5 }}
        />
      ) : field.type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus as React.FocusEventHandler<HTMLSelectElement>}
          onBlur={onBlur as React.FocusEventHandler<HTMLSelectElement>}
          style={{ ...baseStyle, cursor: 'pointer' }}
        >
          {(field.options || []).map((o, i) => (
            <option key={i} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus as React.FocusEventHandler<HTMLInputElement>}
          onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
          placeholder={field.placeholder}
          style={baseStyle}
        />
      )}
    </div>
  )
}

// ─── ResultSkeleton ───────────────────────────────────────────────────────────

function ResultSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[96, 140, 80].map((h, i) => (
        <div
          key={i}
          style={{
            height: h,
            borderRadius: 'var(--r-lg)',
            background: 'var(--surface-2)',
            animation: 'norte-skeleton 1.5s ease-in-out infinite',
          }}
        />
      ))}
      <style>{`@keyframes norte-skeleton{0%,100%{opacity:.7}50%{opacity:.3}}`}</style>
    </div>
  )
}

// ─── ToolView ─────────────────────────────────────────────────────────────────

interface ToolViewProps {
  toolId: string
  isPro: boolean
  onBack?: () => void
  onUpgrade?: () => void
  onSaveProject?: (data: { name: string; tool: string; data: unknown }) => void
}

export function ToolView({ toolId, isPro, onBack, onUpgrade, onSaveProject }: ToolViewProps) {
  const router = useRouter()
  const cfg = TOOL_CONFIGS[toolId]

  const [input, setInput] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      cfg.fields.map((f) => [f.key, f.type === 'select' ? (f.options?.[0] ?? '') : ''])
    )
  )
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const locked = cfg.pro && !isPro
  const firstFilled = cfg.fields.some((f) => (input[f.key] || '').trim())

  const run = async () => {
    setLoading(true)
    setResult(null)
    setSaved(false)
    setError(null)

    try {
      const prompt = cfg.prompt(input)
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt + '\n\nResponde ÚNICAMENTE con el JSON válido, sin texto adicional.',
            },
          ],
        }),
      })

      if (!res.ok) {
        if (res.status === 429) {
          setError('Límite de mensajes alcanzado. Actualiza a Pro para continuar.')
          setLoading(false)
          return
        }
        throw new Error(`Error ${res.status}`)
      }

      // Accumulate streamed response
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (raw === '[DONE]') continue
          try {
            const parsed = JSON.parse(raw)
            if (parsed.content) accumulated += parsed.content
          } catch { /* ignore */ }
        }
      }

      // Parse JSON from accumulated text
      const jsonMatch = accumulated.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        setResult(parsed)
      } else {
        // Use fallback on parse failure
        setResult(cfg.fallback)
      }
    } catch {
      setResult(cfg.fallback)
    } finally {
      setLoading(false)
    }
  }

  if (!cfg) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>
        Herramienta no encontrada.
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: 820,
        margin: '0 auto',
        padding: '28px 24px 80px',
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack ?? (() => router.push('/tools'))}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          fontSize: 13.5,
          fontWeight: 600,
          color: 'var(--ink-3)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginBottom: 22,
          fontFamily: 'inherit',
          padding: 0,
        }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Herramientas
      </button>

      {/* Tool header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
          marginBottom: 26,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 'var(--r-md)',
            display: 'grid',
            placeItems: 'center',
            background: cfg.accent + '18',
            color: cfg.accent,
            flexShrink: 0,
          }}
        >
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx={12} cy={12} r={10} />
            <circle cx={12} cy={12} r={6} />
            <circle cx={12} cy={12} r={2} />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 25,
                fontWeight: 800,
                letterSpacing: '-0.03em',
              }}
            >
              {cfg.name}
            </h1>
            {cfg.pro && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 9px',
                  fontSize: 11.5,
                  fontWeight: 700,
                  borderRadius: 'var(--r-full)',
                  background: 'var(--gold-tint, #FEF3C7)',
                  color: 'var(--gold, #B7791F)',
                  border: '1px solid var(--gold-tint-2, #FDE68A)',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}
              >
                <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 20h20l-2-8-5 4-3-8-3 8-5-4-2 8z" />
                </svg>
                Pro
              </span>
            )}
          </div>
          <p style={{ margin: '5px 0 0', fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.5 }}>
            {cfg.tagline}
          </p>
        </div>
      </div>

      {/* Locked state */}
      {locked ? (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line-2)',
            borderRadius: 'var(--r-xl)',
            padding: 32,
            textAlign: 'center',
            boxShadow: 'var(--sh-xs)',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--r-lg)',
              background: 'var(--gold-tint, #FEF3C7)',
              color: 'var(--gold, #B7791F)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 16px',
            }}
          >
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x={3} y={11} width={18} height={11} rx={2} />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h3
            style={{
              margin: '0 0 8px',
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Herramienta Pro
          </h3>
          <p
            style={{
              margin: '0 auto 20px',
              fontSize: 14.5,
              color: 'var(--ink-3)',
              maxWidth: 360,
              lineHeight: 1.55,
            }}
          >
            Desbloquea esta herramienta y todas las premium con el plan Pro.
          </p>
          <button
            onClick={onUpgrade ?? (() => router.push('/upgrade'))}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 24px',
              fontSize: 16,
              fontWeight: 600,
              height: 50,
              borderRadius: 'var(--r-md)',
              background: 'linear-gradient(180deg, #FBBF24, var(--gold-bright, #F59E0B))',
              color: '#3a2a05',
              border: '1px solid #D9920A',
              boxShadow: '0 4px 14px rgba(245,158,11,0.30)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 20h20l-2-8-5 4-3-8-3 8-5-4-2 8z" />
            </svg>
            <span>Mejorar a Pro</span>
          </button>
        </div>
      ) : (
        <>
          {/* Form */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-xl)',
              padding: 22,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginBottom: 24,
              boxShadow: 'var(--sh-xs)',
            }}
          >
            {cfg.fields.map((f) => (
              <FormField
                key={f.key}
                field={f}
                value={input[f.key] ?? ''}
                onChange={(v) => setInput((s) => ({ ...s, [f.key]: v }))}
              />
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={run}
                disabled={loading || !firstFilled}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  fontSize: 14.5,
                  fontWeight: 600,
                  height: 40,
                  borderRadius: 'var(--r-md)',
                  background: loading || !firstFilled ? 'var(--surface-2)' : 'var(--accent)',
                  color: loading || !firstFilled ? 'var(--ink-3)' : '#fff',
                  border:
                    loading || !firstFilled
                      ? '1px solid var(--line-2)'
                      : '1px solid var(--accent-600, #059669)',
                  cursor: loading || !firstFilled ? 'not-allowed' : 'pointer',
                  boxShadow:
                    loading || !firstFilled ? 'none' : 'var(--sh-accent)',
                  transition: 'background .15s',
                  fontFamily: 'inherit',
                }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
                </svg>
                <span>
                  {loading ? 'Generando…' : result ? 'Regenerar' : 'Generar con IA'}
                </span>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                background: '#FEF2F2',
                border: '1px solid #FECDD3',
                borderRadius: 'var(--r-md)',
                fontSize: 14,
                color: '#C0383C',
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && <ResultSkeleton />}

          {/* Result */}
          {result && !loading && (
            <div>
              {/* Result header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 10px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    borderRadius: 'var(--r-full)',
                    background: 'var(--accent-tint, #ECFDF5)',
                    color: 'var(--accent-700, #059669)',
                    border: '1px solid var(--accent-tint-2, #D1FAE5)',
                  }}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3}>
                    <circle cx={12} cy={12} r={10} />
                    <path d="M8 12l3 3 5-5" />
                  </svg>
                  Resultado generado
                </span>
                <div style={{ flex: 1 }} />
                {onSaveProject && (
                  <button
                    onClick={() => {
                      if (!saved) {
                        onSaveProject({
                          name: result.title || cfg.name,
                          tool: toolId,
                          data: result,
                        })
                        setSaved(true)
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 13px',
                      fontSize: 13,
                      fontWeight: 600,
                      height: 32,
                      borderRadius: 'var(--r-md)',
                      background: saved ? 'var(--surface)' : 'var(--ink)',
                      color: saved ? 'var(--ink)' : '#fff',
                      border: saved ? '1px solid var(--line-2)' : '1px solid var(--ink)',
                      cursor: saved ? 'default' : 'pointer',
                      boxShadow: saved ? 'var(--sh-xs)' : 'none',
                      fontFamily: 'inherit',
                    }}
                  >
                    {saved ? (
                      <>
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3}>
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Guardado
                      </>
                    ) : (
                      <>
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Guardar
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Rendered result blocks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {(() => {
                  try {
                    return cfg.render(result)
                  } catch {
                    return <RichText value="No se pudo renderizar el resultado." />
                  }
                })()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export { TOOL_CONFIGS }
