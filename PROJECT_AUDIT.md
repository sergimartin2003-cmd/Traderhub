# Norte — Project Audit (Post-Migration)

> Auditoría: 2026-05-30 · Stack: Next.js 15 + Supabase + Stripe + OpenRouter

---

## EXECUTIVE SUMMARY

The Next.js migration is 85% complete. Authentication, database schema, AI streaming, and Stripe are all properly architected. However, there are **10 P0 critical blockers** that prevent the app from working end-to-end for real users. Most are simple wiring issues (missing pages, wrong paths, missing callbacks), not architectural problems.

---

## P0 — REQUIRED TO LAUNCH TODAY

### 1. `/upgrade` page missing
Every "Mejorar a Pro" CTA links to `/upgrade` → 404.
**Files:** Create `app/upgrade/page.tsx`

### 2. `/dashboard/billing` page missing
Stripe `success_url` and Customer Portal `return_url` redirect to `/dashboard/billing` → 404.
**Files:** Create `app/(dashboard)/billing/page.tsx`

### 3. Sidebar nav paths wrong (404s)
- `components/layout/sidebar.tsx:112` — "Herramientas" → `/tools` (should be `/dashboard/tools`)
- `components/layout/sidebar.tsx:113` — "Proyectos" → `/projects` (should be `/dashboard/projects`)
- `components/layout/sidebar.tsx:266` — Settings link → `/settings` (should be `/dashboard/settings`)

### 4. Sidebar conversations list always empty
`DashboardShell` never receives conversations. `app/(dashboard)/layout.tsx` doesn't fetch them. Sidebar always shows "Aún no hay conversaciones".
**Fix:** Fetch conversations in layout → pass to DashboardShell → pass to Sidebar.

### 5. New chat messages never persisted
`/dashboard/chat` renders ChatContainer without `conversationId`. Messages go to `/api/ai/chat` with no conversationId → nothing saved. No conversation created. Data lost on reload.
**Fix:** Add `onConversationCreate` callback. Auto-create on first message + update URL.

### 6. ToolView callbacks dead
`app/(dashboard)/tools/[tool]/page.tsx` renders `<ToolView toolId isPro />` with no callbacks. Back button, upgrade button, save project button — all dead.
**Fix:** Client wrapper component with `useRouter` and `createProject`.

### 7. `DELETE /api/user/projects/[id]` missing
`projects-client.tsx:25` calls `DELETE /api/user/projects/${id}` → 404. Projects cannot be deleted.
**Fix:** Create `app/api/user/projects/[id]/route.ts`.

### 8. Settings upgrade button broken
`settings-client.tsx:59` reads `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to decide the price ID logic → wrong. Falls back to `'price_monthly'` which is invalid.
**Fix:** Read `NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID` directly.

### 9. Projects "Ir a herramientas" wrong path
`projects-client.tsx:44` links to `/tools` → 404. Should be `/dashboard/tools`.

### 10. ChatContainer `onUpgrade` not wired in conversation page
`app/(dashboard)/chat/[id]/page.tsx` renders ChatContainer without `onUpgrade`. Rate-limited users see banner but can't click upgrade.
**Fix:** Add client wrapper for chat conversation page.

---

## P1 — IMPORTANT (fix within first week)

### 11. Welcome email never sent
`sendWelcomeEmail()` implemented in `lib/resend/client.ts` but never called. No welcome email on signup.
**Fix:** Call in `app/auth/callback/route.ts` for new users.

### 12. Stripe webhook doesn't send emails
Upgrade/cancellation transactional emails (`sendPremiumActivatedEmail`, `sendSubscriptionCancelledEmail`) exist but aren't called from the webhook.

### 13. Activity streak stat hardcoded
Dashboard shows "12 días" hardcoded. Should be computed from usage data.

### 14. Sentry not configured
`@sentry/nextjs` in devDependencies, never initialized. Zero error monitoring in production.

### 15. PostHog only tracks page views
SDK initialized but no custom events. No funnel data for signups, upgrades, AI usage.

### 16. Monthly usage counter never resets
`monthly_messages` increments forever. Only `daily_messages` resets. Need monthly reset logic.

### 17. Missing `/manifest.json`
Root layout references it but `public/manifest.json` doesn't exist. PWA broken.

### 18. Missing `/og-image.png`
OG meta tags reference `/og-image.png`. Social previews show broken image.

### 19. No sitemap or robots.txt
Zero SEO infrastructure despite landing page existing.

### 20. Supabase type `(supabase as any)` workarounds
Multiple files cast to `any` because `types/database.ts` is incomplete. Non-breaking but reduces type safety.

---

## P2 — FUTURE IMPROVEMENTS

- Dark mode toggle (CSS vars support it already)
- Conversation search (full-text PostgreSQL)
- Profile avatar upload (Supabase Storage)
- Conversation title auto-generation (short AI call)
- Export projects to PDF/Markdown
- Rate limiting on non-AI API routes
- E2E tests (Playwright)

---

## Implementation Order

```
P0:
1. Fix sidebar nav paths (trivial)
2. Fix settings upgrade button (trivial)
3. Fix projects link (trivial)
4. Create /api/user/projects/[id] route (low)
5. Create /upgrade page (medium)
6. Create /dashboard/billing page (low)
7. Fix layout: fetch conversations → sidebar (low)
8. Fix new chat: auto-create conversation + URL update (medium)
9. ToolView client wrapper (low)
10. Chat [id] page onUpgrade wiring (low)

P1:
11. Welcome email on signup (low)
12. Stripe webhook emails (low)
13. Monthly usage reset (trivial)
14. Sentry init (medium)
15. PostHog events (low)
16. manifest.json + sitemap + robots.txt (low)
```

---

## Architecture Status

| Component | Status | Notes |
|---|---|---|
| Auth (Supabase) | ✅ Working | Email + Google OAuth, middleware-protected |
| Database schema | ✅ Complete | 10 tables, RLS, triggers, indexes |
| AI streaming | ✅ Working | OpenRouter, SSE, rate limiting |
| Stripe checkout | ✅ Working | Needs /upgrade page wired |
| Stripe webhooks | ✅ Working | Subscription sync correct |
| Email (Resend) | ⚠️ Implemented, not triggered | Missing call sites |
| Sidebar nav | ❌ Wrong paths | 3 broken links |
| New chat persistence | ❌ Missing | No conversation created |
| Tool page | ❌ Callbacks missing | Back/save/upgrade dead |
| Upgrade page | ❌ Missing | 404 everywhere |
| Billing page | ❌ Missing | Stripe redirect 404 |
| Project delete | ❌ API route missing | 404 on delete |
| Sentry | ❌ Not configured | Zero error monitoring |
| Analytics events | ⚠️ SDK loaded only | No custom events |
