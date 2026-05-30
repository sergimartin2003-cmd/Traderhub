'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { EmptyChat } from './empty-chat'
import { ChatInput } from './chat-input'
import { ChatMessage, TypingDots } from './chat-message'
import type { Message } from '@/types'

// ─── Norte mark (inline, for typing indicator row) ───────────────────────────

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

// ─── Upgrade banner ───────────────────────────────────────────────────────────

function UpgradeBanner({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <div
      style={{
        margin: '0 24px 16px',
        padding: '14px 18px',
        background: 'var(--gold-tint, #FEF3C7)',
        border: '1px solid var(--gold-tint-2, #FDE68A)',
        borderRadius: 'var(--r-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 14,
      }}
    >
      <svg width={20} height={20} viewBox="0 0 24 24" fill="var(--gold, #B7791F)">
        <path d="M2 20h20l-2-8-5 4-3-8-3 8-5-4-2 8z" />
      </svg>
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 700, color: 'var(--ink)' }}>Límite diario alcanzado.</span>
        <span style={{ color: 'var(--ink-2)', marginLeft: 6 }}>
          Actualiza a Pro para mensajes ilimitados.
        </span>
      </div>
      {onUpgrade && (
        <button
          onClick={onUpgrade}
          style={{
            padding: '8px 14px',
            borderRadius: 'var(--r-md)',
            border: '1px solid #D9920A',
            background: 'linear-gradient(180deg, #FBBF24, var(--gold-bright, #F59E0B))',
            color: '#3a2a05',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Mejorar a Pro
        </button>
      )}
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface LocalMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatContainerProps {
  conversationId?: string
  initialMessages?: Message[]
  context?: string
  isPro?: boolean
  remaining?: number
  onUpgrade?: () => void
  onConversationCreate?: (title: string) => Promise<string | undefined>
  brandName?: string
}

// ─── ChatContainer ────────────────────────────────────────────────────────────

export function ChatContainer({
  conversationId: initialConversationId,
  initialMessages = [],
  context,
  isPro = false,
  remaining = 10,
  onUpgrade,
  onConversationCreate,
  brandName = 'Norte',
}: ChatContainerProps) {
  const [conversationId, setConversationId] = useState(initialConversationId)
  const [messages, setMessages] = useState<LocalMessage[]>(() =>
    initialMessages.map((m) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))
  )
  const [isLoading, setIsLoading] = useState(false)
  const [streamingId, setStreamingId] = useState<string | null>(null)
  const [rateLimited, setRateLimited] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return
      if (!isPro && remaining <= 0) {
        setRateLimited(true)
        onUpgrade?.()
        return
      }

      const userMsg: LocalMessage = {
        id: 'u' + Date.now(),
        role: 'user',
        content: text,
      }
      const assistantId = 'a' + Date.now()

      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)
      setRateLimited(false)

      // Auto-create conversation on first message if not yet created
      let activeConversationId = conversationId
      if (!activeConversationId && onConversationCreate) {
        const title = text.slice(0, 80)
        activeConversationId = await onConversationCreate(title)
        if (activeConversationId) {
          setConversationId(activeConversationId)
        }
      }

      try {
        const history = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }))

        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: history,
            conversationId: activeConversationId,
            context,
          }),
        })

        if (res.status === 429) {
          setRateLimited(true)
          setIsLoading(false)
          onUpgrade?.()
          return
        }

        if (!res.ok) {
          throw new Error(`Error ${res.status}`)
        }

        // Start streaming
        setIsLoading(false)
        setStreamingId(assistantId)
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: 'assistant', content: '' },
        ])

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (raw === '[DONE]') continue

            try {
              const parsed = JSON.parse(raw)
              if (parsed.error) {
                accumulated += '\n\n_Error: ' + parsed.error + '_'
              } else if (parsed.content) {
                accumulated += parsed.content
              }

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: accumulated } : m
                )
              )
            } catch {
              // Ignore malformed chunks
            }
          }
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Error desconocido'
        setMessages((prev) => [
          ...prev,
          {
            id: 'err' + Date.now(),
            role: 'assistant',
            content: `Lo siento, ocurrió un error: ${errMsg}. Por favor, inténtalo de nuevo.`,
          },
        ])
        setIsLoading(false)
      } finally {
        setStreamingId(null)
        setIsLoading(false)
      }
    },
    [messages, isLoading, isPro, remaining, conversationId, context, onUpgrade, onConversationCreate]
  )

  const handleSuggestion = (text: string) => {
    sendMessage(text)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        background: 'var(--canvas, #FBFBFA)',
      }}
    >
      {/* Context banner */}
      {context && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '10px 24px',
            borderBottom: '1px solid var(--line)',
            background: 'var(--surface)',
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx={12} cy={10} r={3} />
          </svg>
          <span style={{ color: 'var(--ink-3)' }}>Contexto —</span>
          <span style={{ fontWeight: 600 }}>{context}</span>
        </div>
      )}

      {/* Messages scroll area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          scrollBehavior: 'smooth',
        }}
      >
        {messages.length === 0 && !isLoading ? (
          <EmptyChat onSuggestion={handleSuggestion} brandName={brandName} />
        ) : (
          <div
            style={{
              maxWidth: 760,
              margin: '0 auto',
              padding: '30px 24px 24px',
            }}
          >
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                isStreaming={streamingId === msg.id}
                brandName={brandName}
              />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div
                style={{
                  display: 'flex',
                  gap: 13,
                  marginBottom: 30,
                }}
              >
                <NorteMark size={30} />
                <div style={{ paddingTop: 4 }}>
                  <TypingDots />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rate limit banner */}
      {rateLimited && <UpgradeBanner onUpgrade={onUpgrade} />}

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={isLoading}
        remaining={remaining}
        isPro={isPro}
        onUpgrade={onUpgrade}
        brandName={brandName}
      />
    </div>
  )
}
