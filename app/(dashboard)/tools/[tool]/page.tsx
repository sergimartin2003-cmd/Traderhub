import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TOOLS } from '@/lib/constants'
import type { Subscription } from '@/types'
import { ToolView } from '@/components/tools/tool-view'

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: toolId } = await params

  const tool = TOOLS.find((t) => t.id === toolId)
  if (!tool) redirect('/tools')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single<Pick<Subscription, 'plan' | 'status'>>()

  const isPro =
    subscription?.plan === 'pro' &&
    (subscription?.status === 'active' || subscription?.status === 'trialing')

  return <ToolView toolId={toolId} isPro={isPro ?? false} />
}
