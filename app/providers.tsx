'use client'

import posthog from 'posthog-js'
import { PostHogProvider, usePostHog } from 'posthog-js/react'
import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Toaster } from 'sonner'

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ph = usePostHog()

  useEffect(() => {
    if (pathname && ph) {
      let url = window.location.origin + pathname
      if (searchParams.toString()) {
        url = `${url}?${searchParams.toString()}`
      }
      ph.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams, ph])

  return null
}

const toasterStyle = {
  fontFamily: 'var(--font-display)',
  borderRadius: 'var(--r-md)',
  border: '1px solid var(--line)',
  background: 'var(--surface)',
  color: 'var(--ink)',
}

export function PostHogProviderWrapper({ children }: { children: React.ReactNode }) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

  useEffect(() => {
    if (key) {
      posthog.init(key, {
        api_host: host ?? 'https://eu.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
      })
    }
  }, [key, host])

  if (!key) {
    return (
      <>
        {children}
        <Toaster position="bottom-right" toastOptions={{ style: toasterStyle }} />
      </>
    )
  }

  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
      <Toaster position="bottom-right" toastOptions={{ style: toasterStyle }} />
    </PostHogProvider>
  )
}
