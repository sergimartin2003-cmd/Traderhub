import OpenAI from 'openai'
import type { Plan } from '@/types'

// OpenRouter exposes an OpenAI-compatible API at this base URL
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

// Lazy init — avoids "missing API key" errors during build
let _openrouter: OpenAI | null = null
function getOpenRouter(): OpenAI {
  if (_openrouter) return _openrouter
  _openrouter = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY ?? 'placeholder',
    baseURL: OPENROUTER_BASE_URL,
    defaultHeaders: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'X-Title': 'Norte',
    },
  })
  return _openrouter
}

export const openrouter = new Proxy({} as OpenAI, {
  get(_target, prop) {
    return (getOpenRouter() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

// ---------------------------------------------------------------------------
// Model selection
// ---------------------------------------------------------------------------

const FREE_MODEL = 'google/gemini-flash-1.5'
const PRO_MODEL = 'anthropic/claude-3-5-sonnet'

/**
 * Returns the OpenRouter model ID for a given plan.
 */
export function getModelForPlan(plan: Plan): string {
  return plan === 'pro' ? PRO_MODEL : FREE_MODEL
}

// ---------------------------------------------------------------------------
// Streaming chat
// ---------------------------------------------------------------------------

export type OpenRouterMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * Streams a chat completion from OpenRouter.
 * Yields text deltas as they arrive.
 */
export async function* streamChat(
  messages: OpenRouterMessage[],
  model: string,
  systemPrompt?: string
): AsyncGenerator<string, void, unknown> {
  const allMessages: OpenRouterMessage[] = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages

  const stream = await openrouter.chat.completions.create({
    model,
    messages: allMessages,
    stream: true,
    max_tokens: 4096,
  })

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content
    if (delta) {
      yield delta
    }
  }
}
