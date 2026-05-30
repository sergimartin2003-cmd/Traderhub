'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/icons'

interface Conversation {
  id: string
  title: string
  context?: string
}

interface Profile {
  id?: string
  full_name?: string | null
  avatar_url?: string | null
  email?: string | null
}

interface SidebarProps {
  currentPath: string
  conversations?: Conversation[]
  isPro?: boolean
  user?: Profile | null
  brandName?: string
  onNewChat?: () => void
  onUpgrade?: () => void
}

interface NavItemProps {
  icon: string
  label: string
  active: boolean
  href?: string
  onClick?: () => void
}

function NavItem({ icon, label, active, href, onClick }: NavItemProps) {
  const [hovered, setHovered] = useState(false)

  const content = (
    <>
      <Icon name={icon} size={19} stroke={active ? 1.9 : 1.6} />
      <span style={{ flex: 1 }}>{label}</span>
    </>
  )

  const baseStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 11,
    padding: '9px 11px',
    borderRadius: 'var(--r-md)',
    fontSize: 14.5,
    fontWeight: active ? 650 : 500,
    textAlign: 'left',
    color: active ? 'var(--accent-700)' : 'var(--ink-2)',
    background: active ? 'var(--accent-tint)' : hovered ? 'var(--surface-3)' : 'transparent',
    transition: 'background .14s, color .14s',
    textDecoration: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    border: 'none',
  }

  if (href) {
    return (
      <Link
        href={href}
        className="focusable"
        style={baseStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      className="focusable"
      style={baseStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {content}
    </button>
  )
}

export function Sidebar({
  currentPath,
  conversations = [],
  isPro = false,
  user,
  brandName = 'Norte',
  onNewChat,
  onUpgrade,
}: SidebarProps) {
  const recentConvs = conversations.slice(0, 8)
  const userName = user?.full_name || 'Tú'

  const navItems = [
    { icon: 'home', label: 'Inicio', href: '/dashboard' },
    { icon: 'chat', label: 'Chat', href: '/chat' },
    { icon: 'tools', label: 'Herramientas', href: '/tools' },
    { icon: 'folder', label: 'Proyectos', href: '/projects' },
  ]

  return (
    <aside
      className="sidebar"
      style={{
        width: 264,
        flexShrink: 0,
        height: '100%',
        borderRight: '1px solid var(--line)',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        padding: '18px 14px',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '4px 8px 18px' }}>
        <Logo size={26} label={brandName} />
      </div>

      {/* New chat button */}
      <Button
        variant="primary"
        icon="plus"
        full
        onClick={onNewChat}
        style={{ marginBottom: 16, justifyContent: 'flex-start', paddingLeft: 14 }}
      >
        Nueva conversación
      </Button>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={currentPath === item.href || currentPath.startsWith(item.href + '/')}
          />
        ))}
      </nav>

      {/* Recientes label */}
      <div
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--ink-4)',
          padding: '20px 11px 8px',
        }}
      >
        Recientes
      </div>

      {/* Conversations list */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowY: 'auto',
          flex: 1,
        }}
      >
        {recentConvs.length === 0 ? (
          <div style={{ padding: '4px 11px', fontSize: 13, color: 'var(--ink-4)' }}>
            Aún no hay conversaciones
          </div>
        ) : (
          recentConvs.map((conv) => (
            <ConvItem
              key={conv.id}
              conv={conv}
              active={currentPath === `/chat/${conv.id}`}
            />
          ))
        )}
      </div>

      {/* Pro upsell or badge */}
      {isPro ? (
        <div
          style={{
            marginTop: 12,
            padding: 14,
            borderRadius: 'var(--r-lg)',
            border: '1px solid var(--gold-tint-2)',
            background: 'var(--gold-tint)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="crown" size={18} style={{ color: 'var(--gold)' }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Plan Pro activo</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 5 }}>
            Todo ilimitado.
          </div>
        </div>
      ) : (
        <button
          className="focusable"
          onClick={onUpgrade}
          style={{
            marginTop: 12,
            padding: 14,
            borderRadius: 'var(--r-lg)',
            border: '1px solid var(--gold-tint-2)',
            background: 'linear-gradient(160deg, var(--gold-tint), #fff)',
            textAlign: 'left',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ display: 'flex', marginBottom: 6 }}>
            <Badge tone="gold" icon="crown" size="sm">
              Pro
            </Badge>
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em' }}>
            Desbloquea todo
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', margin: '4px 0 11px' }}>
            Mensajes y herramientas ilimitadas.
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--gold)',
            }}
          >
            Ver Pro
            <Icon name="arrowRight" size={15} />
          </div>
        </button>
      )}

      {/* User info at bottom */}
      <Link
        href="/settings"
        className="focusable"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 8px 2px',
          marginTop: 8,
          borderTop: '1px solid var(--line)',
          textAlign: 'left',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <Avatar name={userName} size={34} src={user?.avatar_url ?? undefined} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 650 }}>{userName}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>
            {isPro ? 'Pro' : 'Plan gratuito'}
          </div>
        </div>
        <Icon name="settings" size={18} style={{ color: 'var(--ink-3)' }} />
      </Link>
    </aside>
  )
}

function ConvItem({ conv, active }: { conv: Conversation; active: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/chat/${conv.id}`}
      className="focusable"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '8px 11px',
        borderRadius: 'var(--r-sm)',
        fontSize: 13.5,
        color: active ? 'var(--ink)' : 'var(--ink-3)',
        background: active ? 'var(--surface-3)' : hovered ? 'var(--surface-3)' : 'transparent',
        textAlign: 'left',
        textDecoration: 'none',
        transition: 'background .14s',
      }}
    >
      <span
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {conv.title}
      </span>
    </Link>
  )
}

export default Sidebar
