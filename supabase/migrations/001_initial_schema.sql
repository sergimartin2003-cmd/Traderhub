-- =============================================================================
-- Norte (TraderHub) — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- =============================================================================

-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- TABLES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id              uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text        NOT NULL,
  username        text        UNIQUE,
  full_name       text,
  avatar_url      text,
  bio             text,
  trading_style   text,
  country         text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- subscriptions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                    text        NOT NULL DEFAULT 'free',
  status                  text,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  current_period_end      timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- conversations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  context     text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  uuid        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role             text        NOT NULL,
  content          text        NOT NULL,
  model            text,
  tokens           integer,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  type        text        NOT NULL,
  data_json   jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- saved_prompts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_prompts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  content     text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- usage_tracking
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usage_tracking (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_messages    integer     NOT NULL DEFAULT 0,
  monthly_messages  integer     NOT NULL DEFAULT 0,
  total_messages    integer     NOT NULL DEFAULT 0,
  last_reset        date        NOT NULL DEFAULT current_date,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  body        text        NOT NULL,
  read        boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme           text        NOT NULL DEFAULT 'light',
  language        text        NOT NULL DEFAULT 'es',
  ai_personality  text        NOT NULL DEFAULT 'estratega',
  accent          text        NOT NULL DEFAULT 'esmeralda',
  density         text        NOT NULL DEFAULT 'regular',
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- feedback
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feedback (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating      integer     NOT NULL,
  message     text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id     ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id     ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id  ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id          ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_prompts_user_id     ON saved_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id     ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id          ON feedback(user_id);

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================================

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables that have updated_at
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trg_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trg_usage_tracking_updated_at
  BEFORE UPDATE ON usage_tracking
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- =============================================================================
-- NEW USER BOOTSTRAP TRIGGER
-- Automatically creates profile, subscription, usage_tracking, and settings
-- rows when a new user signs up via Supabase Auth.
-- =============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Profile row
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Default free subscription
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT DO NOTHING;

  -- Usage counter
  INSERT INTO public.usage_tracking (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Default UI settings
  INSERT INTO public.settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists (idempotent re-runs)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_prompts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking  ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback        ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- profiles policies
-- ---------------------------------------------------------------------------
CREATE POLICY "profiles: select own"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles: insert own"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles: update own"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "profiles: delete own"
  ON profiles FOR DELETE
  USING (id = auth.uid());

-- ---------------------------------------------------------------------------
-- subscriptions policies
-- ---------------------------------------------------------------------------
CREATE POLICY "subscriptions: select own"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "subscriptions: insert own"
  ON subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "subscriptions: update own"
  ON subscriptions FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "subscriptions: delete own"
  ON subscriptions FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- conversations policies
-- ---------------------------------------------------------------------------
CREATE POLICY "conversations: select own"
  ON conversations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "conversations: insert own"
  ON conversations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "conversations: update own"
  ON conversations FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "conversations: delete own"
  ON conversations FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- messages policies (access via conversation ownership)
-- ---------------------------------------------------------------------------
CREATE POLICY "messages: select own"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "messages: insert own"
  ON messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "messages: update own"
  ON messages FOR UPDATE
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "messages: delete own"
  ON messages FOR DELETE
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- projects policies
-- ---------------------------------------------------------------------------
CREATE POLICY "projects: select own"
  ON projects FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "projects: insert own"
  ON projects FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "projects: update own"
  ON projects FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "projects: delete own"
  ON projects FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- saved_prompts policies
-- ---------------------------------------------------------------------------
CREATE POLICY "saved_prompts: select own"
  ON saved_prompts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "saved_prompts: insert own"
  ON saved_prompts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_prompts: update own"
  ON saved_prompts FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "saved_prompts: delete own"
  ON saved_prompts FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- usage_tracking policies
-- ---------------------------------------------------------------------------
CREATE POLICY "usage_tracking: select own"
  ON usage_tracking FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "usage_tracking: insert own"
  ON usage_tracking FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "usage_tracking: update own"
  ON usage_tracking FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "usage_tracking: delete own"
  ON usage_tracking FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- notifications policies
-- ---------------------------------------------------------------------------
CREATE POLICY "notifications: select own"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications: insert own"
  ON notifications FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "notifications: update own"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "notifications: delete own"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- settings policies
-- ---------------------------------------------------------------------------
CREATE POLICY "settings: select own"
  ON settings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "settings: insert own"
  ON settings FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "settings: update own"
  ON settings FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "settings: delete own"
  ON settings FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- feedback policies
-- ---------------------------------------------------------------------------
CREATE POLICY "feedback: select own"
  ON feedback FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "feedback: insert own"
  ON feedback FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "feedback: update own"
  ON feedback FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "feedback: delete own"
  ON feedback FOR DELETE
  USING (user_id = auth.uid());
