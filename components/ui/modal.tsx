'use client'

import { useEffect, useRef } from 'react'
import { Icon } from '@/components/icons'

interface ModalProps {
  open: boolean
  onClose: () => void
  children?: React.ReactNode
  title?: string
  className?: string
}

export function Modal({ open, onClose, children, title, className = '' }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Prevent body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(19,19,22,0.42)',
        backdropFilter: 'blur(6px)',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        animation: 'fadeIn .2s',
      }}
    >
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className={className}
        style={{
          width: 'min(560px, 100%)',
          background: 'var(--surface)',
          borderRadius: 'var(--r-2xl)',
          boxShadow: 'var(--sh-xl)',
          overflow: 'hidden',
          animation: 'pop .25s var(--ease-out)',
          position: 'relative',
        }}
      >
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px 0',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '-0.025em',
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="focusable"
              title="Cerrar"
              aria-label="Cerrar"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 'var(--r-sm)',
                color: 'var(--ink-3)',
                background: 'transparent',
                transition: 'background .15s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        )}

        {!title && (
          <button
            onClick={onClose}
            className="focusable"
            title="Cerrar"
            aria-label="Cerrar"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 'var(--r-sm)',
              color: 'var(--ink-3)',
              background: 'transparent',
              transition: 'background .15s',
              zIndex: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <Icon name="close" size={18} />
          </button>
        )}

        <div style={{ padding: title ? '16px 24px 24px' : 24 }}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
