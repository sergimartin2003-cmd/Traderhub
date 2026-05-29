/* global React, Icon, Logo, Button, Badge, PremiumPill, Avatar, Card, IconButton, ProgressRing */
// dashboard.jsx — Home conectado al store.

const TOOLS = [
  { id: 'idea', icon: 'target', name: 'Validador de Ideas', desc: 'Puntúa viabilidad, mercado y riesgo en minutos.', pro: false, accent: '#10B981' },
  { id: 'canvas', icon: 'grid', name: 'Lean Canvas', desc: 'Modelo de negocio en 9 bloques, autogenerado.', pro: false, accent: '#3B82F6' },
  { id: 'marketing', icon: 'megaphone', name: 'Plan de Marketing', desc: 'Funnel de 90 días con canales y mensajes.', pro: false, accent: '#8B5CF6' },
  { id: 'ads', icon: 'bolt', name: 'Generador de Anuncios', desc: 'Copys y ángulos para Meta, Google y TikTok.', pro: true, accent: '#F59E0B' },
  { id: 'competitor', icon: 'users', name: 'Análisis de Competencia', desc: 'Mapa competitivo y huecos de mercado.', pro: true, accent: '#EC4899' },
  { id: 'pricing', icon: 'scale', name: 'Estrategia de Precios', desc: 'Modelos de pricing y elasticidad estimada.', pro: true, accent: '#06B6D4' },
];

const SUGGESTIONS = [
  { icon: 'target', text: 'Valida mi idea de negocio' },
  { icon: 'megaphone', text: 'Plan de marketing para mi lanzamiento' },
  { icon: 'money', text: '¿Cómo pongo precio a mi SaaS?' },
  { icon: 'users', text: 'Analiza a mis competidores' },
];

const TOOL_ICONS = Object.fromEntries(TOOLS.map(t => [t.id, { icon: t.icon, accent: t.accent, name: t.name }]));

function StatCard({ icon, label, value, tone, children }) {
  return React.createElement(Card, { pad: 18, style: { display: 'flex', flexDirection: 'column', gap: 10 } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
      React.createElement('div', { style: { width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', background: tone === 'gold' ? 'var(--gold-tint)' : 'var(--accent-tint)', color: tone === 'gold' ? 'var(--gold)' : 'var(--accent-700)' } },
        React.createElement(Icon, { name: icon, size: 19 })),
      children),
    React.createElement('div', null,
      React.createElement('div', { className: 'mono', style: { fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 } }, value),
      React.createElement('div', { style: { fontSize: 13, color: 'var(--ink-3)', marginTop: 5 } }, label)));
}

function ToolCard({ tool, isPro, onOpen }) {
  const locked = tool.pro && !isPro;
  return React.createElement(Card, { hover: true, onClick: () => onOpen(tool, locked), style: { display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', minHeight: 150 } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' } },
      React.createElement('div', { style: { width: 42, height: 42, borderRadius: 'var(--r-md)', display: 'grid', placeItems: 'center', background: tool.accent + '15', color: tool.accent } }, React.createElement(Icon, { name: tool.icon, size: 22 })),
      tool.pro && React.createElement(PremiumPill, { small: true })),
    React.createElement('div', null,
      React.createElement('div', { style: { fontWeight: 650, fontSize: 15.5, letterSpacing: '-0.02em' } }, tool.name),
      React.createElement('div', { style: { fontSize: 13, color: 'var(--ink-3)', marginTop: 4, lineHeight: 1.45 } }, tool.desc)),
    React.createElement('div', { style: { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: locked ? 'var(--ink-4)' : 'var(--accent-700)' } },
      locked ? [React.createElement(Icon, { name: 'lock', size: 14, key: 'i' }), React.createElement('span', { key: 't' }, 'Desbloquear con Pro')]
             : [React.createElement('span', { key: 't' }, 'Abrir herramienta'), React.createElement(Icon, { name: 'arrowRight', size: 15, key: 'i' })]));
}

function Dashboard({ store, onStartChat, onOpenTool, onUpgrade, onOpenProject, onSeeProjects }) {
  const { state, isPro, remaining, FREE_LIMIT } = store;
  const userName = (state.user && state.user.name) || 'emprendedor';
  const [q, setQ] = React.useState('');
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';
  const usage = state.usage; const pct = Math.round((usage / FREE_LIMIT) * 100);
  const submit = (text) => { if ((text || q).trim()) onStartChat((text || q).trim()); };
  const recents = state.conversations.slice(0, 4);
  const projects = state.projects.slice(0, 3);

  return React.createElement('div', { style: { maxWidth: 1080, margin: '0 auto', padding: '36px 40px 100px' } },
    React.createElement('div', { className: 'anim-fade-up', style: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 28 } },
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--accent-700)', marginBottom: 6 } }, new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })),
        React.createElement('h1', { style: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, letterSpacing: '-0.035em' } }, `${greet}, ${userName.split(' ')[0]}.`),
        React.createElement('p', { style: { margin: '7px 0 0', fontSize: 15.5, color: 'var(--ink-3)' } }, '¿En qué negocio avanzamos hoy?')),
      !isPro && React.createElement('div', { className: 'hide-mobile' }, React.createElement(Button, { variant: 'gold', icon: 'crown', onClick: onUpgrade }, 'Mejorar a Pro'))),

    // composer de inicio
    React.createElement('div', { className: 'anim-fade-up', style: { animationDelay: '.05s' } },
      React.createElement('div', { style: { background: 'var(--surface)', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-md)', padding: '8px 8px 8px 18px', display: 'flex', alignItems: 'center', gap: 12 } },
        React.createElement(Icon, { name: 'spark', size: 22, style: { color: 'var(--accent)', flexShrink: 0 } }),
        React.createElement('input', { value: q, onChange: (e) => setQ(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') submit(); }, placeholder: 'Pregunta lo que sea o describe tu idea…',
          style: { flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', color: 'var(--ink)', minWidth: 0 } }),
        React.createElement(Button, { variant: 'primary', icon: 'arrowUp', onClick: () => submit(), style: { width: 44, height: 44, padding: 0, borderRadius: 'var(--r-lg)' } })),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 14 } },
        SUGGESTIONS.map((s, i) => React.createElement('button', { key: i, className: 'focusable', onClick: () => submit(s.text),
          onMouseEnter: (e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-700)'; },
          onMouseLeave: (e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.color = 'var(--ink-2)'; },
          style: { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 'var(--r-full)', border: '1px solid var(--line-2)', background: 'var(--surface)', fontSize: 13.5, fontWeight: 500, color: 'var(--ink-2)', transition: 'all .16s' } },
          React.createElement(Icon, { name: s.icon, size: 15, style: { color: 'var(--ink-4)' } }), s.text))) ),

    // stats
    React.createElement('div', { className: 'anim-fade-up stat-grid', style: { animationDelay: '.1s', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 32 } },
      React.createElement(StatCard, { icon: 'flame', label: 'Racha de actividad', value: '12 días', tone: 'gold' }, React.createElement(Badge, { tone: 'gold', size: 'sm' }, '+1 hoy')),
      React.createElement(StatCard, { icon: 'target', label: 'Ideas validadas', value: String(state.projects.filter(p => p.tool === 'idea').length || 0) }),
      React.createElement(StatCard, { icon: 'folder', label: 'Proyectos guardados', value: String(state.projects.length) }),
      React.createElement(Card, { pad: 18, style: { display: 'flex', alignItems: 'center', gap: 16 } },
        React.createElement(ProgressRing, { value: isPro ? 100 : pct, size: 56, stroke: 5, color: isPro ? 'var(--gold-bright)' : (pct > 85 ? 'var(--danger)' : 'var(--accent)') },
          React.createElement(Icon, { name: isPro ? 'crown' : 'chat', size: 20, style: { color: isPro ? 'var(--gold)' : 'var(--accent-700)' } })),
        React.createElement('div', null, isPro
          ? [React.createElement('div', { key: 'v', className: 'mono', style: { fontSize: 17, fontWeight: 700 } }, 'Ilimitado'), React.createElement('div', { key: 'l', style: { fontSize: 12.5, color: 'var(--ink-3)', marginTop: 3 } }, 'Plan Pro activo')]
          : [React.createElement('div', { key: 'v', className: 'mono', style: { fontSize: 17, fontWeight: 700 } }, `${remaining} / ${FREE_LIMIT}`), React.createElement('div', { key: 'l', style: { fontSize: 12.5, color: 'var(--ink-3)', marginTop: 3 } }, 'mensajes hoy')]))),

    // herramientas
    React.createElement('div', { className: 'anim-fade-up', style: { animationDelay: '.15s', marginTop: 38 } },
      React.createElement('h2', { style: { margin: '0 0 16px', fontSize: 18.5, fontWeight: 700, letterSpacing: '-0.025em' } }, 'Herramientas'),
      React.createElement('div', { className: 'tool-grid', style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 } },
        TOOLS.map(tool => React.createElement(ToolCard, { key: tool.id, tool, isPro, onOpen: onOpenTool })))),

    // proyectos guardados
    projects.length > 0 && React.createElement('div', { className: 'anim-fade-up', style: { marginTop: 38 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 } },
        React.createElement('h2', { style: { margin: 0, fontSize: 18.5, fontWeight: 700, letterSpacing: '-0.025em' } }, 'Proyectos guardados'),
        React.createElement('button', { className: 'focusable', onClick: onSeeProjects, style: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13.5, fontWeight: 600, color: 'var(--ink-3)' } }, 'Ver todos', React.createElement(Icon, { name: 'chevronRight', size: 15 }))),
      React.createElement('div', { className: 'tool-grid', style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 } },
        projects.map(p => { const ti = TOOL_ICONS[p.tool] || { icon: 'doc', accent: '#10B981' };
          return React.createElement(Card, { key: p.id, hover: true, onClick: () => onOpenProject(p), style: { display: 'flex', flexDirection: 'column', gap: 12, minHeight: 120 } },
            React.createElement('div', { style: { width: 38, height: 38, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', background: ti.accent + '15', color: ti.accent } }, React.createElement(Icon, { name: ti.icon, size: 19 })),
            React.createElement('div', null, React.createElement('div', { style: { fontWeight: 650, fontSize: 14.5, letterSpacing: '-0.01em' } }, p.name), React.createElement('div', { style: { fontSize: 12.5, color: 'var(--ink-4)', marginTop: 3 } }, ti.name || p.tool))); }))),

    // recientes
    recents.length > 0 && React.createElement('div', { className: 'anim-fade-up', style: { marginTop: 38 } },
      React.createElement('h2', { style: { margin: '0 0 16px', fontSize: 18.5, fontWeight: 700, letterSpacing: '-0.025em' } }, 'Conversaciones recientes'),
      React.createElement(Card, { pad: 6 },
        recents.map((r, i) => React.createElement('button', { key: r.id, className: 'focusable', onClick: () => onStartChat(null, r.id),
          onMouseEnter: (e) => e.currentTarget.style.background = 'var(--surface-2)', onMouseLeave: (e) => e.currentTarget.style.background = 'transparent',
          style: { width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '13px 14px', borderRadius: 'var(--r-md)', textAlign: 'left', transition: 'background .14s', borderBottom: i < recents.length - 1 ? '1px solid var(--line)' : 'none' } },
          React.createElement('div', { style: { width: 36, height: 36, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', background: 'var(--surface-3)', color: 'var(--ink-3)', flexShrink: 0 } }, React.createElement(Icon, { name: 'chat', size: 18 })),
          React.createElement('div', { style: { flex: 1, minWidth: 0 } }, React.createElement('div', { style: { fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, r.title), r.context && React.createElement('div', { style: { fontSize: 12.5, color: 'var(--ink-4)', marginTop: 2 } }, r.context)),
          React.createElement(Icon, { name: 'chevronRight', size: 16, style: { color: 'var(--ink-4)' } }))))),
  );
}

Object.assign(window, { Dashboard, TOOLS });
