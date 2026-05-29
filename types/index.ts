// Application-level types for Norte (TraderHub)
// Re-exports all database types as well.

export * from './database'

import type { Profile, Subscription } from './database'
import type { ToolDefinition } from '@/lib/constants'

// ---------------------------------------------------------------------------
// Core domain types
// ---------------------------------------------------------------------------

export type Plan = 'free' | 'pro'

export interface User {
  id: string
  email: string
  profile: Profile | null
  subscription: Subscription | null
  plan: Plan
}

export type ChatMessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: ChatMessageRole
  content: string
  createdAt: string
  model?: string
  tokens?: number
}

export type { ToolDefinition as Tool }

export interface ToolConfig {
  id: string
  systemPrompt: string
  firstMessage?: string
  placeholder?: string
}

// ---------------------------------------------------------------------------
// App state
// ---------------------------------------------------------------------------

export interface AppState {
  user: User | null
  isLoading: boolean
  sidebarOpen: boolean
  activeToolId: string | null
}

export interface NavRoute {
  href: string
  label: string
  icon: string
  pro?: boolean
  badge?: string | number
}

// ---------------------------------------------------------------------------
// Stripe / subscription types
// ---------------------------------------------------------------------------

export type SubscriptionStatus =
  | 'active'
  | 'inactive'
  | 'past_due'
  | 'canceled'
  | 'trialing'
  | null

export interface StripePlan {
  id: string
  name: string
  priceId: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
}
