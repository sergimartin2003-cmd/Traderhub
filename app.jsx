/* global React, ReactDOM, Icon, Logo, Button, Badge, PremiumPill, Avatar, IconButton, Card, useStore, StoreProvider, Landing, AuthScreen, Onboarding, Dashboard, Chat, ToolView, TOOL_CONFIGS, Checkout, Settings, RichText */
// app.jsx — router + shell desktop/mobile.

const ACCENTS = {
  esmeralda: { a: '#10B981', a6: '#059669', a7: '#047857', t: '#ECFDF5', t2: '#D1FAE5', g: 'rgba(16,185,129,0.18)' },
  'índigo':  { a: '#6366F1', a6: '#4F46E5', a7: '#4338CA', t: '#EEF2FF', t2: '#E0E7FF', g: 'rgba(99,102,241,0.18)' },
  azul:      { a: '#3B82F6', a6: '#2563EB', a7: '#1D4ED8', t: '#EFF6FF', t2: '#DBEAFE', g: 'rgba(59,130,246,0.18)' },
  'ámbar':   { a: '#F59E0B', a6: '#D97706', a7: '#B45309', t: '#FFFBEB', t2: '#FEF3C7', g: 'rgba(245,158,11,0.20)' },
  tinta:     { a: '#18181B', a6: '#0A0A0A', a7: '#000000', t: '#F4F4F5', t2: '#E4E4E7', g: 'rgba(0,0,0,0.14)' },
};

function applyTheme(settings) {
  const ac = ACCENTS[settings.accent] || ACCENTS.esmeralda;
  const r = document.documentElement.style;
  r.setProperty('--accent', ac.a); r.setProperty('--accent-600', ac.a6); r.setProperty('--accent-700', ac.a7);
  r.setProperty('--accent-tint', ac.t); r.setProperty('--accent-tint-2', ac.t2); r.setProperty('--accent-glow', ac.g);
  document.documentElement.setAttribute('data-density', settings.density || 'regular');
}

function NavItem({ icon, label, active, onClick }) {
  const [h, setH] = React.useState(false);
  return React.createElement('button', { onClick, className: 'focusable', onMouseEnter: () => setH(true), onMouseLeave: () => setH(false),
    style: { width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 'var(--r-md)', fontSize: 14.5, fontWeight: active ? 650 : 500, textAlign: 'left',
      color: active ? 'var(--accent-700)' : 'var(--ink-2)', background: active ? 'var(--accent-tint)' : (h ? 'var(--surface-3)' : 'transparent'), transition: 'background .14s, color .14s' } },
    React.createElement(Icon, { name: icon, size: 19, stroke: active ? 1.9 : 1.6 }), React.createElement('span', { style: { flex: 1 } }, label));
}

function Sidebar({ route, go, brandName, store, onNewChat, onUpgrade }) {
  const { state, isPro } = store;
  const convs = state.conversations.slice(0, 8);
  return React.createElement('aside', { className: 'sidebar', style: { width: 264, flexShrink: 0, height: '100%', borderRight: '1px solid var(--line)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', padding: '18px 14px' } },
    React.createElement('div', { style: { padding: '4px 8px 18px' } }, React.createElement(Logo, { size: 26, label: brandName })),
    React.createElement(Button, { variant: 'primary', icon: 'plus', full: true, onClick: onNewChat, style: { marginBottom: 16, justifyContent: 'flex-start', paddingLeft: 14 } }, 'Nueva conversación'),
    React.createElement('nav', { style: { display: 'flex', flexDirection: 'column', gap: 2 } },
      React.createElement(NavItem, { icon: 'home', label: 'Inicio', active: route.view === 'dashboard', onClick: () => go({ view: 'dashboard' }) }),
      React.createElement(NavItem, { icon: 'chat', label: 'Chat', active: route.view === 'chat', onClick: onNewChat }),
      React.createElement(NavItem, { icon: 'tools', label: 'Herramientas', active: route.view === 'tool', onClick: () => go({ view: 'dashboard' }) }),
      React.createElement(NavItem, { icon: 'folder', label: 'Proyectos', active: route.view === 'projects', onClick: () => go({ view: 'projects' }) })),
    React.createElement('div', { style: { fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-4)', padding: '20px 11px 8px' } }, 'Recientes'),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto', flex: 1 } },
      convs.length === 0 ? React.createElement('div', { style: { padding: '4px 11px', fontSize: 13, color: 'var(--ink-4)' } }, 'Aún no hay conversaciones')
      : convs.map(c => React.createElement('button', { key: c.id, className: 'focusable', onClick: () => go({ view: 'chat', convId: c.id }),
          onMouseEnter: (e) => e.currentTarget.style.background = 'var(--surface-3)', onMouseLeave: (e) => e.currentTarget.style.background = 'transparent',
          style: { display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px', borderRadius: 'var(--r-sm)', fontSize: 13.5, color: route.convId === c.id ? 'var(--ink)' : 'var(--ink-3)', background: route.convId === c.id ? 'var(--surface-3)' : 'transparent', textAlign: 'left' } },
          React.createElement('span', { style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, c.title)))),
    isPro
      ? React.createElement('div', { style: { marginTop: 12, padding: 14, borderRadius: 'var(--r-lg)', border: '1px solid var(--gold-tint-2)', background: 'var(--gold-tint)' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } }, React.createElement(Icon, { name: 'crown', size: 18, style: { color: 'var(--gold)' } }), React.createElement('span', { style: { fontWeight: 700, fontSize: 14 } }, 'Plan Pro activo')),
          React.createElement('div', { style: { fontSize: 12.5, color: 'var(--ink-3)', marginTop: 5 } }, 'Todo ilimitado.'))
      : React.createElement('button', { className: 'focusable', onClick: onUpgrade, style: { marginTop: 12, padding: 14, borderRadius: 'var(--r-lg)', border: '1px solid var(--gold-tint-2)', background: 'linear-gradient(160deg, var(--gold-tint), #fff)', textAlign: 'left', cursor: 'pointer' } },
          React.createElement('div', { style: { display: 'flex', marginBottom: 6 } }, React.createElement(PremiumPill, null)),
          React.createElement('div', { style: { fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em' } }, 'Desbloquea todo'),
          React.createElement('div', { style: { fontSize: 12.5, color: 'var(--ink-3)', margin: '4px 0 11px' } }, 'Mensajes y herramientas ilimitadas.'),
          React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--gold)' } }, 'Ver Pro', React.createElement(Icon, { name: 'arrowRight', size: 15 }))),
    React.createElement('button', { className: 'focusable', onClick: () => go({ view: 'settings' }), style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 8px 2px', marginTop: 8, borderTop: '1px solid var(--line)', textAlign: 'left' } },
      React.createElement(Avatar, { name: (state.user && state.user.name) || 'Tú', size: 34 }),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } }, React.createElement('div', { style: { fontSize: 13.5, fontWeight: 650 } }, (state.user && state.user.name) || 'Tú'), React.createElement('div', { style: { fontSize: 12, color: 'var(--ink-4)' } }, isPro ? 'Pro' : 'Plan gratuito')),
      React.createElement(Icon, { name: 'settings', size: 18, style: { color: 'var(--ink-3)' } })));
}

function MobileBar({ route, go, onNewChat }) {
  const items = [
    { view: 'dashboard', icon: 'home', label: 'Inicio', onClick: () => go({ view: 'dashboard' }) },
    { view: 'chat', icon: 'chat', label: 'Chat', onClick: onNewChat },
    { view: 'projects', icon: 'folder', label: 'Proyectos', onClick: () => go({ view: 'projects' }) },
    { view: 'settings', icon: 'user', label: 'Perfil', onClick: () => go({ view: 'settings' }) },
  ];
  return React.createElement('nav', { className: 'mobile-bar', style: { display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--line)', padding: '8px 8px calc(8px + env(safe-area-inset-bottom))', justifyContent: 'space-around' } },
    items.map(it => { const active = route.view === it.view;
      return React.createElement('button', { key: it.view, className: 'focusable', onClick: it.onClick, style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 14px', color: active ? 'var(--accent-700)' : 'var(--ink-4)', flex: 1 } },
        React.createElement(Icon, { name: it.icon, size: 22, stroke: active ? 2 : 1.6 }),
        React.createElement('span', { style: { fontSize: 11, fontWeight: active ? 700 : 500 } }, it.label)); }));
}

function MobileHeader({ brandName, route, go, onNewChat }) {
  const titles = { dashboard: brandName, chat: 'Chat', tool: TOOL_CONFIGS[route.toolId] ? TOOL_CONFIGS[route.toolId].name : 'Herramienta', projects: 'Proyectos', settings: 'Ajustes', project: 'Proyecto' };
  return React.createElement('header', { className: 'mobile-header', style: { display: 'none', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--line)', background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 30 } },
    route.view === 'dashboard'
      ? React.createElement(Logo, { size: 24, label: brandName })
      : React.createElement(React.Fragment, null,
          React.createElement(IconButton, { name: 'arrowLeft', size: 20, title: 'Atrás', onClick: () => go({ view: 'dashboard' }) }),
          React.createElement('span', { style: { fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' } }, titles[route.view] || brandName)),
    React.createElement('div', { style: { flex: 1 } }),
    React.createElement(IconButton, { name: 'plus', size: 20, title: 'Nueva conversación', onClick: onNewChat }));
}

// — Paywall —
function Paywall({ onClose, onCheckout, brandName }) {
  const feats = ['Mensajes ilimitados con la IA más avanzada', 'Las 6 herramientas premium', 'Análisis profundos y exportación', 'Sin anuncios · respuestas prioritarias'];
  return React.createElement('div', { onClick: onClose, style: { position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(19,19,22,0.42)', backdropFilter: 'blur(6px)', display: 'grid', placeItems: 'center', padding: 24, animation: 'fadeIn .2s' } },
    React.createElement('div', { onClick: (e) => e.stopPropagation(), style: { width: 'min(520px, 100%)', background: 'var(--surface)', borderRadius: 'var(--r-2xl)', boxShadow: 'var(--sh-xl)', overflow: 'hidden', animation: 'pop .25s var(--ease-out)' } },
      React.createElement('div', { style: { padding: '30px 32px 24px', background: 'linear-gradient(165deg, var(--gold-tint), transparent)', position: 'relative' } },
        React.createElement(IconButton, { name: 'close', size: 18, title: 'Cerrar', onClick: onClose, style: { position: 'absolute', top: 18, right: 18 } }),
        React.createElement('div', { style: { display: 'inline-flex' } }, React.createElement(PremiumPill, null)),
        React.createElement('h2', { style: { margin: '14px 0 6px', fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' } }, 'Construye más rápido con Pro'),
        React.createElement('p', { style: { margin: 0, fontSize: 15, color: 'var(--ink-3)', maxWidth: 380, lineHeight: 1.5 } }, 'Lo que hoy te toma semanas, con Pro lo resuelves en una tarde.')),
      React.createElement('div', { style: { padding: '22px 32px 28px' } },
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 22 } },
          feats.map((f, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 11, fontSize: 14.5 } },
            React.createElement('span', { style: { width: 22, height: 22, borderRadius: 999, background: 'var(--accent-tint)', color: 'var(--accent-700)', display: 'grid', placeItems: 'center', flexShrink: 0 } }, React.createElement(Icon, { name: 'check', size: 14, stroke: 2.2 })), f))),
        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 18 } },
          React.createElement('span', { className: 'mono', style: { fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em' } }, '19 €'),
          React.createElement('span', { style: { color: 'var(--ink-3)', fontSize: 14.5 } }, '/mes · cancela cuando quieras'),
          React.createElement('span', { style: { marginLeft: 'auto' } }, React.createElement(Badge, { tone: 'gold', size: 'sm' }, '2 meses gratis anual'))),
        React.createElement(Button, { variant: 'gold', size: 'lg', icon: 'crown', full: true, onClick: onCheckout }, 'Continuar al pago'))));
}

// — Vista de proyectos —
function ProjectsView({ store, onOpen, go }) {
  const { state, actions } = store;
  const ti = (id) => (window.TOOL_CONFIGS[id] || { icon: 'doc', accent: '#10B981', name: id });
  return React.createElement('div', { style: { maxWidth: 900, margin: '0 auto', padding: '32px 24px 100px' } },
    React.createElement('h1', { style: { margin: '0 0 22px', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' } }, 'Proyectos guardados'),
    state.projects.length === 0
      ? React.createElement(Card, { pad: 40, style: { textAlign: 'center' } },
          React.createElement('div', { style: { width: 56, height: 56, borderRadius: 'var(--r-lg)', background: 'var(--surface-3)', color: 'var(--ink-4)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' } }, React.createElement(Icon, { name: 'folder', size: 28 })),
          React.createElement('h3', { style: { margin: '0 0 8px', fontSize: 18, fontWeight: 700 } }, 'Aún no hay proyectos'),
          React.createElement('p', { style: { margin: '0 auto 18px', fontSize: 14.5, color: 'var(--ink-3)', maxWidth: 320, lineHeight: 1.5 } }, 'Usa una herramienta y guarda el resultado para verlo aquí.'),
          React.createElement(Button, { variant: 'primary', icon: 'tools', onClick: () => go({ view: 'dashboard' }) }, 'Ir a herramientas'))
      : React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 } },
          state.projects.map(p => { const c = ti(p.tool);
            return React.createElement(Card, { key: p.id, hover: true, onClick: () => onOpen(p), style: { display: 'flex', flexDirection: 'column', gap: 12, minHeight: 130, position: 'relative' } },
              React.createElement('div', { style: { width: 40, height: 40, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', background: c.accent + '15', color: c.accent } }, React.createElement(Icon, { name: c.icon, size: 20 })),
              React.createElement('div', { style: { flex: 1 } }, React.createElement('div', { style: { fontWeight: 650, fontSize: 15, letterSpacing: '-0.01em' } }, p.name), React.createElement('div', { style: { fontSize: 12.5, color: 'var(--ink-4)', marginTop: 3 } }, c.name)),
              React.createElement(IconButton, { name: 'trash', size: 15, title: 'Eliminar', tone: 'danger', onClick: (e) => { e.stopPropagation(); actions.deleteProject(p.id); }, style: { position: 'absolute', top: 10, right: 10 } })); })));
}

function ProjectDetail({ project, go }) {
  const cfg = window.TOOL_CONFIGS[project.tool];
  return React.createElement('div', { style: { maxWidth: 820, margin: '0 auto', padding: '28px 24px 100px' } },
    React.createElement('button', { className: 'focusable', onClick: () => go({ view: 'projects' }), style: { display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 20 } }, React.createElement(Icon, { name: 'arrowLeft', size: 16 }), 'Proyectos'),
    React.createElement('h1', { style: { margin: '0 0 20px', fontFamily: 'var(--font-display)', fontSize: 25, fontWeight: 800, letterSpacing: '-0.03em' } }, project.name),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 18 } }, (() => { try { return cfg.render(project.data); } catch (e) { return React.createElement(RichText, { value: 'No se pudo mostrar el proyecto.' }); } })()));
}

function AppShell() {
  const store = useStore();
  const { state, actions, isPro, remaining } = store;
  const [route, setRoute] = React.useState({ view: 'dashboard' });
  const [authView, setAuthView] = React.useState(null); // null | 'auth'
  const [paywall, setPaywall] = React.useState(false);
  const [checkout, setCheckout] = React.useState(false);
  const brandName = state.settings.brand || 'Norte';

  React.useEffect(() => { applyTheme(state.settings); }, [state.settings.accent, state.settings.density]);

  const go = (r) => setRoute(prev => ({ ...prev, ...r }));

  // navegación de alto nivel
  const stage = !state.user ? (authView === 'auth' ? 'auth' : 'landing') : (!state.onboarded ? 'onboarding' : 'app');

  if (stage === 'landing') return React.createElement(Landing, { brandName, onStart: () => setAuthView('auth'), onLogin: () => setAuthView('auth') });
  if (stage === 'auth') return React.createElement(AuthScreen, { brandName, onAuth: (u) => { actions.signIn(u); }, onBack: () => setAuthView(null) });
  if (stage === 'onboarding') return React.createElement(Onboarding, { brandName, name: (state.user && state.user.name) || 'Hola', onComplete: (p) => actions.completeOnboarding(p) });

  // — App —
  const startChat = (prompt, convId, context) => {
    go({ view: 'chat', convId: convId || null, pending: prompt || null, context: context || null });
  };
  const newChat = () => { go({ view: 'chat', convId: null, pending: null, context: null }); };

  const openTool = (tool, locked) => { if (locked) { setPaywall(true); return; } go({ view: 'tool', toolId: tool.id }); };

  let content;
  if (route.view === 'dashboard') content = React.createElement(Dashboard, { store, onStartChat: (p, id) => startChat(p, id), onOpenTool: openTool, onUpgrade: () => setPaywall(true), onOpenProject: (p) => go({ view: 'project', project: p }), onSeeProjects: () => go({ view: 'projects' }) });
  else if (route.view === 'chat') content = React.createElement(ChatContainer, { key: route.convId || 'new-' + (route.pending || ''), store, initialConvId: route.convId, initialPrompt: route.pending, context: route.context, brandName, onUpgrade: () => setPaywall(true) });
  else if (route.view === 'tool') content = React.createElement(ToolView, { toolId: route.toolId, isPro, onBack: () => go({ view: 'dashboard' }), onUpgrade: () => setPaywall(true),
      onSaveProject: (p) => actions.addProject(p), onOpenChat: (cfg) => startChat(`Ayúdame a profundizar en ${cfg.name.toLowerCase()}`, null, cfg.name) });
  else if (route.view === 'projects') content = React.createElement(ProjectsView, { store, go, onOpen: (p) => go({ view: 'project', project: p }) });
  else if (route.view === 'project') content = React.createElement(ProjectDetail, { project: route.project, go });
  else if (route.view === 'settings') content = React.createElement(Settings, { store, onUpgrade: () => setPaywall(true), onSignOut: () => { actions.signOut(); setAuthView(null); setRoute({ view: 'dashboard' }); }, onBack: () => go({ view: 'dashboard' }) });

  return React.createElement('div', { style: { display: 'flex', height: '100%', background: 'var(--canvas)' } },
    React.createElement(Sidebar, { route, go, brandName, store, onNewChat: newChat, onUpgrade: () => setPaywall(true) }),
    React.createElement('div', { className: 'main-col', style: { flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column' } },
      React.createElement(MobileHeader, { brandName, route, go, onNewChat: newChat }),
      React.createElement('main', { style: { flex: 1, minWidth: 0, overflow: route.view === 'chat' ? 'hidden' : 'auto' } }, content)),
    React.createElement(MobileBar, { route, go, onNewChat: newChat }),
    paywall && React.createElement(Paywall, { brandName, onClose: () => setPaywall(false), onCheckout: () => { setPaywall(false); setCheckout(true); } }),
    checkout && React.createElement(Checkout, { brandName, onClose: () => setCheckout(false), onSuccess: () => { actions.upgrade(); setCheckout(false); } }));
}

// — Contenedor de chat: conecta store + componente Chat, crea conversación de forma perezosa —
function ChatContainer({ store, initialConvId, initialPrompt, context, brandName, onUpgrade }) {
  const { state, actions, isPro, remaining } = store;
  const convIdRef = React.useRef(initialConvId || null);
  const [, force] = React.useState(0);

  const append = (msg) => {
    if (!convIdRef.current) {
      const id = actions.newConversation((msg.content || 'Nueva conversación').slice(0, 40), context);
      convIdRef.current = id; force(x => x + 1);
    }
    actions.appendMessage(convIdRef.current, msg);
  };

  const conv = convIdRef.current ? state.conversations.find(c => c.id === convIdRef.current) : null;

  return React.createElement(Chat, {
    conversation: conv || { id: convIdRef.current, messages: [], context: context || null },
    brandName, isPro, remaining,
    onConsume: actions.consume, onUpgrade, onAppend: append,
    profile: state.user, aiTone: state.settings.aiTone,
    initialPrompt,
  });
}

function Root() { return React.createElement(StoreProvider, null, React.createElement(AppShell)); }
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Root));
