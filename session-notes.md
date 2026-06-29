# Session notes — 2026-06-29

## Contexto del proyecto
Norte (TraderHub): SaaS Next.js 15 (App Router, TS, Tailwind v4) — copiloto IA para
emprendedores. Supabase (auth + DB + RLS), OpenRouter (IA stream), Stripe (pagos),
Resend/PostHog/Sentry. Estado: app completa y funcional, faltan solo conexiones (claves).

## Decisiones tomadas esta sesión
- Routing unificado bajo `/dashboard/*`: movido route group `(dashboard)` → segmento real
  `dashboard` (eliminaba conflicto de `/` con la landing y enlaces rotos).
- ChatContainer ahora autosuficiente: crea conversación en el primer mensaje (persiste
  historial) y navega a `/upgrade` sin depender de props del server component.
- ToolView autosuficiente: back/upgrade vía router, guardar proyecto vía `createProject`.
- projects-client usa server action `deleteProject` (no existía la API route).
- Nueva página `/upgrade` (pricing + Stripe checkout), protegida por middleware.
- `themeColor` movido de `metadata` a `viewport` export (warnings Next 15).

## Archivos modificados
- app/dashboard/** (renombrado desde app/(dashboard)/**), app/dashboard/chat/page.tsx (import FREE_DAILY_LIMIT)
- app/upgrade/page.tsx (nuevo)
- app/layout.tsx (viewport export)
- components/chat/chat-container.tsx, components/tools/tool-view.tsx
- components/layout/sidebar.tsx, mobile-nav.tsx
- app/dashboard/projects/projects-client.tsx, app/dashboard/tools/[tool]/page.tsx
- lib/supabase/middleware.ts (PROTECTED_PATHS = ['/dashboard','/upgrade'])

## Próximos pasos (solo conexiones)
1. Crear proyecto Supabase, correr supabase/migrations/001_initial_schema.sql, rellenar URL+keys.
2. OpenRouter API key.
3. Stripe: productos/precios (monthly+annual), webhook secret, configurar endpoint /api/stripe/webhook.
4. (Opcional) Resend (dominio), PostHog, Sentry.
5. Rellenar .env.local desde .env.example y desplegar en Vercel.

## Notas técnicas importantes
- `[cmd]` npm run build → ✓ Compiled successfully, 21/21 páginas, sin warnings.
- App degrada con gracia sin claves (proxies lazy en clientes, guards en providers).
- Trigger handle_new_user crea profile+subscription+usage al registrarse; RLS por usuario.

---
