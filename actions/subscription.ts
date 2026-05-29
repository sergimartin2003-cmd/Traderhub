'use server'

import { createClient } from '@/lib/supabase/server'
import { FREE_DAILY_LIMIT } from '@/lib/constants'
import type { Subscription, UsageTracking } from '@/types'

export async function getSubscription(): Promise<Subscription | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return null

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single<Subscription>()

  return data ?? null
}

export async function isPro(): Promise<boolean> {
  const subscription = await getSubscription()

  return (
    subscription?.plan === 'pro' &&
    (subscription?.status === 'active' || subscription?.status === 'trialing')
  )
}

export async function getUsage(): Promise<{
  daily_messages: number
  monthly_messages: number
  total_messages: number
  limit: number | null
  remaining: number | null
  isPro: boolean
} | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return null

  const userIsPro = await isPro()

  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', user.id)
    .single<UsageTracking>()

  const today = new Date().toISOString().split('T')[0]
  const lastReset = usage?.last_reset?.split('T')[0]
  const isNewDay = lastReset !== today

  const dailyMessages = isNewDay ? 0 : (usage?.daily_messages ?? 0)

  const limit = userIsPro ? null : FREE_DAILY_LIMIT
  const remaining = userIsPro ? null : Math.max(0, FREE_DAILY_LIMIT - dailyMessages)

  return {
    daily_messages: dailyMessages,
    monthly_messages: usage?.monthly_messages ?? 0,
    total_messages: usage?.total_messages ?? 0,
    limit,
    remaining,
    isPro: userIsPro,
  }
}

export async function incrementUsage(): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'No autorizado' }
  }

  const today = new Date().toISOString().split('T')[0]

  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', user.id)
    .single<UsageTracking>()

  if (usage) {
    const lastReset = usage.last_reset?.split('T')[0]
    const isNewDay = lastReset !== today

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('usage_tracking')
      .update({
        daily_messages: isNewDay ? 1 : usage.daily_messages + 1,
        monthly_messages: (usage.monthly_messages ?? 0) + 1,
        total_messages: (usage.total_messages ?? 0) + 1,
        last_reset: isNewDay ? new Date().toISOString() : usage.last_reset,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (error) {
      return { error: 'Error al incrementar el uso' }
    }
  } else {
    // First message — create usage row
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('usage_tracking').insert({
      user_id: user.id,
      daily_messages: 1,
      monthly_messages: 1,
      total_messages: 1,
      last_reset: new Date().toISOString(),
    })

    if (error) {
      return { error: 'Error al crear registro de uso' }
    }
  }
}
