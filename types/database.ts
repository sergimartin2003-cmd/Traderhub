// Supabase database types — mirrors the PostgreSQL schema in supabase/migrations/001_initial_schema.sql

export interface Profile {
  id: string
  email: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  trading_style: string | null
  country: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan: 'free' | 'pro'
  status: 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing' | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  current_period_end: string | null
  created_at: string
}

export interface Conversation {
  id: string
  user_id: string
  title: string
  context: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model: string | null
  tokens: number | null
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  type: string
  data_json: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface SavedPrompt {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
}

export interface UsageTracking {
  id: string
  user_id: string
  daily_messages: number
  monthly_messages: number
  total_messages: number
  last_reset: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  read: boolean
  created_at: string
}

export interface Settings {
  id: string
  user_id: string
  theme: 'light' | 'dark' | 'system'
  language: string
  ai_personality: string
  accent: string
  density: 'compact' | 'regular' | 'comfortable'
  created_at: string
}

export interface Feedback {
  id: string
  user_id: string
  rating: number
  message: string | null
  created_at: string
}

// ---------------------------------------------------------------------------
// Supabase-style Database type
// ---------------------------------------------------------------------------

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & Pick<Profile, 'id' | 'email'>
        Update: Partial<Profile>
        Relationships: []
      }
      subscriptions: {
        Row: Subscription
        Insert: Partial<Subscription> & Pick<Subscription, 'user_id'>
        Update: Partial<Subscription>
        Relationships: []
      }
      conversations: {
        Row: Conversation
        Insert: Partial<Conversation> & Pick<Conversation, 'user_id' | 'title'>
        Update: Partial<Conversation>
        Relationships: []
      }
      messages: {
        Row: Message
        Insert: Partial<Message> & Pick<Message, 'conversation_id' | 'role' | 'content'>
        Update: Partial<Message>
        Relationships: []
      }
      projects: {
        Row: Project
        Insert: Partial<Project> & Pick<Project, 'user_id' | 'title' | 'type'>
        Update: Partial<Project>
        Relationships: []
      }
      saved_prompts: {
        Row: SavedPrompt
        Insert: Partial<SavedPrompt> & Pick<SavedPrompt, 'user_id' | 'title' | 'content'>
        Update: Partial<SavedPrompt>
        Relationships: []
      }
      usage_tracking: {
        Row: UsageTracking
        Insert: Partial<UsageTracking> & Pick<UsageTracking, 'user_id'>
        Update: Partial<UsageTracking>
        Relationships: []
      }
      notifications: {
        Row: Notification
        Insert: Partial<Notification> & Pick<Notification, 'user_id' | 'title' | 'body'>
        Update: Partial<Notification>
        Relationships: []
      }
      settings: {
        Row: Settings
        Insert: Partial<Settings> & Pick<Settings, 'user_id'>
        Update: Partial<Settings>
        Relationships: []
      }
      feedback: {
        Row: Feedback
        Insert: Partial<Feedback> & Pick<Feedback, 'user_id' | 'rating'>
        Update: Partial<Feedback>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
