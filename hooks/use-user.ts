'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { Profile, Subscription } from '@/types'

interface UseUserReturn {
  user: { id: string; email: string } | null
  profile: Profile | null
  subscription: Subscription | null
  isLoading: boolean
  isPro: boolean
  error: string | null
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function fetchUser() {
      try {
        setIsLoading(true)

        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError
        if (!authUser) {
          setUser(null)
          setProfile(null)
          setSubscription(null)
          return
        }

        setUser({ id: authUser.id, email: authUser.email ?? '' })

        const [profileRes, subscriptionRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', authUser.id).single<Profile>(),
          supabase.from('subscriptions').select('*').eq('user_id', authUser.id).single<Subscription>(),
        ])

        if (profileRes.data) setProfile(profileRes.data)
        if (subscriptionRes.data) setSubscription(subscriptionRes.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '' })
      } else {
        setUser(null)
        setProfile(null)
        setSubscription(null)
      }
    })

    return () => authSub.unsubscribe()
  }, [])

  const isPro =
    subscription?.plan === 'pro' &&
    (subscription?.status === 'active' || subscription?.status === 'trialing')

  return { user, profile, subscription, isLoading, isPro, error }
}
