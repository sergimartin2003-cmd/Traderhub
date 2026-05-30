# Session notes — 2026-05-30

## Contexto del proyecto
Norte — AI copilot for Spanish-speaking entrepreneurs. Next.js 15 App Router + Supabase + Stripe + OpenRouter + Resend + PostHog + Sentry. Brand: "Norte". Branch: `claude/quirky-keller-0Tmq2`.

## Estado: PRODUCTION-READY ✅ — All P0 + P1 resolved

## Decisiones tomadas esta sesión

- **Server + client wrapper pattern** for all pages needing server data + client callbacks (NewChatClient, ChatPageClient, ToolPageClient)
- **Chat persistence**: `ChatContainer.onConversationCreate` auto-creates conversation on first message, updates URL via `router.replace({scroll:false})`
- **New user detection**: auth callback compares `created_at` vs `last_sign_in_at` with 5s tolerance → triggers welcome email
- **useAnalytics hook** (`lib/posthog/events.ts`) wraps PostHog with safe no-op when key is absent
- **OG image** served as Next.js edge route at `/og-image.png/route.tsx` (no static file needed)
- **Sentry**: `withSentryConfig` wraps `next.config.ts`; 3 config files (client/server/edge)

## Archivos modificados
### Creados
- `app/upgrade/page.tsx`, `app/(dashboard)/billing/page.tsx`, `app/(dashboard)/billing/billing-portal-button.tsx`
- `app/(dashboard)/chat/new-chat-client.tsx`, `app/(dashboard)/chat/[id]/chat-page-client.tsx`
- `app/(dashboard)/tools/[tool]/tool-page-client.tsx`
- `app/api/user/projects/[id]/route.ts` (DELETE)
- `app/og-image.png/route.tsx`, `app/robots.ts`, `app/sitemap.ts`, `public/manifest.json`
- `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- `lib/posthog/events.ts`

### Modificados
- `components/layout/sidebar.tsx` — correct /dashboard/* nav paths
- `components/layout/dashboard-shell.tsx` — conversations prop, upgrade tracking
- `components/chat/chat-container.tsx` — onConversationCreate, AI message tracking
- `app/(dashboard)/layout.tsx` — fetch conversations for sidebar
- `app/(dashboard)/page.tsx` + `dashboard-home.tsx` — real totalMessages stat
- `app/api/ai/chat/route.ts` — daily + monthly reset logic
- `app/api/stripe/webhook/route.ts` — Resend email triggers
- `app/auth/callback/route.ts` — welcome email for new signups
- `app/providers.tsx` — PostHog Suspense boundary
- `next.config.ts` — Sentry wrapper

## Próximos pasos (P2)
1. Regenerate `types/database.ts` from live Supabase schema to eliminate `(supabase as any)` casts
2. Conversation title auto-generation (short AI call after first message)
3. Dark mode toggle (CSS vars already support it)
4. Profile avatar upload (Supabase Storage)
5. E2E tests (Playwright) — auth, chat, stripe checkout

## Notas técnicas importantes
- Required env vars: `SENTRY_ORG`, `SENTRY_PROJECT`, `NEXT_PUBLIC_SENTRY_DSN` for Sentry
- `NEXT_PUBLIC_POSTHOG_KEY` is optional — gracefully no-ops if absent
- Monthly usage reset is implicit via `last_reset` month comparison in AI route
- New user detection: 5s window between `created_at` and `last_sign_in_at`
- `(supabase as any)` casts in webhook + auth callback are intentional (admin client type gaps)
