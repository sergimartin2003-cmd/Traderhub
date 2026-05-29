'use client'

import { Icon } from '@/components/icons'

interface ButtonProps {
  children?: React.ReactNode
  variant?: 'primary' | 'dark' | 'secondary' | 'ghost' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconRight?: string
  full?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  type?: 'button' | 'submit' | 'reset'
  title?: string
}

const SIZES = {
  sm: { padding: '7px 13px', fontSize: 13, gap: 6, height: 32, iconSize: 16 },
  md: { padding: '10px 18px', fontSize: 14.5, gap: 8, height: 40, iconSize: 18 },
  lg: { padding: '13px 24px', fontSize: 16, gap: 9, height: 50, iconSize: 20 },
}

const VARIANTS: Record<string, React.CSSProperties> = {
  primary: {
    background: 'var(--accent)',
    color: '#fff',
    boxShadow: 'var(--sh-accent)',
    border: '1px solid var(--accent-600)',
  },
  dark: {
    background: 'var(--ink)',
    color: '#fff',
    border: '1px solid var(--ink)',
  },
  secondary: {
    background: 'var(--surface)',
    color: 'var(--ink)',
    border: '1px solid var(--line-2)',
    boxShadow: 'var(--sh-xs)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--ink-2)',
    border: '1px solid transparent',
  },
  gold: {
    background: 'linear-gradient(180deg, #FBBF24, var(--gold-bright))',
    color: '#3a2a05',
    border: '1px solid #D9920A',
    boxShadow: '0 4px 14px rgba(245,158,11,0.30)',
  },
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  full,
  onClick,
  disabled,
  className = '',
  style = {},
  type = 'button',
  title,
}: ButtonProps) {
  const sz = SIZES[size]
  const variantStyle = VARIANTS[variant]

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(0.97)'
  }
  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1)'
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1)'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`focusable ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sz.gap,
        padding: sz.padding,
        fontSize: sz.fontSize,
        fontWeight: 600,
        height: sz.height,
        borderRadius: 'var(--r-md)',
        letterSpacing: '-0.01em',
        width: full ? '100%' : 'auto',
        transition:
          'transform .14s var(--ease), box-shadow .2s var(--ease), background .2s var(--ease), filter .2s',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        cursor: 'pointer',
        fontFamily: 'inherit',
        ...variantStyle,
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={sz.iconSize} />}
      {children && <span>{children}</span>}
      {iconRight && <Icon name={iconRight} size={sz.iconSize} />}
    </button>
  )
}

export default Button
