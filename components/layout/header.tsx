import Link from 'next/link'
import { Icon } from '@/components/icons'

interface HeaderProps {
  title?: string
  brandName?: string
  showBack?: boolean
  backHref?: string
  onNewChat?: () => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Header({
  title,
  brandName = 'Norte',
  showBack,
  backHref = '/dashboard',
  onNewChat,
  children,
  className = '',
  style = {},
}: HeaderProps) {
  return (
    <header
      className={`mobile-header ${className}`}
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
        ...style,
      }}
    >
      {showBack && (
        <Link
          href={backHref}
          className="focusable"
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
            textDecoration: 'none',
          }}
        >
          <Icon name="arrowLeft" size={20} />
        </Link>
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

      {children}

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
            cursor: 'pointer',
            border: 'none',
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

export default Header
