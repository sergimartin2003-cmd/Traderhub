import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types'
import OnboardingClient from './onboarding-client'

export const metadata = { title: 'Bienvenido' }

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, onboarded')
    .eq('id', user.id)
    .single<Pick<Profile, 'full_name' | 'onboarded'>>()

  if (profile?.onboarded) redirect('/dashboard')

  return (
    <OnboardingClient
      initialName={profile?.full_name ?? user.user_metadata?.full_name ?? ''}
    />
  )
}
