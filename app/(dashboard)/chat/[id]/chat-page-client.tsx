'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChatContainer } from '@/components/chat/chat-container'
import type { Message } from '@/types'

interface ChatPageClientProps {
  conversationId: string
  initialMessages: Message[]
  context?: string
  isPro: boolean
  remaining: number
}

export function ChatPageClient({
  conversationId,
  initialMessages,
  context,
  isPro,
  remaining,
}: ChatPageClientProps) {
  const router = useRouter()

  const handleUpgrade = useCallback(() => {
    router.push('/upgrade')
  }, [router])

  return (
    <ChatContainer
      conversationId={conversationId}
      initialMessages={initialMessages}
      context={context}
      isPro={isPro}
      remaining={remaining}
      onUpgrade={handleUpgrade}
    />
  )
}
