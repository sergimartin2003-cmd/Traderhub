'use client'

import { usePostHog } from 'posthog-js/react'
import { useCallback } from 'react'

export function useAnalytics() {
  const ph = usePostHog()

  const track = useCallback(
    (event: string, props?: Record<string, unknown>) => {
      try {
        ph?.capture(event, props)
      } catch { /* non-fatal */ }
    },
    [ph]
  )

  return { track }
}
