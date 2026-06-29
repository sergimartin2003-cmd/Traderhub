import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Conversation, Profile, Subscription } from '@/types'
import DashboardShell from '@/components/layout/dashboard-shell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Verify session server-side
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile, subscription and recent conversations in parallel
  const [profileRes, subscriptionRes, conversationsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single<Profile>(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single<Subscription>(),
    supabase
      .from('conversations')
      .select('id, title, context')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(20),
  ])

  const profile = profileRes.data
  const subscription = subscriptionRes.data

  // Send new users through onboarding (only if a profile row exists but is not onboarded)
  if (profile && !profile.onboarded) {
    redirect('/onboarding')
  }

  const conversations = (conversationsRes.data as Pick<Conversation, 'id' | 'title' | 'context'>[]) ?? []
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
