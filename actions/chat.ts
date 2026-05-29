'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Conversation, Message } from '@/types'

export async function createConversation(
  title: string,
  context?: string
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
    .from('conversations')
    .insert({ user_id: user.id, title, context: context ?? null })
    .select('id')
    .single()

  if (error || !data) {
    return { error: 'Error al crear la conversación' }
  }

  revalidatePath('/dashboard/chat')

  return { id: data.id }
}

export async function deleteConversation(id: string): Promise<{ error: string } | void> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'No autorizado' }
  }

  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // ensure ownership

  if (error) {
    return { error: 'Error al eliminar la conversación' }
  }

  revalidatePath('/dashboard/chat')
}

export async function updateConversationTitle(
  id: string,
  title: string
): Promise<{ error: string } | void> {
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
    .from('conversations')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Error al actualizar el título' }
  }

  revalidatePath('/dashboard/chat')
}

export async function saveMessage(
  conversationId: string,
  role: Message['role'],
  content: string,
  model?: string,
  tokens?: number
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
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
      model: model ?? null,
      tokens: tokens ?? null,
    })
    .select('id')
    .single()

  if (error || !data) {
    return { error: 'Error al guardar el mensaje' }
  }

  return { id: data.id }
}
