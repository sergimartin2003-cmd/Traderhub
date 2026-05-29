/* global React, Icon, Card, Badge, PremiumPill, ProgressRing */
// chat-blocks.jsx — renderizadores de contenido enriquecido del asistente.

// — Markdown ligero: encabezados, viñetas, listas numeradas, tablas y **negrita** —
function isTableRow(l) { return /^\s*\|.*\|\s*$/.test(l); }
function isSep(l) { return /^\s*\|?[\s:|-]+\|?\s*$/.test(l) && l.includes('-'); }

function MdTable({ rows }) {
  const cells = rows.map(r => r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim()));
  const head = cells[0]; const body = cells.slice(1);
  const th = (c, i) => React.createElement('th', { key: i, style: { textAlign: i === 0 ? 'left' : 'right', padding: '10px 14px', fontWeight: 600, color: 'var(--ink-3)', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '1px solid var(--line-2)' } }, c);
  const td = (c, ci, ri) => React.createElement('td', { key: ci, className: ci > 0 ? 'mono' : '', style: { textAlign: ci === 0 ? 'left' : 'right', padding: '10px 14px', borderBottom: ri < body.length - 1 ? '1px solid var(--line)' : 'none', fontWeight: ci === 0 ? 600 : 500, color: ci === 0 ? 'var(--ink)' : 'var(--ink-2)' } }, renderInline(c));
  return React.createElement('div', { style: { border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', overflow: 'hidden', margin: '2px 0' } },
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 13.5 } },
      React.createElement('thead', null, React.createElement('tr', { style: { background: 'var(--surface-2)' } }, head.map((c, i) => th(c, i)))),
      React.createElement('tbody', null, body.map((r, ri) => React.createElement('tr', { key: ri }, r.map((c, ci) => td(c, ci, ri))))),
    ),
  );
}

function RichText({ value }) {
  const lines = (value || '').split('\n');
  const out = []; let i = 0; let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }
    if (isTableRow(line)) {
      const group = [];
      while (i < lines.length && isTableRow(lines[i])) { if (!isSep(lines[i])) group.push(lines[i]); i++; }
      if (group.length) out.push(React.createElement(MdTable, { key: key++, rows: group }));
      continue;
    }
    const t = line.trim();
    if (t.startsWith('# ')) {
      out.push(React.createElement('div', { key: key++, style: { fontSize: 19, fontWeight: 800, letterSpacing: '-0.025em', marginTop: out.length ? 6 : 0 } }, renderInline(t.replace(/^#\s/, ''))));
    } else if (t.startsWith('## ') || t.startsWith('### ')) {
      out.push(React.createElement('div', { key: key++, style: { fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', marginTop: out.length ? 4 : 0 } }, renderInline(t.replace(/^#+\s/, ''))));
    } else if (t.startsWith('• ') || t.startsWith('- ') || t.startsWith('* ')) {
      out.push(React.createElement('div', { key: key++, style: { display: 'flex', gap: 10, paddingLeft: 2 } },
        React.createElement('span', { style: { color: 'var(--accent)', fontWeight: 700, lineHeight: 1.55 } }, '•'),
        React.createElement('span', { style: { flex: 1, lineHeight: 1.6 } }, renderInline(t.replace(/^[•\-*]\s/, '')))));
    } else if (/^\d+\.\s/.test(t)) {
      const n = t.match(/^(\d+)\./)[1];
      out.push(React.createElement('div', { key: key++, style: { display: 'flex', gap: 10, paddingLeft: 2 } },
        React.createElement('span', { className: 'mono', style: { color: 'var(--accent-700)', fontWeight: 700, lineHeight: 1.55, minWidth: 16 } }, n + '.'),
        React.createElement('span', { style: { flex: 1, lineHeight: 1.6 } }, renderInline(t.replace(/^\d+\.\s/, '')))));
    } else {
      out.push(React.createElement('p', { key: key++, style: { margin: 0, lineHeight: 1.65, color: 'var(--ink-2)', fontSize: 15.5 } }, renderInline(t)));
    }
    i++;
  }
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, out);
}
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => p.startsWith('**') && p.endsWith('**')
    ? React.createElement('strong', { key: i, style: { fontWeight: 700, color: 'var(--ink)' } }, p.slice(2, -2))
    : p);
}

// — Tarjeta de puntuación (Validador de Ideas) —
function ScoreCard({ data }) {
  return React.createElement('div', {
    style: { border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--surface)', boxShadow: 'var(--sh-sm)' },
  },
    React.createElement('div', { style: { padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 18, background: 'linear-gradient(180deg, var(--accent-tint), transparent)', borderBottom: '1px solid var(--line)' } },
      React.createElement(ProgressRing, { value: data.overall, size: 64, stroke: 6 },
        React.createElement('span', { className: 'mono', style: { fontSize: 18, fontWeight: 700, color: 'var(--accent-700)' } }, data.overall)),
      React.createElement('div', null,
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement('span', { style: { fontSize: 12.5, fontWeight: 700, color: 'var(--accent-700)', textTransform: 'uppercase', letterSpacing: '0.04em' } }, 'Veredicto'),
          React.createElement(Badge, { tone: 'accent', size: 'sm', icon: 'check' }, data.verdict),
        ),
        React.createElement('div', { style: { fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6 } }, data.title),
        React.createElement('div', { style: { fontSize: 13.5, color: 'var(--ink-3)', marginTop: 3 } }, data.subtitle),
      ),
    ),
    React.createElement('div', { style: { padding: '8px 22px 18px' } },
      data.metrics.map((m, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 14, padding: '11px 0', borderBottom: i < data.metrics.length - 1 ? '1px solid var(--line)' : 'none' } },
        React.createElement('div', { style: { width: 150, fontSize: 14, fontWeight: 600, color: 'var(--ink-2)' } }, m.label),
        React.createElement('div', { style: { flex: 1, height: 7, background: 'var(--surface-3)', borderRadius: 999, overflow: 'hidden' } },
          React.createElement('div', { style: { width: `${m.value}%`, height: '100%', borderRadius: 999, background: m.value >= 70 ? 'var(--accent)' : m.value >= 45 ? 'var(--gold-bright)' : 'var(--danger)', transition: 'width .8s var(--ease-out)' } })),
        React.createElement('span', { className: 'mono', style: { width: 38, textAlign: 'right', fontSize: 14, fontWeight: 600 } }, m.value),
      )),
    ),
  );
}

// — Lean Canvas en miniatura (9 bloques) —
function LeanCanvas({ data }) {
  const cell = (b, span) => React.createElement('div', {
    key: b.k,
    style: { gridColumn: span ? `span ${span}` : undefined, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 6 },
  },
    React.createElement('div', { style: { fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-4)' } }, b.k),
    React.createElement('div', { style: { fontSize: 12.5, lineHeight: 1.45, color: 'var(--ink-2)' } }, b.v),
  );
  return React.createElement('div', { style: { background: 'var(--surface-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', padding: 14 } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '0 2px' } },
      React.createElement(Icon, { name: 'grid', size: 16, style: { color: 'var(--accent-700)' } }),
      React.createElement('span', { style: { fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' } }, 'Lean Canvas'),
      React.createElement('span', { style: { marginLeft: 'auto', fontSize: 12, color: 'var(--ink-4)' } }, 'borrador autogenerado'),
    ),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 } },
      cell(data.blocks[0]), cell(data.blocks[1]), cell(data.blocks[2]), cell(data.blocks[3]),
      cell(data.blocks[4], 2), cell(data.blocks[5], 2),
      cell(data.blocks[6], 2), cell(data.blocks[7], 2),
    ),
  );
}

// — Tabla de datos —
function DataTable({ data }) {
  return React.createElement('div', { style: { border: '1px solid var(--line-2)', borderRadius: 'var(--r-md)', overflow: 'hidden' } },
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 13.5 } },
      React.createElement('thead', null,
        React.createElement('tr', { style: { background: 'var(--surface-2)' } },
          data.cols.map((c, i) => React.createElement('th', { key: i, style: { textAlign: i === 0 ? 'left' : 'right', padding: '11px 16px', fontWeight: 600, color: 'var(--ink-3)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '1px solid var(--line-2)' } }, c)))),
      React.createElement('tbody', null,
        data.rows.map((row, ri) => React.createElement('tr', { key: ri },
          row.map((cell, ci) => React.createElement('td', { key: ci, className: ci > 0 ? 'mono' : '', style: { textAlign: ci === 0 ? 'left' : 'right', padding: '11px 16px', borderBottom: ri < data.rows.length - 1 ? '1px solid var(--line)' : 'none', fontWeight: ci === 0 ? 600 : 500, color: ci === 0 ? 'var(--ink)' : 'var(--ink-2)' } },
            ci === 0 && row.highlight ? React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 7 } }, React.createElement('span', { style: { width: 7, height: 7, borderRadius: 999, background: 'var(--accent)' } }), cell) : cell)))))
    ),
  );
}

// — Bloque genérico dispatcher —
function Block({ block }) {
  if (block.type === 'text') return React.createElement(RichText, { value: block.value });
  if (block.type === 'score') return React.createElement(ScoreCard, { data: block.data });
  if (block.type === 'canvas') return React.createElement(LeanCanvas, { data: block.data });
  if (block.type === 'table') return React.createElement(DataTable, { data: block.data });
  return null;
}

// — Dos columnas de listas (fortalezas / riesgos) —
function DualList({ left, right }) {
  const col = (title, items, tone) => React.createElement('div', { style: { flex: 1, minWidth: 200 } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: tone === 'good' ? 'var(--accent-700)' : 'var(--danger)', marginBottom: 10 } },
      React.createElement(Icon, { name: tone === 'good' ? 'checkCircle' : 'shield', size: 15 }), title),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
      (items || []).map((it, i) => React.createElement('div', { key: i, style: { display: 'flex', gap: 9, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-2)' } },
        React.createElement('span', { style: { color: tone === 'good' ? 'var(--accent)' : 'var(--danger)', fontWeight: 700 } }, tone === 'good' ? '+' : '–'), it))));
  return React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 28, padding: '4px 2px' } },
    col(left.title, left.items, 'good'), col(right.title, right.items, 'bad'));
}

// — Checklist de siguientes pasos —
function Checklist({ title, items }) {
  return React.createElement('div', { style: { background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '16px 18px' } },
    title && React.createElement('div', { style: { fontSize: 13, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.01em' } }, title),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 11 } },
      (items || []).map((it, i) => React.createElement('label', { key: i, style: { display: 'flex', gap: 11, alignItems: 'flex-start', cursor: 'pointer', fontSize: 14.5, lineHeight: 1.5 } },
        React.createElement('span', { style: { width: 20, height: 20, borderRadius: 6, border: '1.8px solid var(--line-strong)', flexShrink: 0, marginTop: 1, display: 'grid', placeItems: 'center', color: 'transparent' }, className: 'chk' },
          React.createElement(Icon, { name: 'check', size: 13, stroke: 2.4 })),
        React.createElement('span', null, it)))),
    React.createElement('style', null, '.chk:has(+ *), label:hover .chk { border-color: var(--accent); } label .chk { transition: all .15s; }'),
  );
}

// — Tarjeta de anuncio —
function AdCard({ ad }) {
  const platforms = { Meta: '#1877F2', Google: '#34A853', TikTok: '#111', Instagram: '#E1306C', LinkedIn: '#0A66C2' };
  const c = platforms[ad.platform] || 'var(--ink)';
  return React.createElement('div', { style: { border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--surface)' } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' } },
      React.createElement('span', { style: { width: 9, height: 9, borderRadius: 999, background: c } }),
      React.createElement('span', { style: { fontSize: 12.5, fontWeight: 700 } }, ad.platform),
      ad.format && React.createElement('span', { style: { fontSize: 11.5, color: 'var(--ink-4)', marginLeft: 'auto' } }, ad.format)),
    React.createElement('div', { style: { padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 } },
      React.createElement('div', { style: { fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.35 } }, ad.headline),
      React.createElement('div', { style: { fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5 } }, ad.body || ad.primary),
      React.createElement('div', { style: { marginTop: 4 } }, React.createElement(Badge, { tone: 'accent', size: 'sm', icon: 'arrowRight' }, ad.cta))),
  );
}

Object.assign(window, { RichText, ScoreCard, LeanCanvas, DataTable, Block, DualList, Checklist, AdCard, MdTable });
