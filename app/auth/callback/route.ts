import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/resend/client'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Detect new user: created_at and last_sign_in_at are equal on first login
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const createdAt = new Date(user.created_at).getTime()
          const signedInAt = new Date(user.last_sign_in_at ?? 0).getTime()
          const isNewUser = Math.abs(createdAt - signedInAt) < 5000

          if (isNewUser) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: profile } = await (supabase as any)
              .from('profiles')
              .select('email, full_name')
              .eq('id', user.id)
              .single()
            const email = (profile?.email as string | null) ?? user.email
            if (email) {
              await sendWelcomeEmail(email, (profile?.full_name as string | null) ?? 'Emprendedor')
            }
          }
        }
      } catch { /* non-fatal */ }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
