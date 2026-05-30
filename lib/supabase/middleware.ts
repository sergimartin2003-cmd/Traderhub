import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

const PROTECTED_PATHS = ['/dashboard', '/chat', '/projects', '/settings', '/tools']
const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password']
const VERIFY_PATHS = ['/verify-email']

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

function isVerifyExempt(pathname: string) {
  return (
    VERIFY_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/')
  )
}

/**
 * Refreshes the Supabase auth session on every request and handles route protection.
 * - Unauthenticated users trying to reach protected routes → redirect to /login
 * - Authenticated users trying to reach auth pages → redirect to /dashboard
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not remove this block. Required to keep session alive.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Redirect users with unverified email to verify-email page
  if (user && !user.email_confirmed_at && !isVerifyExempt(pathname) && !isAuthPath(pathname)) {
    const verifyUrl = request.nextUrl.clone()
    verifyUrl.pathname = '/verify-email'
    return NextResponse.redirect(verifyUrl)
  }

  // Redirect unauthenticated users away from protected routes
  if (!user && isProtectedPath(pathname)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthPath(pathname)) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    dashboardUrl.searchParams.delete('redirectTo')
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}
