'use client'

import { useRef, useState, useCallback } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  remaining?: number
  isPro?: boolean
  onUpgrade?: () => void
  brandName?: string
}

export function ChatInput({
  onSend,
  disabled = false,
  remaining = 0,
  isPro = false,
  onUpgrade,
  brandName = 'Norte',
}: ChatInputProps) {
  const [draft, setDraft] = useState('')
  const taRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const grow = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value)
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }, [])

  const send = useCallback(() => {
    const clean = draft.trim()
    if (!clean || disabled) return
    onSend(clean)
    setDraft('')
    if (taRef.current) {
      taRef.current.style.height = 'auto'
    }
  }, [draft, disabled, onSend])

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const onFocus = () => {
    if (containerRef.current) {
      containerRef.current.style.borderColor = 'var(--accent)'
    }
  }
  const onBlur = () => {
    if (containerRef.current) {
      containerRef.current.style.borderColor = 'var(--line-2)'
    }
  }

  const lowMessages = !isPro && remaining <= 2

  return (
    <div style={{ padding: '0 24px 18px', background: 'linear-gradient(transparent, var(--canvas, #FBFBFA) 22%)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Remaining counter */}
        {!isPro && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              marginBottom: 10,
              fontSize: 12.5,
              color: lowMessages ? '#EF4444' : 'var(--ink-4, #9CA3AF)',
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            {remaining} mensajes gratis restantes
            {onUpgrade && (
              <button
                onClick={onUpgrade}
                style={{
                  fontWeight: 700,
                  color: 'var(--gold, #B7791F)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 12.5,
                }}
              >
                · Hazte Pro
              </button>
            )}
          </div>
        )}

        {/* Input box */}
        <div
          ref={containerRef}
          style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--line-2)',
            borderRadius: 'var(--r-xl)',
            boxShadow: 'var(--sh-md)',
            padding: 10,
            transition: 'border-color .2s',
          }}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <textarea
            ref={taRef}
            value={draft}
            onChange={grow}
            onKeyDown={onKeyDown}
            rows={1}
            disabled={disabled}
            placeholder="Escribe tu mensaje…  (Enter para enviar)"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: 15.5,
              lineHeight: 1.5,
              background: 'transparent',
              color: 'var(--ink)',
              padding: '6px 8px',
              maxHeight: 200,
              letterSpacing: '-0.01em',
              fontFamily: 'inherit',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 4,
            }}
          >
            {/* Attachment button */}
            <button
              title="Adjuntar archivo"
              style={{
                display: 'grid',
                placeItems: 'center',
                width: 34,
                height: 34,
                borderRadius: 'var(--r-sm)',
                border: 'none',
                background: 'transparent',
                color: 'var(--ink-3)',
                cursor: 'pointer',
                transition: 'color .15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-3)')}
            >
              <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>

            <div style={{ flex: 1 }} />

            {/* Plan badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '2px 8px',
                fontSize: 11.5,
                fontWeight: 600,
                borderRadius: 'var(--r-full)',
                background: 'var(--surface-2)',
                color: isPro ? 'var(--gold, #B7791F)' : 'var(--ink-3)',
                border: '1px solid transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {isPro ? (
                <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 20h20l-2-8-5 4-3-8-3 8-5-4-2 8z" />
                </svg>
              ) : (
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              )}
              {isPro ? `${brandName} Pro` : `${brandName} Base`}
            </span>

            {/* Send button */}
            <button
              onClick={send}
              disabled={disabled || !draft.trim()}
              title="Enviar (Enter)"
              style={{
                width: 40,
                height: 40,
                padding: 0,
                borderRadius: 'var(--r-lg)',
                border: '1px solid var(--accent-600, #059669)',
                background: disabled || !draft.trim() ? 'var(--surface-2)' : 'var(--accent)',
                color: disabled || !draft.trim() ? 'var(--ink-3)' : '#fff',
                display: 'grid',
                placeItems: 'center',
                cursor: disabled || !draft.trim() ? 'not-allowed' : 'pointer',
                transition: 'background .15s, color .15s, transform .14s',
                boxShadow: disabled || !draft.trim() ? 'none' : 'var(--sh-accent)',
                flexShrink: 0,
              }}
              onMouseDown={(e) => {
                if (!disabled && draft.trim()) e.currentTarget.style.transform = 'scale(0.94)'
              }}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            textAlign: 'center',
            fontSize: 11.5,
            color: 'var(--ink-4, #9CA3AF)',
            marginTop: 10,
          }}
        >
          {brandName} puede equivocarse. Verifica los datos importantes.
        </div>
      </div>
    </div>
  )
}
