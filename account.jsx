/* global React, Icon, Logo, Button, Badge, PremiumPill, Avatar, Card */
// account.jsx — checkout premium simulado + ajustes/perfil.

// ——— Checkout ———
function fmtCard(v) { return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); }
function fmtExp(v) { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; }

function Checkout({ onClose, onSuccess, brandName }) {
  const [cycle, setCycle] = React.useState('annual');
  const [stage, setStage] = React.useState('form'); // form | processing | done
  const [card, setCard] = React.useState(''); const [exp, setExp] = React.useState(''); const [cvc, setCvc] = React.useState(''); const [nm, setNm] = React.useState('');
  const price = cycle === 'annual' ? '15' : '19';
  const valid = card.replace(/\s/g, '').length >= 15 && exp.length === 5 && cvc.length >= 3 && nm.trim();

  const pay = () => { if (!valid) return; setStage('processing'); setTimeout(() => { setStage('done'); setTimeout(onSuccess, 1300); }, 1700); };

  const input = (props) => React.createElement('input', { ...props, onFocus: (e) => e.target.style.borderColor = 'var(--accent)', onBlur: (e) => e.target.style.borderColor = 'var(--line-2)',
    style: { width: '100%', padding: '11px 14px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 15, outline: 'none', transition: 'border-color .15s', background: 'var(--surface)', ...(props.style || {}) } });

  return React.createElement('div', { onClick: onClose, style: { position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(19,19,22,0.45)', backdropFilter: 'blur(6px)', display: 'grid', placeItems: 'center', padding: 20, animation: 'fadeIn .2s' } },
    React.createElement('div', { onClick: (e) => e.stopPropagation(), style: { width: 'min(900px, 100%)', maxHeight: '92vh', overflowY: 'auto', background: 'var(--surface)', borderRadius: 'var(--r-2xl)', boxShadow: 'var(--sh-xl)', display: 'grid', gridTemplateColumns: '1fr 1fr', animation: 'pop .25s var(--ease-out)' }, className: 'checkout-grid' },
      // resumen
      React.createElement('div', { style: { padding: '34px 34px', background: 'linear-gradient(165deg, var(--gold-tint), var(--surface))', borderRight: '1px solid var(--line)' } },
        React.createElement('div', { style: { display: 'inline-flex', marginBottom: 18 } }, React.createElement(PremiumPill, null)),
        React.createElement('h2', { style: { margin: '0 0 6px', fontFamily: 'var(--font-display)', fontSize: 25, fontWeight: 800, letterSpacing: '-0.03em' } }, `${brandName} Pro`),
        React.createElement('p', { style: { margin: '0 0 24px', fontSize: 14.5, color: 'var(--ink-3)', lineHeight: 1.5 } }, 'IA avanzada, herramientas y mensajes ilimitados.'),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 26 } },
          ['Mensajes ilimitados', 'Las 6 herramientas premium', 'Análisis profundos + exportación', 'Sin anuncios'].map((f, i) =>
            React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 } }, React.createElement(Icon, { name: 'check', size: 15, stroke: 2.3, style: { color: 'var(--accent)' } }), f))),
        React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 18 } },
          ['annual', 'monthly'].map(c => React.createElement('button', { key: c, className: 'focusable', onClick: () => setCycle(c),
            style: { flex: 1, padding: '12px', borderRadius: 'var(--r-md)', border: `1.5px solid ${cycle === c ? 'var(--accent)' : 'var(--line-2)'}`, background: cycle === c ? 'var(--accent-tint)' : 'var(--surface)', textAlign: 'left', transition: 'all .15s' } },
            React.createElement('div', { style: { fontSize: 13, fontWeight: 700 } }, c === 'annual' ? 'Anual' : 'Mensual'),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--ink-3)', marginTop: 2 } }, c === 'annual' ? '15 €/mes · 2 meses gratis' : '19 €/mes')))),
        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 6, paddingTop: 16, borderTop: '1px solid var(--line)' } },
          React.createElement('span', { style: { fontSize: 14, color: 'var(--ink-3)' } }, 'Total hoy'),
          React.createElement('span', { style: { marginLeft: 'auto' } }, React.createElement('span', { className: 'mono', style: { fontSize: 26, fontWeight: 700 } }, cycle === 'annual' ? '180 €' : '19 €')),
          React.createElement('span', { style: { fontSize: 12.5, color: 'var(--ink-4)' } }, cycle === 'annual' ? '/año' : '/mes'))),

      // formulario de pago
      React.createElement('div', { style: { padding: '34px 34px', position: 'relative' } },
        stage === 'form' && React.createElement(React.Fragment, null,
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', marginBottom: 22 } },
            React.createElement('h3', { style: { margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' } }, 'Datos de pago'),
            React.createElement('button', { className: 'focusable', onClick: onClose, style: { marginLeft: 'auto', color: 'var(--ink-4)' } }, React.createElement(Icon, { name: 'close', size: 20 }))),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 15 } },
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 7 } }, React.createElement('label', { style: { fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' } }, 'Nombre en la tarjeta'), input({ value: nm, onChange: (e) => setNm(e.target.value), placeholder: 'Marco Ríos' })),
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 7 } }, React.createElement('label', { style: { fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' } }, 'Número de tarjeta'),
              React.createElement('div', { style: { position: 'relative', display: 'flex', alignItems: 'center' } }, React.createElement(Icon, { name: 'card', size: 18, style: { position: 'absolute', left: 13, color: 'var(--ink-4)' } }), input({ value: card, onChange: (e) => setCard(fmtCard(e.target.value)), placeholder: '4242 4242 4242 4242', className: 'mono', style: { paddingLeft: 40 } }))),
            React.createElement('div', { style: { display: 'flex', gap: 12 } },
              React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 7 } }, React.createElement('label', { style: { fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' } }, 'Caducidad'), input({ value: exp, onChange: (e) => setExp(fmtExp(e.target.value)), placeholder: 'MM/AA', className: 'mono' })),
              React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 7 } }, React.createElement('label', { style: { fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' } }, 'CVC'), input({ value: cvc, onChange: (e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4)), placeholder: '123', className: 'mono' }))),
            React.createElement(Button, { variant: 'gold', size: 'lg', full: true, icon: 'lock', onClick: pay, disabled: !valid, style: { marginTop: 6 } }, `Pagar ${cycle === 'annual' ? '180 €' : '19 €'}`),
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 12.5, color: 'var(--ink-4)' } }, React.createElement(Icon, { name: 'shield', size: 14 }), 'Pago simulado · garantía de 14 días'))),

        stage === 'processing' && React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 } },
          React.createElement('div', { style: { width: 48, height: 48, borderRadius: 999, border: '4px solid var(--line-2)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' } }),
          React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: 'var(--ink-2)' } }, 'Procesando pago…'),
          React.createElement('style', null, '@keyframes spin{to{transform:rotate(360deg)}}')),

        stage === 'done' && React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, animation: 'pop .3s var(--ease-out)' } },
          React.createElement('div', { style: { width: 64, height: 64, borderRadius: 999, background: 'var(--accent-tint)', color: 'var(--accent-700)', display: 'grid', placeItems: 'center' } }, React.createElement(Icon, { name: 'check', size: 34, stroke: 2.5 })),
          React.createElement('h3', { style: { margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' } }, '¡Bienvenido a Pro!'),
          React.createElement('p', { style: { margin: 0, fontSize: 14.5, color: 'var(--ink-3)' } }, 'Todo desbloqueado. Vamos a por ello.'))),
      React.createElement('style', null, '@media (max-width: 720px){ .checkout-grid{ grid-template-columns: 1fr !important; } }'),
    ),
  );
}

// ——— Ajustes / Perfil ———
const ACCENT_OPTS = [
  { key: 'esmeralda', c: '#10B981' }, { key: 'índigo', c: '#6366F1' }, { key: 'azul', c: '#3B82F6' }, { key: 'ámbar', c: '#F59E0B' }, { key: 'tinta', c: '#18181B' },
];
const TONE_OPTS = [
  { key: 'estratega', t: 'Estratega analítico' }, { key: 'mentor', t: 'Mentor directo' }, { key: 'coach', t: 'Coach motivador' }, { key: 'mezcla', t: 'Mezcla equilibrada' },
];

function Row({ label, desc, children }) {
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--line)' } },
    React.createElement('div', { style: { flex: 1 } },
      React.createElement('div', { style: { fontSize: 14.5, fontWeight: 600 } }, label),
      desc && React.createElement('div', { style: { fontSize: 13, color: 'var(--ink-3)', marginTop: 3, maxWidth: 420, lineHeight: 1.45 } }, desc)),
    React.createElement('div', null, children));
}

function Settings({ store, onUpgrade, onSignOut, onBack }) {
  const { state, actions, isPro } = store;
  const user = state.user || {};
  const s = state.settings;
  const [name, setName] = React.useState(user.name || '');
  const [business, setBusiness] = React.useState(user.business || '');

  return React.createElement('div', { style: { maxWidth: 720, margin: '0 auto', padding: '32px 24px 80px' } },
    React.createElement('h1', { style: { margin: '0 0 28px', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' } }, 'Ajustes'),

    // perfil
    React.createElement(Card, { pad: 24, style: { marginBottom: 20 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 } },
        React.createElement(Avatar, { name: name || 'Tú', size: 56 }),
        React.createElement('div', null, React.createElement('div', { style: { fontWeight: 700, fontSize: 17 } }, name || 'Tu nombre'), React.createElement('div', { style: { fontSize: 13.5, color: 'var(--ink-4)' } }, user.email || 'sin email'))),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 14 } },
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 7 } }, React.createElement('label', { style: { fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' } }, 'Nombre'),
          React.createElement('input', { value: name, onChange: (e) => setName(e.target.value), onBlur: () => actions.setUser({ name }), style: { padding: '10px 13px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 14.5, outline: 'none', background: 'var(--surface)' } })),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 7 } }, React.createElement('label', { style: { fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' } }, 'Tu negocio (contexto para la IA)'),
          React.createElement('textarea', { value: business, onChange: (e) => setBusiness(e.target.value), onBlur: () => actions.setUser({ business }), rows: 2, style: { padding: '10px 13px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 14.5, outline: 'none', resize: 'vertical', lineHeight: 1.5, background: 'var(--surface)' } })))),

    // plan
    React.createElement(Card, { pad: 24, style: { marginBottom: 20 } },
      React.createElement('div', { style: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-4)', marginBottom: 16 } }, 'Plan y facturación'),
      isPro
        ? React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
            React.createElement('div', { style: { width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--gold-tint)', color: 'var(--gold)', display: 'grid', placeItems: 'center' } }, React.createElement(Icon, { name: 'crown', size: 22 })),
            React.createElement('div', { style: { flex: 1 } }, React.createElement('div', { style: { fontWeight: 700, fontSize: 15.5 } }, 'Plan Pro activo'), React.createElement('div', { style: { fontSize: 13, color: 'var(--ink-3)' } }, 'Mensajes y herramientas ilimitadas')),
            React.createElement(Button, { variant: 'ghost', size: 'sm', onClick: actions.downgrade }, 'Cancelar'))
        : React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } },
            React.createElement('div', { style: { flex: 1 } }, React.createElement('div', { style: { fontWeight: 700, fontSize: 15.5 } }, 'Plan gratuito'), React.createElement('div', { style: { fontSize: 13, color: 'var(--ink-3)' } }, `${store.remaining} de ${store.FREE_LIMIT} mensajes restantes hoy`)),
            React.createElement(Button, { variant: 'gold', size: 'sm', icon: 'crown', onClick: onUpgrade }, 'Mejorar a Pro'))),

    // preferencias IA + apariencia
    React.createElement(Card, { pad: 24, style: { marginBottom: 20 } },
      React.createElement('div', { style: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-4)', marginBottom: 4 } }, 'Preferencias'),
      React.createElement(Row, { label: 'Personalidad de la IA', desc: 'Cómo se comunica tu copiloto.' },
        React.createElement('select', { value: s.aiTone, onChange: (e) => actions.updateSettings({ aiTone: e.target.value }), style: { padding: '9px 12px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 14, background: 'var(--surface)', cursor: 'pointer', outline: 'none' } },
          TONE_OPTS.map(o => React.createElement('option', { key: o.key, value: o.key }, o.t)))),
      React.createElement(Row, { label: 'Color de acento' },
        React.createElement('div', { style: { display: 'flex', gap: 8 } }, ACCENT_OPTS.map(a => React.createElement('button', { key: a.key, className: 'focusable', onClick: () => actions.updateSettings({ accent: a.key }),
          style: { width: 30, height: 30, borderRadius: 999, background: a.c, border: s.accent === a.key ? '2.5px solid var(--ink)' : '2.5px solid transparent', cursor: 'pointer', boxShadow: '0 0 0 1px var(--line-2)' }, title: a.key })))),
      React.createElement(Row, { label: 'Densidad' },
        React.createElement('div', { style: { display: 'flex', gap: 4, background: 'var(--surface-3)', padding: 3, borderRadius: 'var(--r-md)' } },
          ['compact', 'regular', 'comfy'].map(d => React.createElement('button', { key: d, className: 'focusable', onClick: () => actions.updateSettings({ density: d }),
            style: { padding: '6px 12px', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 600, color: s.density === d ? 'var(--ink)' : 'var(--ink-3)', background: s.density === d ? 'var(--surface)' : 'transparent', boxShadow: s.density === d ? 'var(--sh-xs)' : 'none', textTransform: 'capitalize' } }, d))))),

    // peligro
    React.createElement('div', { style: { display: 'flex', gap: 12 } },
      React.createElement(Button, { variant: 'secondary', icon: 'logout', onClick: onSignOut }, 'Cerrar sesión'),
      React.createElement(Button, { variant: 'ghost', icon: 'trash', onClick: () => { if (confirm('¿Borrar todos los datos locales?')) actions.resetAll(); }, style: { color: 'var(--danger)' } }, 'Borrar mis datos')),
  );
}

Object.assign(window, { Checkout, Settings });
