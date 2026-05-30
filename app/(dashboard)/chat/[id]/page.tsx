import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChatPageClient } from './chat-page-client'
import { FREE_DAILY_LIMIT } from '@/lib/constants'
import type { Message } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ConversationPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [convRes, messagesRes, subscriptionRes, usageRes] = await Promise.all([
    supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single<{ id: string; title: string; context: string | null; user_id: string }>(),
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true }),
    supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .single<{ plan: string; status: string }>(),
    supabase
      .from('usage_tracking')
      .select('daily_messages, last_reset')
      .eq('user_id', user.id)
      .single<{ daily_messages: number; last_reset: string }>(),
  ])

  if (!convRes.data) notFound()

  const conversation = convRes.data
  const messages = (messagesRes.data as Message[]) ?? []

  const isPro =
    subscriptionRes.data?.plan === 'pro' &&
    (subscriptionRes.data?.status === 'active' || subscriptionRes.data?.status === 'trialing')

  const today = new Date().toISOString().split('T')[0]
  const lastReset = usageRes.data?.last_reset?.split('T')[0]
  const dailyMessages = lastReset === today ? (usageRes.data?.daily_messages ?? 0) : 0
  const remaining = Math.max(0, FREE_DAILY_LIMIT - dailyMessages)

  return (
    <div style={{ height: '100%' }}>
      <ChatPageClient
        conversationId={id}
        initialMessages={messages}
        context={conversation.context ?? undefined}
        isPro={isPro}
        remaining={remaining}
      />
    </div>
  )
}
