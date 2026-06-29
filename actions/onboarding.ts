'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface OnboardingData {
  full_name?: string
  business?: string
  goal?: string
  trading_style?: string
}

export async function completeOnboarding(
  data: OnboardingData
): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'No autorizado' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('profiles')
    .update({
      full_name: data.full_name?.trim() || null,
      business: data.business?.trim() || null,
      goal: data.goal?.trim() || null,
      trading_style: data.trading_style?.trim() || null,
      onboarded: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { error: 'No se pudo guardar el onboarding' }
  }

  revalidatePath('/dashboard', 'layout')
  return { ok: true }
}
