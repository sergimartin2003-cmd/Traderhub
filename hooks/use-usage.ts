'use client'
import { useEffect, useState, useCallback } from 'react'
import { FREE_DAILY_LIMIT } from '@/lib/constants'

interface UsageData {
  dailyMessages: number
  remaining: number
  limit: number
  isPro: boolean
  isLoading: boolean
}

export function useUsage(): UsageData & { refetch: () => void } {
  const [data, setData] = useState<UsageData>({
    dailyMessages: 0,
    remaining: FREE_DAILY_LIMIT,
    limit: FREE_DAILY_LIMIT,
    isPro: false,
    isLoading: true,
  })

  const fetchUsage = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true }))
    try {
      const res = await fetch('/api/user/usage')
      if (!res.ok) throw new Error('Error al obtener uso')
      const json = await res.json()
      setData({
        dailyMessages: json.daily_messages ?? 0,
        remaining: json.remaining ?? FREE_DAILY_LIMIT,
        limit: json.limit ?? FREE_DAILY_LIMIT,
        isPro: json.is_pro ?? false,
        isLoading: false,
      })
    } catch {
      setData((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  useEffect(() => {
    fetchUsage()
  }, [fetchUsage])

  return { ...data, refetch: fetchUsage }
}
