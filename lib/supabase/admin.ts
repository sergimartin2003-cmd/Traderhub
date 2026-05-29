import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Admin client using service role key.
// ONLY import this in server-only files (API routes, Server Actions, webhooks).
// NEVER import in Client Components or pages with 'use client'.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
