/* global React, Icon */
// ui.jsx — primitivos compartidos. Exporta a window al final.

// ——— Logo / marca: estrella-brújula del norte (geométrica, original) ———
function Logo({ size = 26, color = 'var(--accent)', label }) {
  return React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', gap: 9 } },
    React.createElement('svg', {
      width: size, height: size, viewBox: '0 0 32 32', fill: 'none', 'aria-hidden': 'true',
    },
      // anillo
      React.createElement('circle', { cx: 16, cy: 16, r: 14.5, stroke: color, strokeWidth: 1.5, opacity: 0.28 }),
      // aguja norte (rombo alargado)
      React.createElement('path', { d: 'M16 3.5 19.2 16 16 28.5 12.8 16z', fill: color }),
      React.createElement('path', { d: 'M16 3.5 16 16 12.8 16z', fill: '#fff', opacity: 0.35 }),
      // eje horizontal sutil
      React.createElement('path', { d: 'M5 16 16 14.2 27 16 16 17.8z', fill: color, opacity: 0.32 }),
    ),
    label && React.createElement('span', {
      style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size * 0.78, letterSpacing: '-0.03em', color: 'var(--ink)' },
    }, label)
  );
}

// ——— Botón ———
function Button({ children, variant = 'primary', size = 'md', icon, iconRight, full, onClick, style = {}, title, disabled }) {
  const sizes = {
    sm: { padding: '7px 13px', fontSize: 13, gap: 6, h: 32, isize: 16 },
    md: { padding: '10px 18px', fontSize: 14.5, gap: 8, h: 40, isize: 18 },
    lg: { padding: '13px 24px', fontSize: 16, gap: 9, h: 50, isize: 20 },
  }[size];
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff', boxShadow: 'var(--sh-accent)', border: '1px solid var(--accent-600)' },
    dark: { background: 'var(--ink)', color: '#fff', border: '1px solid var(--ink)' },
    secondary: { background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line-2)', boxShadow: 'var(--sh-xs)' },
    ghost: { background: 'transparent', color: 'var(--ink-2)', border: '1px solid transparent' },
    gold: { background: 'linear-gradient(180deg, #FBBF24, var(--gold-bright))', color: '#3a2a05', border: '1px solid #D9920A', boxShadow: '0 4px 14px rgba(245,158,11,0.30)' },
  }[variant];
  return React.createElement('button', {
    onClick, title, disabled,
    className: 'btn focusable',
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: sizes.gap,
      padding: sizes.padding, fontSize: sizes.fontSize, fontWeight: 600, height: sizes.h,
      borderRadius: 'var(--r-md)', letterSpacing: '-0.01em', width: full ? '100%' : 'auto',
      transition: 'transform .14s var(--ease), box-shadow .2s var(--ease), background .2s var(--ease), filter .2s',
      opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto',
      ...variants, ...style,
    },
    onMouseDown: (e) => { e.currentTarget.style.transform = 'scale(0.97)'; },
    onMouseUp: (e) => { e.currentTarget.style.transform = 'scale(1)'; },
    onMouseLeave: (e) => { e.currentTarget.style.transform = 'scale(1)'; },
  },
    icon && React.createElement(Icon, { name: icon, size: sizes.isize }),
    children && React.createElement('span', null, children),
    iconRight && React.createElement(Icon, { name: iconRight, size: sizes.isize }),
  );
}

// ——— Badge ———
function Badge({ children, tone = 'neutral', icon, size = 'md' }) {
  const tones = {
    neutral: { bg: 'var(--surface-3)', fg: 'var(--ink-3)', bd: 'transparent' },
    accent: { bg: 'var(--accent-tint)', fg: 'var(--accent-700)', bd: 'var(--accent-tint-2)' },
    gold: { bg: 'var(--gold-tint)', fg: 'var(--gold)', bd: 'var(--gold-tint-2)' },
    info: { bg: '#EFF6FF', fg: '#1D4ED8', bd: '#DBEAFE' },
    danger: { bg: '#FEF2F2', fg: '#C0383C', bd: '#FECDD3' },
  }[tone];
  const sz = size === 'sm' ? { p: '2px 8px', f: 11.5, i: 12 } : { p: '4px 10px', f: 12.5, i: 14 };
  return React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: sz.p, fontSize: sz.f, fontWeight: 600,
      borderRadius: 'var(--r-full)', background: tones.bg, color: tones.fg, border: `1px solid ${tones.bd}`,
      letterSpacing: '-0.01em', whiteSpace: 'nowrap',
    },
  },
    icon && React.createElement(Icon, { name: icon, size: sz.i }),
    children
  );
}

// ——— Píldora premium (oro, con corona) ———
function PremiumPill({ small }) {
  return React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: small ? '2px 7px' : '3px 9px',
      fontSize: small ? 10.5 : 11.5, fontWeight: 700, borderRadius: 'var(--r-full)',
      background: 'var(--gold-tint)', color: 'var(--gold)', border: '1px solid var(--gold-tint-2)',
      letterSpacing: '0.02em', textTransform: 'uppercase',
    },
  }, React.createElement(Icon, { name: 'crown', size: small ? 11 : 12 }), 'Pro');
}

// ——— Avatar ———
function Avatar({ name = 'Tú', size = 34, accent }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return React.createElement('div', {
    style: {
      width: size, height: size, borderRadius: 'var(--r-full)', flexShrink: 0,
      background: accent || 'linear-gradient(140deg, #2DD4A7, #0E9F6E)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.4, letterSpacing: '-0.02em',
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.08)',
    },
  }, initials);
}

// ——— Card ———
function Card({ children, pad, hover, onClick, style = {}, className = '' }) {
  const [h, setH] = React.useState(false);
  return React.createElement('div', {
    onClick, className,
    onMouseEnter: () => hover && setH(true),
    onMouseLeave: () => hover && setH(false),
    style: {
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)',
      padding: pad ?? 'var(--pad-card)', boxShadow: h ? 'var(--sh-md)' : 'var(--sh-xs)',
      transition: 'box-shadow .25s var(--ease), transform .25s var(--ease), border-color .2s',
      transform: h ? 'translateY(-2px)' : 'none', cursor: onClick ? 'pointer' : 'default',
      borderColor: h ? 'var(--line-strong)' : 'var(--line)',
      ...style,
    },
  }, children);
}

// ——— Tooltip ligero (title nativo envuelto) ———
function IconButton({ name, size = 18, onClick, title, active, tone, style = {} }) {
  const [h, setH] = React.useState(false);
  return React.createElement('button', {
    onClick, title, 'aria-label': title, className: 'focusable',
    onMouseEnter: () => setH(true), onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size + 18, height: size + 18, borderRadius: 'var(--r-sm)',
      color: active ? 'var(--accent-700)' : (tone === 'danger' ? 'var(--danger)' : 'var(--ink-3)'),
      background: active ? 'var(--accent-tint)' : (h ? 'var(--surface-3)' : 'transparent'),
      transition: 'background .15s, color .15s', ...style,
    },
  }, React.createElement(Icon, { name, size }));
}

// ——— Anillo de progreso ———
function ProgressRing({ value = 0, size = 44, stroke = 4, color = 'var(--accent)', track = 'var(--line-2)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return React.createElement('div', { style: { position: 'relative', width: size, height: size } },
    React.createElement('svg', { width: size, height: size, style: { transform: 'rotate(-90deg)' } },
      React.createElement('circle', { cx: size / 2, cy: size / 2, r, fill: 'none', stroke: track, strokeWidth: stroke }),
      React.createElement('circle', {
        cx: size / 2, cy: size / 2, r, fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round',
        strokeDasharray: c, strokeDashoffset: c - (value / 100) * c,
        style: { transition: 'stroke-dashoffset .6s var(--ease-out)' },
      }),
    ),
    children && React.createElement('div', {
      style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    }, children)
  );
}

Object.assign(window, { Logo, Button, Badge, PremiumPill, Avatar, Card, IconButton, ProgressRing });
