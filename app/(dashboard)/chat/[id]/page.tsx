import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChatContainer } from '@/components/chat/chat-container'
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

  // Fetch conversation + messages in parallel with subscription/usage
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
      .select('daily_messages')
      .eq('user_id', user.id)
      .single<{ daily_messages: number }>(),
  ])

  if (!convRes.data) notFound()

  const conversation = convRes.data
  const messages = (messagesRes.data as Message[]) ?? []

  const isPro =
    subscriptionRes.data?.plan === 'pro' &&
    (subscriptionRes.data?.status === 'active' || subscriptionRes.data?.status === 'trialing')

  const dailyMessages = usageRes.data?.daily_messages ?? 0
  const remaining = Math.max(0, 10 - dailyMessages)

  return (
    <div style={{ height: '100%' }}>
      <ChatContainer
        conversationId={id}
        initialMessages={messages}
        context={conversation.context ?? undefined}
        isPro={isPro}
        remaining={remaining}
      />
    </div>
  )
}
