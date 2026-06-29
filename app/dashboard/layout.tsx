import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile, Subscription } from '@/types'
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

  // Fetch profile and subscription in parallel
  const [profileRes, subscriptionRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single<Profile>(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single<Subscription>(),
  ])

  const profile = profileRes.data
  const subscription = subscriptionRes.data
  const isPro =
    subscription?.plan === 'pro' &&
    (subscription?.status === 'active' || subscription?.status === 'trialing')

  return (
    <DashboardShell
      user={{ id: user.id, email: user.email ?? '' }}
      profile={profile}
      subscription={subscription}
      isPro={isPro ?? false}
    >
      {children}
    </DashboardShell>
  )
}
