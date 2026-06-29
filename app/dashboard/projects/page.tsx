import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Project, Subscription } from '@/types'
import ProjectsClient from './projects-client'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [projectsRes, subscriptionRes] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .single<Pick<Subscription, 'plan' | 'status'>>(),
  ])

  const projects = (projectsRes.data as Project[]) ?? []
  const isPro =
    subscriptionRes.data?.plan === 'pro' &&
    (subscriptionRes.data?.status === 'active' || subscriptionRes.data?.status === 'trialing')

  return <ProjectsClient projects={projects} isPro={isPro} />
}
