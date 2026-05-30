import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewChatClient } from './new-chat-client'
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

  const [subscriptionRes, usageRes] = await Promise.all([
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

  const isPro =
    subscriptionRes.data?.plan === 'pro' &&
    (subscriptionRes.data?.status === 'active' || subscriptionRes.data?.status === 'trialing')

  const today = new Date().toISOString().split('T')[0]
  const lastReset = usageRes.data?.last_reset?.split('T')[0]
  const dailyMessages = lastReset === today ? (usageRes.data?.daily_messages ?? 0) : 0
  const remaining = Math.max(0, FREE_DAILY_LIMIT - dailyMessages)

  return (
    <div style={{ height: '100%' }}>
      <NewChatClient
        isPro={isPro}
        remaining={remaining}
        initialQuery={initialQuery}
      />
    </div>
  )
}
