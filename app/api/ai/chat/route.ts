import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { streamChat, getModelForPlan } from '@/lib/openrouter/client'
import { FREE_DAILY_LIMIT } from '@/lib/constants'
import type { Plan, Subscription, UsageTracking } from '@/types'

const schema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    })
  ),
  conversationId: z.string().uuid().optional(),
  model: z.string().optional(),
  context: z.string().optional(),
})

function buildSystemPrompt(context?: string): string {
  return `Eres Norte, un asistente experto en estrategia de negocios para emprendedores en español.
Ayudas con: validación de ideas de negocio, diseño de modelo de negocio, estrategia de marketing, precios, análisis de competidores y crecimiento empresarial.
${context ? `Contexto del negocio: ${context}` : ''}
Responde en español. Sé conciso, accionable y estructurado. Usa viñetas y secciones claras.
Cuando sea relevante, estructura tu respuesta con elementos de acción concretos.`
}

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // 2. Validate request body
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos de solicitud inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }
    const { messages, conversationId, context } = parsed.data

    // 3. Get subscription plan
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('user_id', user.id)
      .single<Pick<Subscription, 'plan' | 'status'>>()

    const isPro =
      subscription?.plan === 'pro' &&
      (subscription?.status === 'active' || subscription?.status === 'trialing')

    const plan: Plan = isPro ? 'pro' : 'free'

    // 4. Check usage limits for free users
    const today = new Date().toISOString().split('T')[0]

    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', user.id)
      .single<UsageTracking>()

    if (!isPro) {
      const lastReset = usage?.last_reset?.split('T')[0]
      const currentDaily = lastReset === today ? (usage?.daily_messages ?? 0) : 0

      if (currentDaily >= FREE_DAILY_LIMIT) {
        return NextResponse.json(
          {
            error: 'Límite diario alcanzado. Actualiza a Pro para mensajes ilimitados.',
            code: 'RATE_LIMITED',
            limit: FREE_DAILY_LIMIT,
          },
          { status: 429 }
        )
      }
    }

    // 5. Select model based on plan
    const model = getModelForPlan(plan)

    // 6. Build system prompt
    const systemPrompt = buildSystemPrompt(context)

    // 7 & 8. Stream response using the openrouter client
    const encoder = new TextEncoder()
    let fullContent = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const delta of streamChat(messages, model, systemPrompt)) {
            fullContent += delta
            // SSE format
            const payload = JSON.stringify({ content: delta })
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`))
          }

          // Signal end of stream
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch (streamError) {
          const errPayload = JSON.stringify({ error: 'Error en el stream de IA' })
          controller.enqueue(encoder.encode(`data: ${errPayload}\n\n`))
        } finally {
          controller.close()

          // 9. Post-stream: increment usage and save messages
          try {
            const lastReset = usage?.last_reset?.split('T')[0]
            const isNewDay = lastReset !== today

            // Check for monthly reset (first day of month)
            const thisMonth = today.slice(0, 7) // "YYYY-MM"
            const lastMonth = lastReset?.slice(0, 7)
            const isNewMonth = lastMonth !== thisMonth

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const db = supabase as any
            if (usage) {
              await db
                .from('usage_tracking')
                .update({
                  daily_messages: isNewDay ? 1 : (usage.daily_messages + 1),
                  monthly_messages: isNewMonth ? 1 : ((usage.monthly_messages ?? 0) + 1),
                  total_messages: (usage.total_messages ?? 0) + 1,
                  last_reset: isNewDay ? today : usage.last_reset,
                  updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.id)
            } else {
              await db
                .from('usage_tracking')
                .insert({
                  user_id: user.id,
                  daily_messages: 1,
                  monthly_messages: 1,
                  total_messages: 1,
                  last_reset: today,
                })
            }

            // Save messages to DB if conversationId provided
            if (conversationId) {
              const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
              const inserts: { conversation_id: string; role: string; content: string; model?: string }[] = []

              if (lastUserMessage) {
                inserts.push({
                  conversation_id: conversationId,
                  role: 'user' as const,
                  content: lastUserMessage.content,
                })
              }

              if (fullContent) {
                inserts.push({
                  conversation_id: conversationId,
                  role: 'assistant' as const,
                  content: fullContent,
                  model,
                })
              }

              if (inserts.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase as any).from('messages').insert(inserts)
              }
            }
          } catch {
            // Non-fatal: usage tracking failure should not affect user
          }
        }
      },
    })

    // 10. Return streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error('[AI Chat] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
