/* global React, Icon, Logo, Button, Badge, PremiumPill */
// landing.jsx — landing page de marketing.

function LMark({ size = 40 }) {
  return React.createElement('svg', { width: size, height: size, viewBox: '0 0 32 32', fill: 'none' },
    React.createElement('path', { d: 'M16 3.5 19.2 16 16 28.5 12.8 16z', fill: 'var(--accent)' }),
    React.createElement('path', { d: 'M5 16 16 14.2 27 16 16 17.8z', fill: 'var(--accent)', opacity: 0.4 }));
}

function ChatMockup({ brandName }) {
  return React.createElement('div', { style: { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-2xl)', boxShadow: 'var(--sh-xl)', overflow: 'hidden', maxWidth: 460, margin: '0 auto' } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '13px 18px', borderBottom: '1px solid var(--line)' } },
      React.createElement(LMark, { size: 22 }),
      React.createElement('span', { style: { fontWeight: 700, fontSize: 14 } }, brandName),
      React.createElement('span', { style: { marginLeft: 'auto' } }, React.createElement(Badge, { tone: 'accent', size: 'sm', icon: 'spark' }, 'En vivo'))),
    React.createElement('div', { style: { padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 16 } },
      React.createElement('div', { style: { alignSelf: 'flex-end', background: 'var(--ink)', color: '#fff', padding: '10px 15px', borderRadius: '16px 16px 4px 16px', fontSize: 14, maxWidth: '78%' } }, '¿Es viable una marca de snacks saludables?'),
      React.createElement('div', { style: { display: 'flex', gap: 10 } },
        React.createElement('div', { style: { flexShrink: 0 } }, React.createElement(LMark, { size: 26 })),
        React.createElement('div', { style: { background: 'var(--surface-2)', borderRadius: 'var(--r-md)', padding: '14px 16px', fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 } },
            React.createElement('div', { style: { width: 40, height: 40, borderRadius: 999, border: '4px solid var(--accent)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13, color: 'var(--accent-700)' }, className: 'mono' }, '79'),
            React.createElement('div', null, React.createElement('div', { style: { fontWeight: 700, color: 'var(--ink)' } }, 'Viable'), React.createElement('div', { style: { fontSize: 12, color: 'var(--ink-4)' } }, 'Mercado en crecimiento'))),
          'Tu mayor palanca es ', React.createElement('strong', null, 'diferenciarte por ingrediente'), ', no por precio. Empieza validando con 20 clientes.'))),
  );
}

function Section({ children, style }) {
  return React.createElement('section', { style: { maxWidth: 1120, margin: '0 auto', padding: '0 24px', ...style } }, children);
}

const FEATURES = [
  { icon: 'target', t: 'Valida antes de invertir', d: 'Puntúa cualquier idea por demanda, margen, competencia y timing. Sabe si vale la pena antes de gastar un euro.' },
  { icon: 'megaphone', t: 'Marketing que convierte', d: 'Funnels, anuncios y calendarios de contenido generados para tu negocio y tu presupuesto real.' },
  { icon: 'scale', t: 'Precios con estrategia', d: 'Arquitectura de planes con ancla de valor y efecto señuelo. Cobra lo que vales.' },
  { icon: 'users', t: 'Conoce a tu competencia', d: 'Mapa competitivo automático y el hueco de mercado donde puedes ganar.' },
  { icon: 'grid', t: 'Tu modelo en 9 bloques', d: 'Lean Canvas completo y editable en segundos, listo para presentar a inversores.' },
  { icon: 'spark', t: 'Un estratega 24/7', d: 'Memoria de tu negocio, contexto entre conversaciones y respuestas accionables, no teoría.' },
];

const USES = [
  { icon: 'lightbulb', t: 'Tengo una idea', d: 'Valídala, modélala y sal con un plan de acción de esta semana.' },
  { icon: 'rocket', t: 'Estoy lanzando', d: 'Marketing, pricing y anuncios listos para tu primer cliente.' },
  { icon: 'trend', t: 'Quiero crecer', d: 'Estrategia de crecimiento, análisis de competencia y nuevos canales.' },
];

const FAQS = [
  { q: '¿Necesito experiencia previa en negocios?', a: 'No. Norte está pensado para que cualquiera —desde quien tiene una idea hasta quien ya factura— avance con criterio de estratega, sin jerga.' },
  { q: '¿En qué se diferencia de un chat genérico?', a: 'Norte recuerda el contexto de tu negocio, estructura todo en frameworks accionables y genera entregables reales: validaciones, canvas, planes y anuncios.' },
  { q: '¿Qué incluye el plan gratuito?', a: 'Mensajes diarios limitados y las herramientas básicas (Validador, Lean Canvas y Plan de Marketing). Suficiente para empezar a validar.' },
  { q: '¿Puedo cancelar cuando quiera?', a: 'Sí. El plan Pro es mensual sin permanencia y con garantía de 14 días. Cancelas con un clic.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return React.createElement('div', { style: { borderBottom: '1px solid var(--line)' } },
    React.createElement('button', { className: 'focusable', onClick: () => setOpen(o => !o), style: { width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '20px 4px', textAlign: 'left', fontSize: 16.5, fontWeight: 650, letterSpacing: '-0.01em' } },
      React.createElement('span', { style: { flex: 1 } }, q),
      React.createElement(Icon, { name: 'chevronDown', size: 20, style: { color: 'var(--ink-4)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s' } })),
    React.createElement('div', { style: { maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height .3s var(--ease)' } },
      React.createElement('p', { style: { margin: 0, padding: '0 4px 20px', fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.6, maxWidth: 720 } }, a)),
  );
}

function Landing({ brandName, onStart, onLogin }) {
  return React.createElement('div', { style: { background: 'var(--canvas)', minHeight: '100%', overflowY: 'auto', height: '100%' } },
    // navbar
    React.createElement('div', { style: { position: 'sticky', top: 0, zIndex: 20, background: 'rgba(251,251,250,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)' } },
      React.createElement(Section, { style: { display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px' } },
        React.createElement(Logo, { size: 26, label: brandName }),
        React.createElement('div', { style: { flex: 1 } }),
        React.createElement('div', { className: 'nav-links', style: { display: 'flex', gap: 26, marginRight: 8 } },
          ['Producto', 'Herramientas', 'Precios'].map((l, i) => React.createElement('a', { key: i, href: '#', style: { fontSize: 14.5, fontWeight: 500, color: 'var(--ink-2)' } }, l))),
        React.createElement(Button, { variant: 'ghost', size: 'sm', onClick: onLogin }, 'Entrar'),
        React.createElement(Button, { variant: 'dark', size: 'sm', onClick: onStart }, 'Empezar gratis'))),

    // hero
    React.createElement(Section, { style: { padding: '72px 24px 40px', textAlign: 'center' } },
      React.createElement('div', { className: 'anim-fade-up', style: { display: 'inline-flex', marginBottom: 22 } }, React.createElement(Badge, { tone: 'accent', icon: 'spark' }, 'Tu copiloto de IA para emprender')),
      React.createElement('h1', { className: 'anim-fade-up', style: { margin: '0 auto', maxWidth: 760, fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 6vw, 64px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.04 } },
        'De la idea al negocio, con un estratega que nunca duerme'),
      React.createElement('p', { className: 'anim-fade-up', style: { margin: '22px auto 0', maxWidth: 560, fontSize: 'clamp(16px, 2.4vw, 19px)', color: 'var(--ink-3)', lineHeight: 1.55 } },
        `${brandName} valida ideas, diseña tu marketing, fija tus precios y analiza a tu competencia. Resultados reales, no teoría.`),
      React.createElement('div', { className: 'anim-fade-up', style: { display: 'flex', gap: 12, justifyContent: 'center', marginTop: 30, flexWrap: 'wrap' } },
        React.createElement(Button, { variant: 'primary', size: 'lg', icon: 'arrowRight', onClick: onStart }, 'Empieza gratis'),
        React.createElement(Button, { variant: 'secondary', size: 'lg', icon: 'play', onClick: onStart }, 'Ver demo')),
      React.createElement('div', { style: { marginTop: 56 }, className: 'anim-fade-up' }, React.createElement(ChatMockup, { brandName })),
    ),

    // social proof
    React.createElement(Section, { style: { padding: '30px 24px 50px', textAlign: 'center' } },
      React.createElement('p', { style: { fontSize: 13, fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 22 } }, 'Usado por fundadores que ya facturan'),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: 'clamp(24px,5vw,56px)', flexWrap: 'wrap', alignItems: 'center', opacity: 0.55, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' } },
        ['Lumina', 'Vértiz', 'Cobalto', 'Mente', 'Raíz Studio'].map((b, i) => React.createElement('span', { key: i }, b)))),

    // features
    React.createElement('div', { style: { background: 'var(--surface)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '72px 0' } },
      React.createElement(Section, null,
        React.createElement('div', { style: { textAlign: 'center', marginBottom: 48 } },
          React.createElement('h2', { style: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.03em' } }, 'Todo lo que un consultor caro haría'),
          React.createElement('p', { style: { margin: '12px auto 0', maxWidth: 480, fontSize: 16.5, color: 'var(--ink-3)' } }, 'En segundos, por una fracción del coste y disponible 24/7.')),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22 } },
          FEATURES.map((f, i) => React.createElement('div', { key: i, style: { padding: 4 } },
            React.createElement('div', { style: { width: 46, height: 46, borderRadius: 'var(--r-md)', background: 'var(--accent-tint)', color: 'var(--accent-700)', display: 'grid', placeItems: 'center', marginBottom: 16 } }, React.createElement(Icon, { name: f.icon, size: 23 })),
            React.createElement('h3', { style: { margin: '0 0 7px', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' } }, f.t),
            React.createElement('p', { style: { margin: 0, fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.6 } }, f.d)))))),

    // use cases
    React.createElement(Section, { style: { padding: '72px 24px' } },
      React.createElement('h2', { style: { margin: '0 0 40px', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.03em' } }, 'Sea cual sea tu etapa'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 } },
        USES.map((u, i) => React.createElement('div', { key: i, style: { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: 28, boxShadow: 'var(--sh-xs)' } },
          React.createElement('div', { style: { width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center', marginBottom: 18 } }, React.createElement(Icon, { name: u.icon, size: 22 })),
          React.createElement('h3', { style: { margin: '0 0 8px', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' } }, u.t),
          React.createElement('p', { style: { margin: 0, fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.6 } }, u.d))))),

    // pricing
    React.createElement('div', { style: { background: 'var(--surface)', borderTop: '1px solid var(--line)', padding: '72px 0' } },
      React.createElement(Section, null,
        React.createElement('h2', { style: { margin: '0 0 12px', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.03em' } }, 'Empieza gratis, crece con Pro'),
        React.createElement('p', { style: { margin: '0 auto 44px', textAlign: 'center', fontSize: 16.5, color: 'var(--ink-3)' } }, 'Sin tarjeta para empezar. Cancela cuando quieras.'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22, maxWidth: 760, margin: '0 auto' } },
          React.createElement('div', { style: { border: '1px solid var(--line-2)', borderRadius: 'var(--r-2xl)', padding: 30, background: 'var(--surface)' } },
            React.createElement('div', { style: { fontWeight: 700, fontSize: 17 } }, 'Gratis'),
            React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 6, margin: '14px 0 20px' } }, React.createElement('span', { className: 'mono', style: { fontSize: 38, fontWeight: 700 } }, '0 €'), React.createElement('span', { style: { color: 'var(--ink-4)' } }, '/mes')),
            ['10 mensajes al día', '3 herramientas básicas', 'Memoria de contexto'].map((x, i) => React.createElement('div', { key: i, style: { display: 'flex', gap: 10, alignItems: 'center', fontSize: 14.5, color: 'var(--ink-2)', padding: '7px 0' } }, React.createElement(Icon, { name: 'check', size: 16, stroke: 2.2, style: { color: 'var(--accent)' } }), x)),
            React.createElement('div', { style: { marginTop: 18 } }, React.createElement(Button, { variant: 'secondary', full: true, onClick: onStart }, 'Empezar gratis'))),
          React.createElement('div', { style: { border: '2px solid var(--gold-bright)', borderRadius: 'var(--r-2xl)', padding: 30, background: 'linear-gradient(180deg, var(--gold-tint), var(--surface))', position: 'relative' } },
            React.createElement('div', { style: { position: 'absolute', top: -13, left: 30 } }, React.createElement(PremiumPill, null)),
            React.createElement('div', { style: { fontWeight: 700, fontSize: 17 } }, 'Pro'),
            React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 6, margin: '14px 0 20px' } }, React.createElement('span', { className: 'mono', style: { fontSize: 38, fontWeight: 700 } }, '19 €'), React.createElement('span', { style: { color: 'var(--ink-4)' } }, '/mes')),
            ['Mensajes ilimitados', 'Todas las herramientas premium', 'IA más avanzada', 'Exportación y sin anuncios'].map((x, i) => React.createElement('div', { key: i, style: { display: 'flex', gap: 10, alignItems: 'center', fontSize: 14.5, color: 'var(--ink-2)', padding: '7px 0' } }, React.createElement(Icon, { name: 'check', size: 16, stroke: 2.2, style: { color: 'var(--gold)' } }), x)),
            React.createElement('div', { style: { marginTop: 18 } }, React.createElement(Button, { variant: 'gold', full: true, icon: 'crown', onClick: onStart }, 'Probar Pro')))))),

    // FAQ
    React.createElement(Section, { style: { padding: '72px 24px', maxWidth: 820 } },
      React.createElement('h2', { style: { margin: '0 0 28px', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.03em' } }, 'Preguntas frecuentes'),
      FAQS.map((f, i) => React.createElement(FAQItem, { key: i, q: f.q, a: f.a }))),

    // CTA final
    React.createElement(Section, { style: { padding: '20px 24px 80px' } },
      React.createElement('div', { style: { background: 'var(--ink)', borderRadius: 'var(--r-2xl)', padding: 'clamp(36px,6vw,64px)', textAlign: 'center', color: '#fff' } },
        React.createElement('h2', { style: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, letterSpacing: '-0.03em' } }, 'Tu próxima gran idea empieza hoy'),
        React.createElement('p', { style: { margin: '14px auto 28px', maxWidth: 440, fontSize: 16.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 } }, 'Únete y valida tu primera idea en menos de cinco minutos.'),
        React.createElement(Button, { variant: 'primary', size: 'lg', icon: 'arrowRight', onClick: onStart }, 'Empezar gratis'))),

    // footer
    React.createElement('div', { style: { borderTop: '1px solid var(--line)', padding: '32px 0' } },
      React.createElement(Section, { style: { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' } },
        React.createElement(Logo, { size: 22, label: brandName }),
        React.createElement('span', { style: { fontSize: 13, color: 'var(--ink-4)' } }, '© 2026 · Hecho para emprendedores'),
        React.createElement('div', { style: { flex: 1 } }),
        React.createElement('div', { style: { display: 'flex', gap: 22, fontSize: 13.5, color: 'var(--ink-3)' } }, ['Privacidad', 'Términos', 'Contacto'].map((l, i) => React.createElement('a', { key: i, href: '#' }, l))))),

    React.createElement('style', null, '@media (max-width: 640px){ .nav-links{ display:none !important; } }'),
  );
}

window.Landing = Landing;
