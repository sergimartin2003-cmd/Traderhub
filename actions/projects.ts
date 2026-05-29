'use server'

import { createClient } from '@/lib/supabase/server'
import type { Project } from '@/types'

export async function createProject(
  title: string,
  type: string,
  dataJson?: Record<string, unknown>
): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'No autorizado' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('projects')
    .insert({
      user_id: user.id,
      title,
      type,
      data_json: dataJson ?? null,
    })
    .select('id')
    .single()

  if (error || !data) {
    return { error: 'Error al crear el proyecto' }
  }

  return { id: data.id }
}

export async function deleteProject(id: string): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'No autorizado' }
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // ensure ownership

  if (error) {
    return { error: 'Error al eliminar el proyecto' }
  }
}

export async function getProjects(): Promise<Project[] | { error: string }> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'No autorizado' }
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: 'Error al obtener los proyectos' }
  }

  return data as Project[]
}
