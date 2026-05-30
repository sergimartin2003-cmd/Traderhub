'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ToolCard } from '@/components/dashboard/tool-card'
import { TOOLS, FREE_DAILY_LIMIT } from '@/lib/constants'
import type { Conversation, Project } from '@/types'
import { useUser } from '@/hooks/use-user'

interface DashboardHomeProps {
  userId: string
  conversations: Conversation[]
  projects: Project[]
  dailyMessages: number
}

const SUGGESTIONS = [
  { icon: '🎯', text: 'Valida mi idea de negocio' },
  { icon: '📣', text: 'Plan de marketing para mi lanzamiento' },
  { icon: '💰', text: '¿Cómo pongo precio a mi SaaS?' },
  { icon: '🔍', text: 'Analiza a mis competidores' },
]

const TOOL_ACCENTS: Record<string, string> = {
  idea: '#10B981',
  canvas: '#3B82F6',
  marketing: '#8B5CF6',
  ads: '#F59E0B',
  competitor: '#EC4899',
  pricing: '#06B6D4',
}

export default function DashboardHome({
  userId,
  conversations,
  projects,
  dailyMessages,
}: DashboardHomeProps) {
  const router = useRouter()
  const { profile, isPro } = useUser()
  const [query, setQuery] = useState('')

  const userName = profile?.full_name?.split(' ')[0] ?? 'emprendedor'
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches'
  const pct = Math.min(100, Math.round((dailyMessages / FREE_DAILY_LIMIT) * 100))
  const remaining = Math.max(0, FREE_DAILY_LIMIT - dailyMessages)

  const handleStartChat = (text?: string) => {
    const q = text ?? query
    if (!q.trim()) return
    const params = new URLSearchParams({ q: q.trim() })
    router.push(`/chat?${params.toString()}`)
  }

  const handleOpenTool = (toolId: string, locked: boolean) => {
    if (locked) {
      router.push('/upgrade')
    } else {
      router.push(`/tools/${toolId}`)
    }
  }

  return (
    <div
      style={{
        maxWidth: 1080,
        margin: '0 auto',
        padding: '36px 40px 100px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 20,
          marginBottom: 28,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--accent-700)',
              marginBottom: 6,
            }}
          >
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: 'var(--ink)',
            }}
          >
            {greet}, {userName}.
          </h1>
          <p style={{ margin: '7px 0 0', fontSize: 15.5, color: 'var(--ink-3)' }}>
            ¿En qué negocio avanzamos hoy?
          </p>
        </div>
        {!isPro && (
          <div style={{ flexShrink: 0 }}>
            <Link
              href="/upgrade"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '9px 18px',
                borderRadius: 'var(--r-md)',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--ink)',
                background: 'linear-gradient(135deg, var(--gold-bright), var(--gold))',
                textDecoration: 'none',
              }}
            >
              ♛ Mejorar a Pro
            </Link>
          </div>
        )}
      </div>

      {/* Chat composer */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--line-2)',
            borderRadius: 'var(--r-xl)',
            boxShadow: 'var(--sh-md)',
            padding: '8px 8px 8px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.8}
            style={{ flexShrink: 0 }}
          >
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleStartChat()
            }}
            placeholder="Pregunta lo que sea o describe tu idea…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 16,
              background: 'transparent',
              color: 'var(--ink)',
              minWidth: 0,
              fontFamily: 'var(--font-display)',
            }}
          />
          <button
            onClick={() => handleStartChat()}
            disabled={!query.trim()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--r-lg)',
              background: query.trim() ? 'var(--accent)' : 'var(--ink-4)',
              color: '#fff',
              border: 'none',
              cursor: query.trim() ? 'pointer' : 'not-allowed',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              transition: 'background .15s',
            }}
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Suggestions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 14 }}>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleStartChat(s.text)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 'var(--r-full)',
                border: '1px solid var(--line-2)',
                background: 'var(--surface)',
                fontSize: 13.5,
                fontWeight: 500,
                color: 'var(--ink-2)',
                transition: 'all .16s',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--accent-700)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--line-2)'
                e.currentTarget.style.color = 'var(--ink-2)'
              }}
            >
              <span>{s.icon}</span>
              {s.text}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 38,
        }}
      >
        <StatCard
          icon="🔥"
          label="Racha de actividad"
          value="12 días"
          tone="gold"
        />
        <StatCard
          icon="🎯"
          label="Ideas validadas"
          value={String(projects.filter((p) => p.type === 'idea').length)}
        />
        <StatCard
          icon="📁"
          label="Proyectos guardados"
          value={String(projects.length)}
        />
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line-2)',
            borderRadius: 'var(--r-xl)',
            padding: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: 'var(--sh-xs)',
          }}
        >
          <ProgressRing
            value={isPro ? 100 : pct}
            isPro={isPro}
            pct={pct}
          />
          <div>
            {isPro ? (
              <>
                <div
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700 }}
                >
                  Ilimitado
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 3 }}>
                  Plan Pro activo
                </div>
              </>
            ) : (
              <>
                <div
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700 }}
                >
                  {remaining} / {FREE_DAILY_LIMIT}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 3 }}>
                  mensajes hoy
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tools grid */}
      <div style={{ marginBottom: 38 }}>
        <h2
          style={{
            margin: '0 0 16px',
            fontSize: 18.5,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--ink)',
          }}
        >
          Herramientas
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isPro={isPro}
              onClick={() => handleOpenTool(tool.id, tool.pro && !isPro)}
            />
          ))}
        </div>
      </div>

      {/* Recent projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: 38 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 18.5,
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--ink)',
              }}
            >
              Proyectos guardados
            </h2>
            <Link
              href="/projects"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 13.5,
                fontWeight: 600,
                color: 'var(--ink-3)',
                textDecoration: 'none',
              }}
            >
              Ver todos
              <svg
                width={15}
                height={15}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}
          >
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects?id=${p.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  minHeight: 120,
                  background: 'var(--surface)',
                  border: '1px solid var(--line-2)',
                  borderRadius: 'var(--r-xl)',
                  padding: '18px 20px',
                  textDecoration: 'none',
                  boxShadow: 'var(--sh-xs)',
                  transition: 'box-shadow .18s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--sh-md)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--sh-xs)'
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 'var(--r-sm)',
                    display: 'grid',
                    placeItems: 'center',
                    background: (TOOL_ACCENTS[p.type] ?? '#10B981') + '18',
                    color: TOOL_ACCENTS[p.type] ?? '#10B981',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width={19}
                    height={19}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 650,
                      fontSize: 14.5,
                      letterSpacing: '-0.01em',
                      color: 'var(--ink)',
                    }}
                  >
                    {p.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-4)', marginTop: 3 }}>
                    {TOOLS.find((t) => t.id === p.type)?.name ?? p.type}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent conversations */}
      {conversations.length > 0 && (
        <div>
          <h2
            style={{
              margin: '0 0 16px',
              fontSize: 18.5,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--ink)',
            }}
          >
            Conversaciones recientes
          </h2>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--sh-xs)',
            }}
          >
            {conversations.slice(0, 4).map((r, i) => (
              <Link
                key={r.id}
                href={`/chat/${r.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '13px 18px',
                  borderBottom:
                    i < Math.min(conversations.length, 4) - 1
                      ? '1px solid var(--line)'
                      : 'none',
                  textDecoration: 'none',
                  transition: 'background .14s',
                  color: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--r-sm)',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'var(--surface-3)',
                    color: 'var(--ink-3)',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14.5,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: 'var(--ink)',
                    }}
                  >
                    {r.title}
                  </div>
                  {r.context && (
                    <div style={{ fontSize: 12.5, color: 'var(--ink-4)', marginTop: 2 }}>
                      {r.context}
                    </div>
                  )}
                </div>
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--ink-4)"
                  strokeWidth={2}
                >
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: string
  label: string
  value: string
  tone?: 'gold' | 'accent'
}) {
  const bg = tone === 'gold' ? 'var(--gold-tint)' : 'var(--accent-tint)'

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        borderRadius: 'var(--r-xl)',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: 'var(--sh-xs)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 'var(--r-sm)',
            display: 'grid',
            placeItems: 'center',
            background: bg,
            fontSize: 18,
          }}
        >
          {icon}
        </div>
        {tone === 'gold' && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--gold)',
              background: 'var(--gold-tint)',
              padding: '2px 8px',
              borderRadius: 'var(--r-full)',
              border: '1px solid var(--gold-tint-2)',
            }}
          >
            +1 hoy
          </span>
        )}
      </div>
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: 'var(--ink)',
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 5 }}>{label}</div>
      </div>
    </div>
  )
}

function ProgressRing({
  value,
  isPro,
  pct,
}: {
  value: number
  isPro: boolean
  pct: number
}) {
  const size = 56
  const stroke = 5
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * (value / 100)
  const color = isPro
    ? 'var(--gold-bright)'
    : pct > 85
    ? 'var(--danger)'
    : 'var(--accent)'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--surface-3)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={700}
        fill={isPro ? 'var(--gold)' : 'var(--accent-700)'}
        fontFamily="var(--font-mono)"
      >
        {isPro ? '∞' : `${Math.round(value)}%`}
      </text>
    </svg>
  )
}
