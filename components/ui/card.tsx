'use client'

import { useState } from 'react'

interface CardProps {
  children?: React.ReactNode
  hover?: boolean
  pad?: number | string
  className?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export function Card({ children, hover, pad, onClick, className = '', style = {} }: CardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      className={className}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? 'var(--line-strong)' : 'var(--line)'}`,
        borderRadius: 'var(--r-lg)',
        padding: pad !== undefined ? pad : 'var(--pad-card)',
        boxShadow: hovered ? 'var(--sh-md)' : 'var(--sh-xs)',
        transition:
          'box-shadow .25s var(--ease), transform .25s var(--ease), border-color .2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export default Card
