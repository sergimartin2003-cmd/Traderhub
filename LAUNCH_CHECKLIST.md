# Launch Checklist — Norte

## Auth
- ✅ Register (email/password) — `actions/auth.ts` → `supabase.auth.signUp`
- ✅ Login (email/password) — `app/(auth)/login/page.tsx` → `supabase.auth.signInWithPassword`
- ✅ Logout — `actions/auth.ts` → `signOut` action bound to settings form
- ✅ Session persistence — `lib/supabase/middleware.ts` refreshes session on every request
- ✅ Forgot password — `actions/auth.ts` → `resetPasswordForEmail`
- ✅ Reset password — `app/(auth)/reset-password/page.tsx` → `updateUser`
- ✅ Google OAuth — `actions/auth.ts` + `app/(auth)/login/page.tsx` client-side
- ❌ Discord OAuth — **not implemented** (no provider configured)
- ✅ OAuth callback — `app/auth/callback/route.ts` exchanges code for session
- ✅ Protected routes — middleware redirects unauthenticated users to `/login`
- ✅ Auth pages redirect logged-in users to `/dashboard`

## Middleware
- ✅ All dashboard routes protected: `/dashboard`, `/chat`, `/projects`, `/settings`, `/tools`, `/upgrade`
- ✅ Auth pages redirect authenticated users away
- ✅ SSR session refresh on every request

## Database
- ✅ Single migration file `supabase/migrations/001_initial_schema.sql`
- ✅ Tables: profiles, subscriptions, conversations, messages, projects, saved_prompts, usage_tracking, notifications, settings, feedback
- ✅ Indexes on all foreign key columns
- ✅ Foreign keys with `ON DELETE CASCADE`
- ✅ RLS enabled on all tables — `user_id = auth.uid()` policies
- ✅ `handle_new_user()` trigger: auto-creates profile, subscription, usage_tracking, settings on signup
- ✅ `handle_updated_at()` trigger on tables with `updated_at`
- ❌ RLS policies for service-role bypass not tested — webhook uses service role key (bypasses RLS by design)

## AI System
- ✅ OpenRouter client — `lib/openrouter/client.ts` (OpenAI-compatible SDK)
- ✅ Streaming — `streamChat()` generator + SSE format in `/api/ai/chat`
- ✅ Model switching — free: `google/gemini-flash-1.5`, pro: `anthropic/claude-3-5-sonnet`
- ✅ Free vs premium logic — plan check in `/api/ai/chat` route
- ✅ Rate limit server-side enforcement — checked before streaming, returns 429
- ✅ Chat persistence — saves user + assistant messages post-stream if `conversationId` provided
- ✅ Context persistence — `context` field in conversation, sent as system prompt
- ❌ Retry logic on OpenRouter failure — no automatic retry (fails loudly)
- ❌ Timeout handling — no AbortController/timeout on OpenRouter calls
- ✅ Error surface to client — stream sends `{ error: '...' }` event on failure

## Conversations
- ✅ Create conversation — `actions/chat.ts` → `createConversation`
- ✅ Save messages — post-stream insert in `/api/ai/chat`
- ✅ Restore history — `app/(dashboard)/chat/[id]/page.tsx` fetches messages server-side
- ✅ Multi-session persistence — messages stored in DB with `conversation_id`
- ✅ Delete conversation — `actions/chat.ts` → `deleteConversation` (with ownership check)
- ✅ Update title — `actions/chat.ts` → `updateConversationTitle`
- ✅ Realtime new messages — `hooks/use-chat.ts` subscribes to Supabase Realtime

## Usage Limits
- ✅ Server-side enforcement — checked in `/api/ai/chat` before streaming
- ✅ Free: 10 messages/day (`FREE_DAILY_LIMIT` in constants)
- ✅ No client-side bypass possible — limit check happens in API route
- ✅ Daily reset — compares `last_reset` date vs today, resets counter on new day
- ✅ Pro users: unlimited (skips limit check)
- ❌ Usage reset on `GET /api/user/usage` side-effect — resets DB on read (acceptable but not ideal)

## Stripe
- ✅ Checkout — `/api/stripe/checkout` creates Stripe session; accepts `plan: 'monthly'|'annual'`
- ✅ Price IDs resolved server-side — no client env vars needed (`STRIPE_MONTHLY_PRICE_ID`, `STRIPE_ANNUAL_PRICE_ID`)
- ✅ Webhook — `/api/stripe/webhook` validates signature, handles 4 events
- ✅ Premium activation — `checkout.session.completed` upserts `plan: 'pro', status: 'active'`
- ✅ Subscription update — `customer.subscription.updated` syncs status + period end
- ✅ Downgrade/cancellation — `customer.subscription.deleted` resets to free
- ✅ Payment failed — `invoice.payment_failed` sets `past_due`
- ✅ Customer portal — `/api/stripe/portal` returns portal URL, returns to `/settings`
- ✅ Success URL → `/settings?upgraded=true`
- ❌ Webhook idempotency — no deduplication (Stripe retries could double-process)
- ❌ No email sent on upgrade/cancel (Resend client exists but not triggered by webhook)

## Emails (Resend)
- ✅ Resend client configured — `lib/resend/client.ts`
- ✅ Welcome email template — `sendWelcomeEmail`
- ✅ Password reset email — `sendPasswordResetEmail`
- ✅ Premium activated email — `sendPremiumActivatedEmail`
- ✅ Subscription cancelled email — `sendSubscriptionCancelledEmail`
- ❌ Emails not triggered — none of the send functions are called in auth or webhook flows
- ❌ `RESEND_API_KEY` and `RESEND_FROM_EMAIL` must be configured

## Dashboard
- ✅ `/dashboard` — home page with chat composer, tools grid, recent convs/projects
- ✅ `/chat` — new conversation
- ✅ `/chat/[id]` — existing conversation with history
- ✅ `/tools` — tools listing
- ✅ `/tools/[tool]` — individual tool with form + AI generation
- ✅ `/projects` — saved projects with delete
- ✅ `/settings` — profile edit + subscription management + sign out
- ✅ `/upgrade` — upgrade page with monthly/annual toggle
- ✅ Sidebar shows recent conversations (fetched in layout)
- ✅ Tool back button navigates to `/tools`
- ✅ Tool upgrade button navigates to `/upgrade`
- ✅ All nav links correct (no broken `/dashboard/chat` prefixes)
- ❌ `ToolView` does not save projects to DB (no `onSaveProject` handler wired up)
- ❌ Chat — new chat doesn't auto-create a conversation record (only saves if `conversationId` provided)

## API Routes
- ✅ `POST /api/ai/chat` — streaming chat, usage enforcement
- ✅ `POST /api/stripe/checkout` — create checkout session
- ✅ `POST /api/stripe/portal` — customer portal
- ✅ `POST /api/stripe/webhook` — webhook handler
- ✅ `GET /api/user/profile` — get profile
- ✅ `PATCH /api/user/profile` — update profile (name, bio, etc.)
- ✅ `GET /api/user/usage` — get daily/monthly usage stats
- ✅ `GET /auth/callback` — OAuth code exchange

## Security
- ✅ All API routes check `supabase.auth.getUser()` before processing
- ✅ RLS on all tables — data isolation per user
- ✅ Stripe webhook signature verification
- ✅ Zod validation on all API request bodies
- ✅ CSRF via SameSite cookies (Supabase default)
- ✅ Security headers — X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- ✅ Admin client (`SUPABASE_SERVICE_ROLE_KEY`) only used in server-only files
- ❌ No rate limiting on auth endpoints (brute force risk)
- ❌ No CAPTCHA on register

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENROUTER_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_MONTHLY_PRICE_ID
STRIPE_ANNUAL_PRICE_ID
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_POSTHOG_KEY       (optional — analytics)
NEXT_PUBLIC_POSTHOG_HOST      (optional)
```

## Analytics
- ✅ PostHog client configured — `app/providers.tsx`
- ✅ Graceful no-op when `NEXT_PUBLIC_POSTHOG_KEY` not set
- ❌ No custom events tracked (page views are manual)

## SEO
- ✅ Root metadata — title, description, OG tags, Twitter card
- ✅ `viewport` export with `themeColor`
- ✅ `manifest.json` referenced (file must exist in `/public`)
- ✅ Robots: index + follow
- ❌ `public/manifest.json` — must be created
- ❌ `public/og-image.png` — must be created

## Performance
- ✅ Server components for all data-fetching pages
- ✅ Parallel data fetching with `Promise.all`
- ✅ Streaming AI responses (SSE)
- ✅ Next.js 15 + Turbopack build

## Mobile
- ✅ Mobile-responsive layout with hidden sidebar + bottom nav bar
- ✅ Mobile header with new-chat button
- ✅ Auth pages hide the aside panel on small screens
- ❌ Safe area insets only on bottom nav (iOS notch support)

## Deploy
- ✅ `next.config.ts` — image domains, security headers, server actions config
- ❌ Vercel/Railway environment variables not configured
- ❌ Supabase production project not confirmed
- ❌ Stripe webhook endpoint registered in Stripe dashboard
- ❌ `public/manifest.json` missing
- ❌ `public/og-image.png` missing

## Monitoring
- ✅ `@sentry/nextjs` in devDependencies
- ❌ Sentry not initialized (`sentry.client.config.ts` / `sentry.server.config.ts` missing)
- ❌ No uptime monitoring configured
