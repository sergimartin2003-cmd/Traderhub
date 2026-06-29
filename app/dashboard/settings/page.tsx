import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Profile, Subscription } from '@/types'
import SettingsClient from './settings-client'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, subscriptionRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single<Profile>(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single<Subscription>(),
  ])

  return (
    <SettingsClient
      profile={profileRes.data}
      subscription={subscriptionRes.data}
      userEmail={user.email ?? ''}
    />
  )
}
