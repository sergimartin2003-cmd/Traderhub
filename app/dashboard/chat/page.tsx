import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChatContainer } from '@/components/chat/chat-container'
import { FREE_DAILY_LIMIT } from '@/lib/constants'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function NewChatPage({ searchParams }: Props) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const params = await searchParams
  const initialQuery = params.q

  // Fetch subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single<{ plan: string; status: string }>()

  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('daily_messages')
    .eq('user_id', user.id)
    .single<{ daily_messages: number }>()

  const isPro =
    subscription?.plan === 'pro' &&
    (subscription?.status === 'active' || subscription?.status === 'trialing')

  const dailyMessages = usage?.daily_messages ?? 0
  const remaining = Math.max(0, FREE_DAILY_LIMIT - dailyMessages)

  return (
    <div style={{ height: '100%' }}>
      <ChatContainer
        initialMessages={[]}
        isPro={isPro}
        remaining={remaining}
        context={initialQuery}
      />
    </div>
  )
}
