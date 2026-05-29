import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { FREE_DAILY_LIMIT } from '@/lib/constants'
import type { Subscription, UsageTracking } from '@/types'

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check if user is pro
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .single<Pick<Subscription, 'plan' | 'status'>>()

    const isPro =
      subscription?.plan === 'pro' &&
      (subscription?.status === 'active' || subscription?.status === 'trialing')

    // Get usage_tracking row
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', user.id)
      .single<UsageTracking>()

    const today = new Date().toISOString().split('T')[0]
    const lastReset = usage?.last_reset?.split('T')[0]
    const isNewDay = lastReset !== today

    // If it's a new day and user has a usage row, reset daily count in DB
    let dailyMessages = isNewDay ? 0 : (usage?.daily_messages ?? 0)

    if (isNewDay && usage) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('usage_tracking')
        .update({
          daily_messages: 0,
          last_reset: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      dailyMessages = 0
    }

    const limit = isPro ? null : FREE_DAILY_LIMIT
    const remaining = isPro ? null : Math.max(0, FREE_DAILY_LIMIT - dailyMessages)

    return NextResponse.json({
      daily_messages: dailyMessages,
      monthly_messages: usage?.monthly_messages ?? 0,
      total_messages: usage?.total_messages ?? 0,
      limit,
      remaining,
      isPro,
    })
  } catch (error) {
    console.error('[User Usage GET] Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
