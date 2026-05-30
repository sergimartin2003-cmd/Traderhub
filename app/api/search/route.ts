import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q) {
    return NextResponse.json({ results: [] })
  }

  const [convRes, projRes] = await Promise.all([
    supabase
      .from('conversations')
      .select('id, title, created_at')
      .eq('user_id', user.id)
      .ilike('title', `%${q}%`)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('projects')
      .select('id, title, created_at')
      .eq('user_id', user.id)
      .ilike('title', `%${q}%`)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  type SearchResult = { type: 'conversation' | 'project'; id: string; title: string; created_at: string }

  const conversations: SearchResult[] = (convRes.data ?? []).map((c) => ({
    type: 'conversation',
    id: c.id,
    title: c.title,
    created_at: c.created_at,
  }))

  const projects: SearchResult[] = (projRes.data ?? []).map((p) => ({
    type: 'project',
    id: p.id,
    title: p.title,
    created_at: p.created_at,
  }))

  const results = [...conversations, ...projects]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)

  return NextResponse.json({ results })
}
