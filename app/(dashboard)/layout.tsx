import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile, Subscription, Conversation } from '@/types'
import DashboardShell from '@/components/layout/dashboard-shell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [profileRes, subscriptionRes, conversationsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single<Profile>(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single<Subscription>(),
    supabase
      .from('conversations')
      .select('id, title, context')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(12),
  ])

  const profile = profileRes.data
  const subscription = subscriptionRes.data
  const conversations = (conversationsRes.data as Conversation[]) ?? []
  const isPro =
    subscription?.plan === 'pro' &&
    (subscription?.status === 'active' || subscription?.status === 'trialing')

  return (
    <DashboardShell
      user={{ id: user.id, email: user.email ?? '' }}
      profile={profile}
      subscription={subscription}
      conversations={conversations}
      isPro={isPro ?? false}
    >
      {children}
    </DashboardShell>
  )
}
