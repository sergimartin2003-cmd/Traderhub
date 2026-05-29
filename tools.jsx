/* global React, Icon, Button, Badge, PremiumPill, Card, ScoreCard, LeanCanvas, DataTable, RichText, DualList, Checklist, AdCard, AI */
// tools.jsx — herramientas premium con IA real y resultados ricos.

const TOOL_CONFIGS = {
  idea: {
    name: 'Validador de Ideas', icon: 'target', accent: '#10B981', pro: false,
    tagline: 'Puntúa viabilidad, mercado y riesgo de tu idea con un veredicto accionable.',
    fields: [
      { key: 'idea', label: 'Describe tu idea de negocio', type: 'textarea', placeholder: 'Ej: una suscripción de café de especialidad entregado quincenalmente…' },
      { key: 'market', label: 'Mercado o país objetivo (opcional)', type: 'text', placeholder: 'Ej: España, profesionales 28-45' },
    ],
    prompt: (i) => `Valida esta idea de negocio: "${i.idea}". Mercado objetivo: "${i.market || 'general'}".
Devuelve JSON con esta forma exacta:
{"title":"nombre corto de la idea","verdict":"Viable|Con reservas|Arriesgada","overall":<0-100>,"metrics":[{"label":"Demanda de mercado","value":<0-100>},{"label":"Margen unitario","value":<0-100>},{"label":"Competencia","value":<0-100>},{"label":"Escalabilidad","value":<0-100>},{"label":"Timing","value":<0-100>}],"strengths":["3 fortalezas concretas"],"risks":["3 riesgos concretos"],"canvas":[{"k":"Problema","v":"..."},{"k":"Solución","v":"..."},{"k":"Métricas","v":"..."},{"k":"Ventaja","v":"..."},{"k":"Propuesta de valor","v":"..."},{"k":"Canales","v":"..."},{"k":"Clientes","v":"..."},{"k":"Ingresos","v":"..."}],"nextSteps":["3 siguientes pasos"]}`,
    render: (r) => [
      React.createElement(ScoreCard, { key: 's', data: r }),
      React.createElement('div', { key: 'd' }, React.createElement(DualList, { left: { title: 'Fortalezas', items: r.strengths }, right: { title: 'Riesgos', items: r.risks } })),
      React.createElement(LeanCanvas, { key: 'c', data: { blocks: r.canvas } }),
      React.createElement(Checklist, { key: 'n', title: 'Siguientes pasos', items: r.nextSteps }),
    ],
    fallback: { title: 'Café de especialidad por suscripción', verdict: 'Viable', overall: 82,
      metrics: [{ label: 'Demanda de mercado', value: 84 }, { label: 'Margen unitario', value: 78 }, { label: 'Competencia', value: 56 }, { label: 'Escalabilidad', value: 71 }, { label: 'Timing', value: 88 }],
      strengths: ['Ingresos recurrentes predecibles', 'Tolera precio premium (40-55% margen)', 'Bajo CAC si construyes comunidad'],
      risks: ['Logística de envío frágil', 'Churn si la curación falla', 'Competencia de tostadores locales'],
      canvas: [{ k: 'Problema', v: 'Café inconsistente y caro' }, { k: 'Solución', v: 'Suscripción curada quincenal' }, { k: 'Métricas', v: 'MRR, churn, LTV/CAC' }, { k: 'Ventaja', v: 'Relación directa con tostadores' }, { k: 'Propuesta de valor', v: 'Café fresco de origen a tu puerta' }, { k: 'Canales', v: 'Instagram · referidos · catas' }, { k: 'Clientes', v: 'Profesionales 28-45' }, { k: 'Ingresos', v: 'Suscripción 24€/mes + tienda' }],
      nextSteps: ['Entrevista a 15 clientes potenciales', 'Calcula coste logístico real', 'Lanza una lista de espera'] },
  },

  canvas: {
    name: 'Lean Canvas', icon: 'grid', accent: '#3B82F6', pro: false,
    tagline: 'Tu modelo de negocio completo en 9 bloques, autogenerado.',
    fields: [{ key: 'idea', label: 'Describe tu negocio', type: 'textarea', placeholder: 'Ej: plataforma SaaS de facturación para autónomos…' }],
    prompt: (i) => `Crea un Lean Canvas para: "${i.idea}".
Devuelve JSON: {"summary":"2 frases resumiendo el modelo","blocks":[{"k":"Problema","v":"..."},{"k":"Solución","v":"..."},{"k":"Métricas clave","v":"..."},{"k":"Ventaja injusta","v":"..."},{"k":"Propuesta de valor","v":"..."},{"k":"Canales","v":"..."},{"k":"Segmento de clientes","v":"..."},{"k":"Estructura de costes / ingresos","v":"..."}]}`,
    render: (r) => [
      React.createElement('div', { key: 't' }, React.createElement(RichText, { value: r.summary || '' })),
      React.createElement(LeanCanvas, { key: 'c', data: { blocks: r.blocks } }),
    ],
    fallback: { summary: 'Modelo SaaS de suscripción para autónomos que automatiza la facturación y reduce el tiempo administrativo.',
      blocks: [{ k: 'Problema', v: 'Facturar es lento y propenso a errores' }, { k: 'Solución', v: 'Facturación automática con IA' }, { k: 'Métricas clave', v: 'MRR, activación, churn' }, { k: 'Ventaja injusta', v: 'Integración con Hacienda' }, { k: 'Propuesta de valor', v: 'Factura en 30 segundos' }, { k: 'Canales', v: 'SEO · partnerships · referidos' }, { k: 'Segmento de clientes', v: 'Autónomos y micro-pymes' }, { k: 'Estructura de costes / ingresos', v: 'Suscripción 12€/mes' }] },
  },

  marketing: {
    name: 'Plan de Marketing', icon: 'megaphone', accent: '#8B5CF6', pro: false,
    tagline: 'Funnel de 4 etapas con canales, mensajes y KPIs.',
    fields: [
      { key: 'product', label: 'Producto o servicio', type: 'text', placeholder: 'Ej: curso online de fotografía' },
      { key: 'audience', label: 'Público objetivo', type: 'text', placeholder: 'Ej: aficionados que quieren monetizar' },
      { key: 'budget', label: 'Presupuesto', type: 'select', options: ['Bajo (bootstrap)', 'Medio', 'Alto'] },
    ],
    prompt: (i) => `Diseña un plan de marketing para "${i.product}", público "${i.audience}", presupuesto "${i.budget}".
Devuelve JSON: {"summary":"2-3 frases con la estrategia","funnel":[{"stage":"Atracción","channel":"...","kpi":"...","action":"..."},{"stage":"Captación","channel":"...","kpi":"...","action":"..."},{"stage":"Nutrición","channel":"...","kpi":"...","action":"..."},{"stage":"Conversión","channel":"...","kpi":"...","action":"..."}]}`,
    render: (r) => [
      React.createElement('div', { key: 't' }, React.createElement(RichText, { value: r.summary || '' })),
      React.createElement(DataTable, { key: 'tb', data: { cols: ['Etapa', 'Canal', 'KPI'], rows: (r.funnel || []).map((f, idx) => Object.assign([f.stage, f.channel, f.kpi], idx === 1 ? { highlight: true } : {})) } }),
      React.createElement(Checklist, { key: 'a', title: 'Acciones por etapa', items: (r.funnel || []).map(f => `${f.stage}: ${f.action}`) }),
    ],
    fallback: { summary: 'Estrategia de comunidad primero: genera valor gratuito, captura emails con un lead magnet y convierte con una oferta de lanzamiento con escasez real.',
      funnel: [{ stage: 'Atracción', channel: 'Reels / TikTok', kpi: 'Alcance', action: 'Publica 3 piezas de valor por semana' }, { stage: 'Captación', channel: 'Landing + lead magnet', kpi: 'Opt-in %', action: 'Ofrece una guía gratuita a cambio del email' }, { stage: 'Nutrición', channel: 'Email', kpi: 'Open / CTR', action: 'Secuencia de 5 emails: historia → prueba → oferta' }, { stage: 'Conversión', channel: 'Página de venta', kpi: 'Conversión %', action: 'Oferta de 7 días con bonus' }] },
  },

  ads: {
    name: 'Generador de Anuncios', icon: 'bolt', accent: '#F59E0B', pro: true,
    tagline: 'Copys y ángulos listos para Meta, Google y TikTok.',
    fields: [
      { key: 'product', label: 'Qué anuncias', type: 'text', placeholder: 'Ej: app de finanzas personales' },
      { key: 'angle', label: 'Ángulo o beneficio principal', type: 'text', placeholder: 'Ej: ahorra sin pensar' },
    ],
    prompt: (i) => `Genera 3 anuncios para "${i.product}", ángulo "${i.angle}", para plataformas distintas (Meta, Google, TikTok).
Devuelve JSON: {"ads":[{"platform":"Meta","format":"Feed","headline":"...","body":"...","cta":"..."},{"platform":"Google","format":"Search","headline":"...","body":"...","cta":"..."},{"platform":"TikTok","format":"Vídeo","headline":"...","body":"...","cta":"..."}]}`,
    render: (r) => (r.ads || []).map((ad, i) => React.createElement(AdCard, { key: i, ad })),
    fallback: { ads: [
      { platform: 'Meta', format: 'Feed', headline: 'Ahorra sin pensar', body: 'Conecta tu banco y deja que la app aparte dinero por ti cada semana. Sin esfuerzo.', cta: 'Probar gratis' },
      { platform: 'Google', format: 'Search', headline: 'App de ahorro automático', body: 'Aparta dinero automáticamente y alcanza tus metas antes. +50.000 usuarios.', cta: 'Descargar' },
      { platform: 'TikTok', format: 'Vídeo', headline: 'Así ahorré 1.200€ sin darme cuenta', body: 'POV: dejas que una app ahorre por ti mientras vives tu vida.', cta: 'Ver cómo' },
    ] },
  },

  competitor: {
    name: 'Análisis de Competencia', icon: 'users', accent: '#EC4899', pro: true,
    tagline: 'Mapa competitivo, fortalezas, huecos y tu posicionamiento.',
    fields: [
      { key: 'business', label: 'Tu negocio', type: 'text', placeholder: 'Ej: agencia de diseño para startups' },
      { key: 'competitors', label: 'Competidores que conoces (opcional)', type: 'textarea', placeholder: 'Ej: Agencia A, Agencia B…' },
    ],
    prompt: (i) => `Analiza la competencia para "${i.business}". Competidores conocidos: "${i.competitors || 'desconócelos e infiérelos'}".
Devuelve JSON: {"competitors":[{"name":"...","price":"$|$$|$$$","strength":"...","weakness":"..."}],"opportunity":"el hueco de mercado en 2 frases","positioning":"frase de posicionamiento recomendada"}`,
    render: (r) => [
      React.createElement(DataTable, { key: 'tb', data: { cols: ['Competidor', 'Precio', 'Fortaleza', 'Hueco'], rows: (r.competitors || []).map(c => [c.name, c.price, c.strength, c.weakness]) } }),
      React.createElement('div', { key: 'o' }, React.createElement(RichText, { value: `## Tu oportunidad\n${r.opportunity || ''}\n\n## Posicionamiento recomendado\n**${r.positioning || ''}**` })),
    ],
    fallback: { competitors: [{ name: 'Líder A', price: '$$$', strength: 'Marca consolidada', weakness: 'Caro y lento' }, { name: 'Retador B', price: '$$', strength: 'Buen producto', weakness: 'Soporte deficiente' }, { name: 'Low-cost C', price: '$', strength: 'Precio', weakness: 'Calidad inconsistente' }],
      opportunity: 'Hay un hueco en rapidez + acompañamiento cercano para startups que el líder no atiende por ser demasiado corporativo y lento.', positioning: 'La agencia que se mueve a la velocidad de tu startup.' },
  },

  pricing: {
    name: 'Estrategia de Precios', icon: 'scale', accent: '#06B6D4', pro: true,
    tagline: 'Arquitectura de planes con ancla de valor y efecto señuelo.',
    fields: [
      { key: 'product', label: 'Tu producto', type: 'text', placeholder: 'Ej: herramienta SaaS de email marketing' },
      { key: 'model', label: 'Modelo', type: 'select', options: ['Suscripción SaaS', 'Pago único', 'Freemium', 'Marketplace'] },
    ],
    prompt: (i) => `Diseña una estrategia de precios para "${i.product}", modelo "${i.model}".
Devuelve JSON: {"summary":"2 frases con la lógica","plans":[{"name":"Starter","price":"...","target":"...","conversion":"..."},{"name":"Growth","price":"...","target":"...","conversion":"..."},{"name":"Scale","price":"...","target":"...","conversion":"..."}],"recommendations":["4 recomendaciones accionables"]}`,
    render: (r) => [
      React.createElement('div', { key: 't' }, React.createElement(RichText, { value: r.summary || '' })),
      React.createElement(DataTable, { key: 'tb', data: { cols: ['Plan', 'Precio', 'Objetivo', 'Conversión'], rows: (r.plans || []).map((p, idx) => Object.assign([p.name, p.price, p.target, p.conversion], idx === 1 ? { highlight: true } : {})) } }),
      React.createElement(Checklist, { key: 'r', title: 'Recomendaciones', items: r.recommendations }),
    ],
    fallback: { summary: 'Tres planes con un ancla premium que empuja al plan del medio (efecto señuelo). Anclamos al valor, no al coste.',
      plans: [{ name: 'Starter', price: '0 €', target: 'Adquisición', conversion: '—' }, { name: 'Growth', price: '29 €', target: 'Caballo de batalla', conversion: '8-12%' }, { name: 'Scale', price: '89 €', target: 'Ancla de valor', conversion: '2-3%' }],
      recommendations: ['Destaca Growth visualmente como recomendado', 'Cobra anual con 2 meses gratis', 'Revisa precios cada 6 meses', 'Pon las 3 funciones más deseadas en Growth'] },
  },
};

function FormField({ field, value, onChange }) {
  const base = { width: '100%', padding: '11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 14.5, color: 'var(--ink)', background: 'var(--surface)', outline: 'none', transition: 'border-color .15s' };
  const onFocus = (e) => e.target.style.borderColor = 'var(--accent)';
  const onBlur = (e) => e.target.style.borderColor = 'var(--line-2)';
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 7 } },
    React.createElement('label', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' } }, field.label),
    field.type === 'textarea'
      ? React.createElement('textarea', { value, onChange: (e) => onChange(e.target.value), onFocus, onBlur, placeholder: field.placeholder, rows: 3, style: { ...base, resize: 'vertical', lineHeight: 1.5 } })
      : field.type === 'select'
        ? React.createElement('select', { value, onChange: (e) => onChange(e.target.value), onFocus, onBlur, style: { ...base, cursor: 'pointer' } },
            field.options.map((o, i) => React.createElement('option', { key: i, value: o }, o)))
        : React.createElement('input', { value, onChange: (e) => onChange(e.target.value), onFocus, onBlur, placeholder: field.placeholder, style: base }),
  );
}

function ResultSkeleton() {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
    React.createElement('div', { className: 'skeleton', style: { height: 96, borderRadius: 'var(--r-lg)' } }),
    React.createElement('div', { className: 'skeleton', style: { height: 140, borderRadius: 'var(--r-lg)' } }),
    React.createElement('div', { className: 'skeleton', style: { height: 80, borderRadius: 'var(--r-lg)' } }),
  );
}

function ToolView({ toolId, isPro, onBack, onSaveProject, onUpgrade, onOpenChat }) {
  const cfg = TOOL_CONFIGS[toolId];
  const [input, setInput] = React.useState(() => Object.fromEntries(cfg.fields.map(f => [f.key, f.type === 'select' ? f.options[0] : ''])));
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [saved, setSaved] = React.useState(false);
  const locked = cfg.pro && !isPro;

  const run = async () => {
    setLoading(true); setResult(null); setSaved(false);
    const r = await AI.json(cfg.prompt(input), cfg.fallback);
    setResult(r); setLoading(false);
  };
  const firstFilled = cfg.fields.some(f => (input[f.key] || '').trim());

  return React.createElement('div', { style: { maxWidth: 820, margin: '0 auto', padding: '28px 24px 80px' } },
    React.createElement('button', { className: 'focusable', onClick: onBack, style: { display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 22 } },
      React.createElement(Icon, { name: 'arrowLeft', size: 16 }), 'Herramientas'),

    React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 26 } },
      React.createElement('div', { style: { width: 52, height: 52, borderRadius: 'var(--r-md)', display: 'grid', placeItems: 'center', background: cfg.accent + '15', color: cfg.accent, flexShrink: 0 } },
        React.createElement(Icon, { name: cfg.icon, size: 26 })),
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
          React.createElement('h1', { style: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 25, fontWeight: 800, letterSpacing: '-0.03em' } }, cfg.name),
          cfg.pro && React.createElement(PremiumPill, null)),
        React.createElement('p', { style: { margin: '5px 0 0', fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.5 } }, cfg.tagline)),
    ),

    locked
      ? React.createElement(Card, { pad: 32, style: { textAlign: 'center' } },
          React.createElement('div', { style: { width: 56, height: 56, borderRadius: 'var(--r-lg)', background: 'var(--gold-tint)', color: 'var(--gold)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' } }, React.createElement(Icon, { name: 'lock', size: 26 })),
          React.createElement('h3', { style: { margin: '0 0 8px', fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em' } }, 'Herramienta Pro'),
          React.createElement('p', { style: { margin: '0 auto 20px', fontSize: 14.5, color: 'var(--ink-3)', maxWidth: 360, lineHeight: 1.55 } }, 'Desbloquea esta herramienta y todas las premium con el plan Pro.'),
          React.createElement(Button, { variant: 'gold', icon: 'crown', onClick: onUpgrade }, 'Mejorar a Pro'))
      : React.createElement(React.Fragment, null,
          // formulario
          React.createElement(Card, { pad: 22, style: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 } },
            cfg.fields.map(f => React.createElement(FormField, { key: f.key, field: f, value: input[f.key], onChange: (v) => setInput(s => ({ ...s, [f.key]: v })) })),
            React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end' } },
              React.createElement(Button, { variant: 'primary', icon: 'spark', onClick: run, disabled: loading || !firstFilled }, loading ? 'Generando…' : (result ? 'Regenerar' : 'Generar con IA'))),
          ),
          // resultado
          loading && React.createElement(ResultSkeleton, null),
          result && !loading && React.createElement('div', { className: 'anim-fade-up' },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 } },
              React.createElement(Badge, { tone: 'accent', icon: 'checkCircle' }, 'Resultado generado'),
              React.createElement('div', { style: { flex: 1 } }),
              React.createElement(Button, { variant: 'ghost', size: 'sm', icon: 'chat', onClick: () => onOpenChat(cfg) }, 'Abrir en chat'),
              React.createElement(Button, { variant: saved ? 'secondary' : 'dark', size: 'sm', icon: saved ? 'check' : 'download', onClick: () => { if (!saved) { onSaveProject({ name: result.title || cfg.name, tool: toolId, data: result }); setSaved(true); } } }, saved ? 'Guardado' : 'Guardar')),
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 18 } }, (() => { try { return cfg.render(result); } catch (e) { return React.createElement(RichText, { value: 'No se pudo renderizar el resultado.' }); } })()),
          ),
        ),
  );
}

window.ToolView = ToolView;
window.TOOL_CONFIGS = TOOL_CONFIGS;
