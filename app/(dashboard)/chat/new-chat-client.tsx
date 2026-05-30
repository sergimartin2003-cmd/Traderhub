'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChatContainer } from '@/components/chat/chat-container'
import { createConversation } from '@/actions/chat'

interface NewChatClientProps {
  isPro: boolean
  remaining: number
  initialQuery?: string
}

export function NewChatClient({ isPro, remaining, initialQuery }: NewChatClientProps) {
  const router = useRouter()
  const [conversationId, setConversationId] = useState<string | undefined>(undefined)

  const handleConversationCreate = useCallback(async (title: string) => {
    const result = await createConversation(title)
    if ('id' in result) {
      setConversationId(result.id)
      router.replace(`/dashboard/chat/${result.id}`, { scroll: false })
      return result.id
    }
    return undefined
  }, [router])

  const handleUpgrade = useCallback(() => {
    router.push('/upgrade')
  }, [router])

  return (
    <ChatContainer
      conversationId={conversationId}
      isPro={isPro}
      remaining={remaining}
      context={initialQuery}
      onConversationCreate={handleConversationCreate}
      onUpgrade={handleUpgrade}
    />
  )
}
