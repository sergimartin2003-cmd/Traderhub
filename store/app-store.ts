'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppStore {
  accent: string
  density: 'compact' | 'regular' | 'comfy'
  aiTone: string
  brandName: string
  setAccent: (accent: string) => void
  setDensity: (density: 'compact' | 'regular' | 'comfy') => void
  setAiTone: (tone: string) => void
  applyTheme: () => void
}

const ACCENTS: Record<string, { a: string; a6: string; a7: string; t: string; t2: string; g: string }> = {
  esmeralda: { a: '#10B981', a6: '#059669', a7: '#047857', t: '#ECFDF5', t2: '#D1FAE5', g: 'rgba(16,185,129,0.18)' },
  índigo:    { a: '#6366F1', a6: '#4F46E5', a7: '#4338CA', t: '#EEF2FF', t2: '#E0E7FF', g: 'rgba(99,102,241,0.18)' },
  azul:      { a: '#3B82F6', a6: '#2563EB', a7: '#1D4ED8', t: '#EFF6FF', t2: '#DBEAFE', g: 'rgba(59,130,246,0.18)' },
  ámbar:     { a: '#F59E0B', a6: '#D97706', a7: '#B45309', t: '#FFFBEB', t2: '#FEF3C7', g: 'rgba(245,158,11,0.20)' },
  tinta:     { a: '#18181B', a6: '#0A0A0A', a7: '#000000', t: '#F4F4F5', t2: '#E4E4E7', g: 'rgba(0,0,0,0.14)' },
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      accent: 'esmeralda',
      density: 'regular',
      aiTone: 'estratega',
      brandName: 'Norte',

      setAccent: (accent) => {
        set({ accent })
        get().applyTheme()
      },
      setDensity: (density) => {
        set({ density })
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-density', density)
        }
      },
      setAiTone: (aiTone) => set({ aiTone }),

      applyTheme: () => {
        if (typeof document === 'undefined') return
        const ac = ACCENTS[get().accent] ?? ACCENTS.esmeralda
        const r = document.documentElement.style
        r.setProperty('--accent', ac.a)
        r.setProperty('--accent-600', ac.a6)
        r.setProperty('--accent-700', ac.a7)
        r.setProperty('--accent-tint', ac.t)
        r.setProperty('--accent-tint-2', ac.t2)
        r.setProperty('--accent-glow', ac.g)
        document.documentElement.setAttribute('data-density', get().density)
      },
    }),
    { name: 'norte-app' }
  )
)
