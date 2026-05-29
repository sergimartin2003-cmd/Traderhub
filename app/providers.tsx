'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { Toaster } from 'sonner'

export function PostHogProviderWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (key) {
      posthog.init(key, {
        api_host: host ?? 'https://eu.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false, // Next.js handles page views
        capture_pageleave: true,
      })
    }
  }, [])

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

  if (!key) {
    return (
      <>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-display)',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              color: 'var(--ink)',
            },
          }}
        />
      </>
    )
  }

  return (
    <PostHogProvider client={posthog}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-display)',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--line)',
            background: 'var(--surface)',
            color: 'var(--ink)',
          },
        }}
      />
    </PostHogProvider>
  )
}
