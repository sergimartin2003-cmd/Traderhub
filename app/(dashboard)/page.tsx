import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardHome from '@/components/dashboard/dashboard-home'
import type { Conversation, Project } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch conversations, projects, and usage in parallel
  const [conversationsRes, projectsRes, usageRes] = await Promise.all([
    supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(8),
    supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(3),
    supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', user.id)
      .single<{ daily_messages: number; total_messages: number }>(),
  ])

  const conversations = (conversationsRes.data as Conversation[]) ?? []
  const projects = (projectsRes.data as Project[]) ?? []
  const usage = usageRes.data

  return (
    <DashboardHome
      userId={user.id}
      conversations={conversations}
      projects={projects}
      dailyMessages={usage?.daily_messages ?? 0}
      totalMessages={usage?.total_messages ?? 0}
    />
  )
}
