/* global React, Icon, Logo, Button, Badge */
// auth.jsx — login / registro + onboarding multipaso.

function AuthAside({ brandName }) {
  return React.createElement('div', { className: 'auth-aside', style: { flex: 1, background: 'var(--ink)', color: '#fff', padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100%' } },
    React.createElement(Logo, { size: 28, label: brandName, color: '#fff' }),
    React.createElement('div', null,
      React.createElement('h2', { style: { fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1, margin: '0 0 16px', maxWidth: 360 } }, 'El estratega que tu negocio necesita, hoy.'),
      React.createElement('p', { style: { fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55, maxWidth: 340, margin: 0 } }, 'Valida ideas, diseña tu marketing y fija tus precios con criterio. Empieza gratis.')),
    React.createElement('div', { style: { display: 'flex', gap: 10, alignItems: 'center', fontSize: 13.5, color: 'rgba(255,255,255,0.6)' } },
      React.createElement(Icon, { name: 'shield', size: 18 }), 'Tus datos se guardan solo en este navegador.'),
    React.createElement('style', null, '@media (max-width: 860px){ .auth-aside{ display:none !important; } }'),
  );
}

function Field({ label, type = 'text', value, onChange, placeholder, icon }) {
  const [reveal, setReveal] = React.useState(false);
  const isPw = type === 'password';
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 7 } },
    React.createElement('label', { style: { fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)' } }, label),
    React.createElement('div', { style: { position: 'relative', display: 'flex', alignItems: 'center' } },
      icon && React.createElement(Icon, { name: icon, size: 18, style: { position: 'absolute', left: 13, color: 'var(--ink-4)' } }),
      React.createElement('input', { type: isPw && !reveal ? 'password' : 'text', value, onChange: (e) => onChange(e.target.value), placeholder,
        onFocus: (e) => e.target.style.borderColor = 'var(--accent)', onBlur: (e) => e.target.style.borderColor = 'var(--line-2)',
        style: { width: '100%', padding: icon ? '12px 14px 12px 40px' : '12px 14px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 15, outline: 'none', transition: 'border-color .15s', background: 'var(--surface)' } }),
      isPw && React.createElement('button', { type: 'button', onClick: () => setReveal(r => !r), className: 'focusable', style: { position: 'absolute', right: 10, color: 'var(--ink-4)', padding: 4 } }, React.createElement(Icon, { name: reveal ? 'eyeOff' : 'eye', size: 18 }))),
  );
}

function AuthScreen({ brandName, onAuth, onBack }) {
  const [mode, setMode] = React.useState('signup');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const valid = email.includes('@') && pw.length >= 4 && (mode === 'login' || name.trim());

  return React.createElement('div', { style: { display: 'flex', height: '100%', background: 'var(--surface)' } },
    React.createElement(AuthAside, { brandName }),
    React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' } },
      React.createElement('div', { style: { padding: '20px 24px' } },
        React.createElement('button', { className: 'focusable', onClick: onBack, style: { display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 600, color: 'var(--ink-3)' } }, React.createElement(Icon, { name: 'arrowLeft', size: 16 }), 'Volver')),
      React.createElement('div', { style: { flex: 1, display: 'grid', placeItems: 'center', padding: '20px 24px 40px' } },
        React.createElement('div', { style: { width: '100%', maxWidth: 380 } },
          React.createElement('div', { className: 'auth-logo-mobile', style: { display: 'none', justifyContent: 'center', marginBottom: 24 } }, React.createElement(Logo, { size: 28, label: brandName })),
          React.createElement('h1', { style: { margin: '0 0 6px', fontFamily: 'var(--font-display)', fontSize: 27, fontWeight: 800, letterSpacing: '-0.03em' } }, mode === 'signup' ? 'Crea tu cuenta' : 'Bienvenido de vuelta'),
          React.createElement('p', { style: { margin: '0 0 26px', fontSize: 15, color: 'var(--ink-3)' } }, mode === 'signup' ? 'Empieza gratis en menos de un minuto.' : 'Entra para seguir donde lo dejaste.'),

          React.createElement(Button, { variant: 'secondary', full: true, onClick: () => onAuth({ name: name || 'Marco Ríos', email: email || 'hola@ejemplo.com' }), style: { marginBottom: 12, gap: 10 } },
            React.createElement('span', { style: { fontWeight: 700, color: '#4285F4' } }, 'G'), 'Continuar con Google'),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 18px', color: 'var(--ink-4)', fontSize: 12.5 } },
            React.createElement('div', { style: { flex: 1, height: 1, background: 'var(--line-2)' } }), 'o con tu email', React.createElement('div', { style: { flex: 1, height: 1, background: 'var(--line-2)' } })),

          React.createElement('form', { onSubmit: (e) => { e.preventDefault(); if (valid) onAuth({ name: name || 'Marco Ríos', email }); }, style: { display: 'flex', flexDirection: 'column', gap: 15 } },
            mode === 'signup' && React.createElement(Field, { label: 'Nombre', value: name, onChange: setName, placeholder: 'Tu nombre', icon: 'user' }),
            React.createElement(Field, { label: 'Email', value: email, onChange: setEmail, placeholder: 'tu@email.com', icon: 'mail' }),
            React.createElement(Field, { label: 'Contraseña', type: 'password', value: pw, onChange: setPw, placeholder: '••••••••', icon: 'lock' }),
            React.createElement(Button, { variant: 'primary', full: true, size: 'lg', onClick: () => { if (valid) onAuth({ name: name || 'Marco Ríos', email }); }, disabled: !valid, style: { marginTop: 4 } }, mode === 'signup' ? 'Crear cuenta' : 'Entrar')),

          React.createElement('p', { style: { textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--ink-3)' } },
            mode === 'signup' ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? ',
            React.createElement('button', { className: 'focusable', onClick: () => setMode(m => m === 'signup' ? 'login' : 'signup'), style: { fontWeight: 700, color: 'var(--accent-700)' } }, mode === 'signup' ? 'Entrar' : 'Regístrate')),
        )),
      React.createElement('style', null, '@media (max-width: 860px){ .auth-logo-mobile{ display:flex !important; } }'),
    ),
  );
}

const STAGES = [
  { id: 'idea', icon: 'lightbulb', t: 'Tengo una idea', d: 'Quiero validarla y darle forma' },
  { id: 'launch', icon: 'rocket', t: 'Estoy lanzando', d: 'Busco mis primeros clientes' },
  { id: 'growth', icon: 'trend', t: 'Ya facturo', d: 'Quiero crecer y escalar' },
];
const GOALS = [
  { id: 'validate', icon: 'target', t: 'Validar una idea' },
  { id: 'marketing', icon: 'megaphone', t: 'Conseguir clientes' },
  { id: 'pricing', icon: 'scale', t: 'Mejorar mis precios' },
  { id: 'strategy', icon: 'compass', t: 'Estrategia de crecimiento' },
];

function ChoiceCard({ item, selected, onClick }) {
  return React.createElement('button', { className: 'focusable', onClick,
    style: { display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 'var(--r-lg)', textAlign: 'left', width: '100%',
      border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--line-2)'}`, background: selected ? 'var(--accent-tint)' : 'var(--surface)', transition: 'all .15s', boxShadow: selected ? 'var(--sh-sm)' : 'none' } },
    React.createElement('div', { style: { width: 42, height: 42, borderRadius: 'var(--r-md)', display: 'grid', placeItems: 'center', background: selected ? 'var(--accent)' : 'var(--surface-3)', color: selected ? '#fff' : 'var(--ink-3)', flexShrink: 0 } }, React.createElement(Icon, { name: item.icon, size: 21 })),
    React.createElement('div', { style: { flex: 1 } },
      React.createElement('div', { style: { fontWeight: 650, fontSize: 15.5, letterSpacing: '-0.01em' } }, item.t),
      item.d && React.createElement('div', { style: { fontSize: 13, color: 'var(--ink-3)', marginTop: 2 } }, item.d)),
    selected && React.createElement(Icon, { name: 'checkCircle', size: 20, style: { color: 'var(--accent)' } }));
}

function Onboarding({ brandName, name, onComplete }) {
  const [step, setStep] = React.useState(0);
  const [profile, setProfile] = React.useState({ stage: '', business: '', goal: '' });
  const set = (k, v) => setProfile(p => ({ ...p, [k]: v }));
  const total = 3;
  const canNext = step === 0 ? profile.stage : step === 1 ? profile.business.trim().length > 3 : profile.goal;

  const next = () => { if (step < total - 1) setStep(s => s + 1); else onComplete(profile); };

  return React.createElement('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--canvas)', overflowY: 'auto' } },
    React.createElement('div', { style: { padding: '22px 24px 0', maxWidth: 560, margin: '0 auto', width: '100%' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 } },
        React.createElement(Logo, { size: 24, label: brandName }),
        React.createElement('span', { style: { marginLeft: 'auto', fontSize: 13, color: 'var(--ink-4)', fontWeight: 600 } }, `Paso ${step + 1} de ${total}`)),
      React.createElement('div', { style: { height: 4, background: 'var(--surface-3)', borderRadius: 999, overflow: 'hidden' } },
        React.createElement('div', { style: { width: `${((step + 1) / total) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 999, transition: 'width .4s var(--ease-out)' } }))),

    React.createElement('div', { style: { flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px' } },
      React.createElement('div', { key: step, className: 'anim-fade-up', style: { width: '100%', maxWidth: 480 } },
        step === 0 && React.createElement(React.Fragment, null,
          React.createElement('h1', { style: { margin: '0 0 8px', fontFamily: 'var(--font-display)', fontSize: 27, fontWeight: 800, letterSpacing: '-0.03em' } }, `Hola, ${name.split(' ')[0]}. ¿En qué punto estás?`),
          React.createElement('p', { style: { margin: '0 0 26px', fontSize: 15, color: 'var(--ink-3)' } }, 'Así adapto mis respuestas a tu momento.'),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } }, STAGES.map(s => React.createElement(ChoiceCard, { key: s.id, item: s, selected: profile.stage === s.id, onClick: () => set('stage', s.id) })))),
        step === 1 && React.createElement(React.Fragment, null,
          React.createElement('h1', { style: { margin: '0 0 8px', fontFamily: 'var(--font-display)', fontSize: 27, fontWeight: 800, letterSpacing: '-0.03em' } }, 'Cuéntame de tu negocio'),
          React.createElement('p', { style: { margin: '0 0 26px', fontSize: 15, color: 'var(--ink-3)' } }, 'Una o dos frases bastan. Lo recordaré en cada conversación.'),
          React.createElement('textarea', { value: profile.business, onChange: (e) => set('business', e.target.value), placeholder: 'Ej: Vendo café de especialidad por suscripción a profesionales en España…', rows: 4,
            onFocus: (e) => e.target.style.borderColor = 'var(--accent)', onBlur: (e) => e.target.style.borderColor = 'var(--line-2)',
            style: { width: '100%', padding: '14px 16px', border: '1.5px solid var(--line-2)', borderRadius: 'var(--r-md)', fontSize: 15.5, outline: 'none', resize: 'vertical', lineHeight: 1.5, background: 'var(--surface)' } })),
        step === 2 && React.createElement(React.Fragment, null,
          React.createElement('h1', { style: { margin: '0 0 8px', fontFamily: 'var(--font-display)', fontSize: 27, fontWeight: 800, letterSpacing: '-0.03em' } }, '¿Cuál es tu objetivo principal?'),
          React.createElement('p', { style: { margin: '0 0 26px', fontSize: 15, color: 'var(--ink-3)' } }, 'Empezaré por aquí. Podrás cambiarlo cuando quieras.'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } }, GOALS.map(g => React.createElement(ChoiceCard, { key: g.id, item: g, selected: profile.goal === g.id, onClick: () => set('goal', g.id) })))),

        React.createElement('div', { style: { display: 'flex', gap: 12, marginTop: 30 } },
          step > 0 && React.createElement(Button, { variant: 'ghost', onClick: () => setStep(s => s - 1), icon: 'arrowLeft' }, 'Atrás'),
          React.createElement('div', { style: { flex: 1 } }),
          React.createElement(Button, { variant: 'primary', size: 'lg', iconRight: step === total - 1 ? 'check' : 'arrowRight', onClick: next, disabled: !canNext }, step === total - 1 ? 'Empezar' : 'Continuar')),
      )),
  );
}

Object.assign(window, { AuthScreen, Onboarding });
