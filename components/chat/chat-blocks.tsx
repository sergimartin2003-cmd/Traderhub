'use client'

import { useState } from 'react'

// ─── Inline markdown renderer ─────────────────────────────────────────────────

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={i} style={{ fontWeight: 700, color: 'var(--ink)' }}>
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    )
  )
}

// ─── Markdown table ───────────────────────────────────────────────────────────

function isTableRow(l: string): boolean {
  return /^\s*\|.*\|\s*$/.test(l)
}
function isSep(l: string): boolean {
  return /^\s*\|?[\s:|-]+\|?\s*$/.test(l) && l.includes('-')
}

function MdTable({ rows }: { rows: string[] }) {
  const cells = rows.map((r) =>
    r
      .replace(/^\s*\|/, '')
      .replace(/\|\s*$/, '')
      .split('|')
      .map((c) => c.trim())
  )
  const head = cells[0]
  const body = cells.slice(1)

  return (
    <div
      style={{
        border: '1px solid var(--line-2)',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
        margin: '2px 0',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)' }}>
            {head.map((c, i) => (
              <th
                key={i}
                style={{
                  textAlign: i === 0 ? 'left' : 'right',
                  padding: '10px 14px',
                  fontWeight: 600,
                  color: 'var(--ink-3)',
                  fontSize: 11.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  borderBottom: '1px solid var(--line-2)',
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri}>
              {row.map((c, ci) => (
                <td
                  key={ci}
                  style={{
                    textAlign: ci === 0 ? 'left' : 'right',
                    padding: '10px 14px',
                    borderBottom: ri < body.length - 1 ? '1px solid var(--line)' : 'none',
                    fontWeight: ci === 0 ? 600 : 500,
                    color: ci === 0 ? 'var(--ink)' : 'var(--ink-2)',
                    fontVariantNumeric: ci > 0 ? 'tabular-nums' : undefined,
                  }}
                >
                  {renderInline(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── RichText ─────────────────────────────────────────────────────────────────

export function RichText({ value }: { value: string }) {
  const lines = (value || '').split('\n')
  const out: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') {
      i++
      continue
    }
    if (isTableRow(line)) {
      const group: string[] = []
      while (i < lines.length && isTableRow(lines[i])) {
        if (!isSep(lines[i])) group.push(lines[i])
        i++
      }
      if (group.length) out.push(<MdTable key={key++} rows={group} />)
      continue
    }
    const t = line.trim()
    if (t.startsWith('# ')) {
      out.push(
        <div
          key={key++}
          style={{
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            marginTop: out.length ? 6 : 0,
          }}
        >
          {renderInline(t.replace(/^#\s/, ''))}
        </div>
      )
    } else if (t.startsWith('## ') || t.startsWith('### ')) {
      out.push(
        <div
          key={key++}
          style={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginTop: out.length ? 4 : 0,
          }}
        >
          {renderInline(t.replace(/^#+\s/, ''))}
        </div>
      )
    } else if (t.startsWith('• ') || t.startsWith('- ') || t.startsWith('* ')) {
      out.push(
        <div key={key++} style={{ display: 'flex', gap: 10, paddingLeft: 2 }}>
          <span style={{ color: 'var(--accent)', fontWeight: 700, lineHeight: 1.55 }}>•</span>
          <span style={{ flex: 1, lineHeight: 1.6 }}>
            {renderInline(t.replace(/^[•\-*]\s/, ''))}
          </span>
        </div>
      )
    } else if (/^\d+\.\s/.test(t)) {
      const n = t.match(/^(\d+)\./)![1]
      out.push(
        <div key={key++} style={{ display: 'flex', gap: 10, paddingLeft: 2 }}>
          <span
            style={{
              color: 'var(--accent-700, #059669)',
              fontWeight: 700,
              lineHeight: 1.55,
              minWidth: 16,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {n}.
          </span>
          <span style={{ flex: 1, lineHeight: 1.6 }}>
            {renderInline(t.replace(/^\d+\.\s/, ''))}
          </span>
        </div>
      )
    } else {
      out.push(
        <p
          key={key++}
          style={{
            margin: 0,
            lineHeight: 1.65,
            color: 'var(--ink-2)',
            fontSize: 15.5,
          }}
        >
          {renderInline(t)}
        </p>
      )
    }
    i++
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{out}</div>
  )
}

// ─── ProgressRing (inline, no external dep) ──────────────────────────────────

function ProgressRing({
  value,
  size = 64,
  stroke = 6,
  color = 'var(--accent)',
  children,
}: {
  value: number
  size?: number
  stroke?: number
  color?: string
  children?: React.ReactNode
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-2, #F7F7F6)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .8s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ─── ScoreCard ────────────────────────────────────────────────────────────────

interface ScoreData {
  overall: number
  verdict: string
  title: string
  subtitle?: string
  metrics: { label: string; value: number }[]
}

export function ScoreCard({ data }: { data: ScoreData }) {
  return (
    <div
      style={{
        border: '1px solid var(--line-2)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        background: 'var(--surface)',
        boxShadow: 'var(--sh-sm)',
      }}
    >
      <div
        style={{
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          background: 'linear-gradient(180deg, var(--accent-tint, #ECFDF5), transparent)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <ProgressRing value={data.overall} size={64} stroke={6}>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--accent-700, #059669)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {data.overall}
          </span>
        </ProgressRing>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: 'var(--accent-700, #059669)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Veredicto
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '2px 8px',
                fontSize: 11.5,
                fontWeight: 600,
                borderRadius: 'var(--r-full)',
                background: 'var(--accent-tint, #ECFDF5)',
                color: 'var(--accent-700, #059669)',
                border: '1px solid var(--accent-tint-2, #D1FAE5)',
              }}
            >
              {data.verdict}
            </span>
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginTop: 6,
            }}
          >
            {data.title}
          </div>
          {data.subtitle && (
            <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 3 }}>
              {data.subtitle}
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '8px 22px 18px' }}>
        {data.metrics.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '11px 0',
              borderBottom:
                i < data.metrics.length - 1 ? '1px solid var(--line)' : 'none',
            }}
          >
            <div
              style={{
                width: 150,
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--ink-2)',
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                flex: 1,
                height: 7,
                background: 'var(--surface-3, #EFEFEE)',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${m.value}%`,
                  height: '100%',
                  borderRadius: 999,
                  background:
                    m.value >= 70
                      ? 'var(--accent)'
                      : m.value >= 45
                        ? 'var(--gold-bright)'
                        : '#EF4444',
                  transition: 'width .8s ease',
                }}
              />
            </div>
            <span
              style={{
                width: 38,
                textAlign: 'right',
                fontSize: 14,
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── LeanCanvas ───────────────────────────────────────────────────────────────

interface CanvasBlock {
  k: string
  v: string
}

export function LeanCanvas({ data }: { data: { blocks: CanvasBlock[] } }) {
  const cell = (b: CanvasBlock, span?: number) => (
    <div
      key={b.k}
      style={{
        gridColumn: span ? `span ${span}` : undefined,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-sm)',
        padding: '11px 13px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--ink-4, #9CA3AF)',
        }}
      >
        {b.k}
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--ink-2)' }}>{b.v}</div>
    </div>
  )

  return (
    <div
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--line-2)',
        borderRadius: 'var(--r-lg)',
        padding: 14,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
          padding: '0 2px',
        }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--accent-700, #059669)" strokeWidth={2}>
          <rect x={3} y={3} width={7} height={7} rx={1} />
          <rect x={14} y={3} width={7} height={7} rx={1} />
          <rect x={3} y={14} width={7} height={7} rx={1} />
          <rect x={14} y={14} width={7} height={7} rx={1} />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>
          Lean Canvas
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--ink-4, #9CA3AF)' }}>
          borrador autogenerado
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}
      >
        {data.blocks[0] && cell(data.blocks[0])}
        {data.blocks[1] && cell(data.blocks[1])}
        {data.blocks[2] && cell(data.blocks[2])}
        {data.blocks[3] && cell(data.blocks[3])}
        {data.blocks[4] && cell(data.blocks[4], 2)}
        {data.blocks[5] && cell(data.blocks[5], 2)}
        {data.blocks[6] && cell(data.blocks[6], 2)}
        {data.blocks[7] && cell(data.blocks[7], 2)}
      </div>
    </div>
  )
}

// ─── DataTable ────────────────────────────────────────────────────────────────

interface TableRow extends Array<string> {
  highlight?: boolean
}

export function DataTable({ data }: { data: { cols: string[]; rows: TableRow[] } }) {
  return (
    <div
      style={{
        border: '1px solid var(--line-2)',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)' }}>
            {data.cols.map((c, i) => (
              <th
                key={i}
                style={{
                  textAlign: i === 0 ? 'left' : 'right',
                  padding: '11px 16px',
                  fontWeight: 600,
                  color: 'var(--ink-3)',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  borderBottom: '1px solid var(--line-2)',
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    textAlign: ci === 0 ? 'left' : 'right',
                    padding: '11px 16px',
                    borderBottom:
                      ri < data.rows.length - 1 ? '1px solid var(--line)' : 'none',
                    fontWeight: ci === 0 ? 600 : 500,
                    color: ci === 0 ? 'var(--ink)' : 'var(--ink-2)',
                    fontVariantNumeric: ci > 0 ? 'tabular-nums' : undefined,
                  }}
                >
                  {ci === 0 && row.highlight ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 999,
                          background: 'var(--accent)',
                          flexShrink: 0,
                        }}
                      />
                      {cell}
                    </span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── DualList ─────────────────────────────────────────────────────────────────

interface DualColumn {
  title: string
  items: string[]
}

export function DualList({ left, right }: { left: DualColumn; right: DualColumn }) {
  const col = (title: string, items: string[], tone: 'good' | 'bad') => (
    <div style={{ flex: 1, minWidth: 200 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontSize: 12.5,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: tone === 'good' ? 'var(--accent-700, #059669)' : '#EF4444',
          marginBottom: 10,
        }}
      >
        {tone === 'good' ? (
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3}>
            <circle cx={12} cy={12} r={10} />
            <path d="M8 12l3 3 5-5" />
          </svg>
        ) : (
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        )}
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(items || []).map((it, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 9,
              fontSize: 14,
              lineHeight: 1.5,
              color: 'var(--ink-2)',
            }}
          >
            <span
              style={{
                color: tone === 'good' ? 'var(--accent)' : '#EF4444',
                fontWeight: 700,
              }}
            >
              {tone === 'good' ? '+' : '–'}
            </span>
            {it}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, padding: '4px 2px' }}>
      {col(left.title, left.items, 'good')}
      {col(right.title, right.items, 'bad')}
    </div>
  )
}

// ─── Checklist ────────────────────────────────────────────────────────────────

export function Checklist({ title, items }: { title?: string; items: string[] }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  const toggle = (i: number) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }))

  return (
    <div
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-lg)',
        padding: '16px 18px',
      }}
    >
      {title && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            marginBottom: 12,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {(items || []).map((it, i) => (
          <label
            key={i}
            onClick={() => toggle(i)}
            style={{
              display: 'flex',
              gap: 11,
              alignItems: 'flex-start',
              cursor: 'pointer',
              fontSize: 14.5,
              lineHeight: 1.5,
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                border: `1.8px solid ${checked[i] ? 'var(--accent)' : 'var(--line-strong, #D1D5DB)'}`,
                flexShrink: 0,
                marginTop: 1,
                display: 'grid',
                placeItems: 'center',
                background: checked[i] ? 'var(--accent)' : 'transparent',
                transition: 'all .15s',
              }}
            >
              {checked[i] && (
                <svg
                  width={13}
                  height={13}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth={2.4}
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </span>
            <span style={{ textDecoration: checked[i] ? 'line-through' : 'none', color: checked[i] ? 'var(--ink-3)' : 'inherit' }}>
              {it}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

// ─── AdCard ───────────────────────────────────────────────────────────────────

const PLATFORM_COLORS: Record<string, string> = {
  Meta: '#1877F2',
  Google: '#34A853',
  TikTok: '#111',
  Instagram: '#E1306C',
  LinkedIn: '#0A66C2',
}

interface Ad {
  platform: string
  format?: string
  headline: string
  body?: string
  primary?: string
  cta: string
}

export function AdCard({ ad }: { ad: Ad }) {
  const c = PLATFORM_COLORS[ad.platform] || 'var(--ink)'
  return (
    <div
      style={{
        border: '1px solid var(--line-2)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        background: 'var(--surface)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          borderBottom: '1px solid var(--line)',
          background: 'var(--surface-2)',
        }}
      >
        <span
          style={{ width: 9, height: 9, borderRadius: 999, background: c, flexShrink: 0 }}
        />
        <span style={{ fontSize: 12.5, fontWeight: 700 }}>{ad.platform}</span>
        {ad.format && (
          <span style={{ fontSize: 11.5, color: 'var(--ink-4, #9CA3AF)', marginLeft: 'auto' }}>
            {ad.format}
          </span>
        )}
      </div>
      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.35,
          }}
        >
          {ad.headline}
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>
          {ad.body || ad.primary}
        </div>
        <div style={{ marginTop: 4 }}>
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
            {ad.cta}
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Block dispatcher ─────────────────────────────────────────────────────────

export type BlockType =
  | 'rich_text'
  | 'score_card'
  | 'lean_canvas'
  | 'data_table'
  | 'dual_list'
  | 'checklist'
  | 'ad_card'
  // legacy aliases
  | 'text'
  | 'score'
  | 'canvas'
  | 'table'

export interface BlockData {
  type: BlockType
  data?: unknown
  value?: string
}

export function Block({ block }: { block: BlockData }) {
  const type = block.type
  if (type === 'rich_text' || type === 'text') {
    return <RichText value={(block.value as string) || (block.data as string) || ''} />
  }
  if (type === 'score_card' || type === 'score') {
    return <ScoreCard data={block.data as ScoreData} />
  }
  if (type === 'lean_canvas' || type === 'canvas') {
    return <LeanCanvas data={block.data as { blocks: CanvasBlock[] }} />
  }
  if (type === 'data_table' || type === 'table') {
    return <DataTable data={block.data as { cols: string[]; rows: TableRow[] }} />
  }
  if (type === 'dual_list') {
    const d = block.data as { left: DualColumn; right: DualColumn }
    return <DualList left={d.left} right={d.right} />
  }
  if (type === 'checklist') {
    const d = block.data as { title?: string; items: string[] }
    return <Checklist title={d.title} items={d.items} />
  }
  if (type === 'ad_card') {
    return <AdCard ad={block.data as Ad} />
  }
  return null
}
