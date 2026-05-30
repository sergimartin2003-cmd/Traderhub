import { z } from 'zod'

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  OPENROUTER_API_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
})

export type Env = z.infer<typeof schema>

export function validateEnv(): Env {
  const result = schema.safeParse(process.env)
  if (!result.success) {
    const missing = result.error.issues.map(i => i.path.join('.')).join(', ')
    throw new Error(`Missing required environment variables: ${missing}\nCheck your .env.local file.`)
  }
  return result.data
}

export const env = (() => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    return validateEnv()
  }
  return process.env as unknown as Env
})()
