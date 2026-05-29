import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Returns a browser-side Supabase client.
 * Safe to call multiple times — each call creates a new instance (Next.js recommends this pattern for SSR).
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
