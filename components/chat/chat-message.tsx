'use client'

import { useState } from 'react'
import { RichText, Block, type BlockData } from './chat-blocks'

// ─── Norte mark (avatar) ──────────────────────────────────────────────────────

function NorteMark({ size = 30 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        background: 'var(--surface)',
        border: '1px solid var(--line-2)',
        boxShadow: 'var(--sh-xs)',
      }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 32 32" fill="none">
        <path d="M16 3.5 19.2 16 16 28.5 12.8 16z" fill="var(--accent)" />
        <path d="M5 16 16 14.2 27 16 16 17.8z" fill="var(--accent)" opacity={0.4} />
      </svg>
    </div>
  )
}

// ─── TypingDots ───────────────────────────────────────────────────────────────

export function TypingDots() {
  return (
    <>
      <div style={{ display: 'flex', gap: 5, padding: '8px 2px' }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: 'var(--ink-4, #9CA3AF)',
              animation: `norte-blink 1.2s ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes norte-blink {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  )
}

// ─── UserMessage ──────────────────────────────────────────────────────────────

interface UserMessageProps {
  content: string
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginBottom: 26,
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          background: 'var(--ink)',
          color: '#fff',
          padding: '12px 17px',
          borderRadius: '18px 18px 5px 18px',
          fontSize: 15.5,
          lineHeight: 1.55,
          letterSpacing: '-0.01em',
          boxShadow: 'var(--sh-sm)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {content}
      </div>
    </div>
  )
}

// ─── Message action buttons ───────────────────────────────────────────────────

function IconBtn({
  title,
  onClick,
  children,
}: {
  title: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'grid',
        placeItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 'var(--r-sm)',
        border: '1px solid transparent',
        background: 'transparent',
        color: 'var(--ink-3)',
        cursor: 'pointer',
        transition: 'background .14s, color .14s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--surface-2)'
        e.currentTarget.style.color = 'var(--ink)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = 'var(--ink-3)'
      }}
    >
      {children}
    </button>
  )
}

// ─── AssistantMessage ─────────────────────────────────────────────────────────

interface AssistantMessageProps {
  content: string | BlockData[]
  isStreaming?: boolean
  brandName?: string
}

export function AssistantMessage({
  content,
  isStreaming = false,
  brandName = 'Norte',
}: AssistantMessageProps) {
  const [copied, setCopied] = useState(false)

  const textContent =
    typeof content === 'string'
      ? content
      : content.map((b) => ('value' in b ? b.value : '')).join('\n')

  const handleCopy = () => {
    navigator.clipboard?.writeText(textContent ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div
      className="norte-assistant-msg"
      style={{
        display: 'flex',
        gap: 13,
        marginBottom: 30,
      }}
    >
      <NorteMark size={30} />
      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 9,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '-0.01em',
            }}
          >
            {brandName}
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
              background: 'var(--surface-2)',
              color: 'var(--ink-3)',
              border: '1px solid transparent',
            }}
          >
            Estratega
          </span>
        </div>

        {/* Content */}
        <div style={{ position: 'relative' }}>
          {typeof content === 'string' ? (
            <RichText value={content} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {content.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          )}
          {isStreaming && (
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 16,
                background: 'var(--accent)',
                marginLeft: 2,
                verticalAlign: 'text-bottom',
                animation: 'norte-cursor 1s infinite',
                borderRadius: 2,
              }}
            />
          )}
        </div>

        {/* Actions (show on hover) */}
        {!isStreaming && (
          <div
            className="norte-msg-actions"
            style={{
              display: 'flex',
              gap: 2,
              marginTop: 10,
              opacity: 0,
              transition: 'opacity .2s',
            }}
          >
            <IconBtn title={copied ? 'Copiado' : 'Copiar'} onClick={handleCopy}>
              {copied ? (
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.3}>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x={9} y={9} width={13} height={13} rx={2} />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </IconBtn>
            <IconBtn title="Buena respuesta">
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
              </svg>
            </IconBtn>
            <IconBtn title="Regenerar">
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M23 4v6h-6" />
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
              </svg>
            </IconBtn>
          </div>
        )}
      </div>

      <style>{`
        .norte-assistant-msg:hover .norte-msg-actions { opacity: 1 !important; }
        @keyframes norte-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}

// ─── ChatMessage (unified dispatcher) ────────────────────────────────────────

export interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string | BlockData[]
  isStreaming?: boolean
  brandName?: string
}

export function ChatMessage({
  role,
  content,
  isStreaming = false,
  brandName = 'Norte',
}: ChatMessageProps) {
  if (role === 'user') {
    return <UserMessage content={typeof content === 'string' ? content : ''} />
  }
  return (
    <AssistantMessage
      content={content}
      isStreaming={isStreaming}
      brandName={brandName}
    />
  )
}
