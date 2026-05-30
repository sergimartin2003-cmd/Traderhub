'use client'

import Link from 'next/link'
import { Icon } from '@/components/icons'

interface MobileNavProps {
  currentPath: string
  onNewChat?: () => void
}

interface MobileHeaderProps {
  title?: string
  brandName?: string
  showBack?: boolean
  onBack?: () => void
  onNewChat?: () => void
  currentPath?: string
}

const NAV_ITEMS = [
  { view: 'dashboard', icon: 'home', label: 'Inicio', href: '/dashboard' },
  { view: 'chat', icon: 'chat', label: 'Chat', href: '/chat' },
  { view: 'projects', icon: 'folder', label: 'Proyectos', href: '/projects' },
  { view: 'settings', icon: 'user', label: 'Perfil', href: '/settings' },
]

export function MobileBar({ currentPath, onNewChat }: MobileNavProps) {
  return (
    <nav
      className="mobile-bar"
      style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--line)',
        padding: '8px 8px calc(8px + env(safe-area-inset-bottom))',
        justifyContent: 'space-around',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = currentPath === item.href || currentPath.startsWith(item.href + '/')

        if (item.href === '/chat' && onNewChat) {
          return (
            <button
              key={item.view}
              onClick={onNewChat}
              className="focusable"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                padding: '4px 14px',
                color: active ? 'var(--accent-700)' : 'var(--ink-4)',
                flex: 1,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <Icon name={item.icon} size={22} stroke={active ? 2 : 1.6} />
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>
                {item.label}
              </span>
            </button>
          )
        }

        return (
          <Link
            key={item.view}
            href={item.href}
            className="focusable"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '4px 14px',
              color: active ? 'var(--accent-700)' : 'var(--ink-4)',
              flex: 1,
              textDecoration: 'none',
            }}
          >
            <Icon name={item.icon} size={22} stroke={active ? 2 : 1.6} />
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

export function MobileHeader({
  title,
  brandName = 'Norte',
  showBack,
  onBack,
  onNewChat,
  currentPath = '/dashboard',
}: MobileHeaderProps) {
  const isDashboard = currentPath === '/dashboard'

  return (
    <header
      className="mobile-header"
      style={{
        display: 'none',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderBottom: '1px solid var(--line)',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {isDashboard && !showBack ? (
        <Link
          href="/dashboard"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}
        >
          {/* Inline logo for mobile header */}
          <svg width={24} height={24} viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx={16} cy={16} r={14.5} stroke="var(--accent)" strokeWidth={1.5} opacity={0.28} />
            <path d="M16 3.5 19.2 16 16 28.5 12.8 16z" fill="var(--accent)" />
            <path d="M16 3.5 16 16 12.8 16z" fill="#fff" opacity={0.35} />
            <path d="M5 16 16 14.2 27 16 16 17.8z" fill="var(--accent)" opacity={0.32} />
          </svg>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 24 * 0.78,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
            }}
          >
            {brandName}
          </span>
        </Link>
      ) : (
        <>
          {(showBack || onBack) && (
            <button
              onClick={onBack}
              className="focusable"
              title="Atrás"
              aria-label="Atrás"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 'var(--r-sm)',
                color: 'var(--ink-3)',
                background: 'transparent',
                flexShrink: 0,
                fontFamily: 'inherit',
              }}
            >
              <Icon name="arrowLeft" size={20} />
            </button>
          )}
          {title && (
            <span
              style={{
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </span>
          )}
        </>
      )}

      <div style={{ flex: 1 }} />

      {onNewChat && (
        <button
          onClick={onNewChat}
          className="focusable"
          title="Nueva conversación"
          aria-label="Nueva conversación"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 'var(--r-sm)',
            color: 'var(--ink-3)',
            background: 'transparent',
            transition: 'background .15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--surface-3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <Icon name="plus" size={20} />
        </button>
      )}
    </header>
  )
}

export default MobileBar
