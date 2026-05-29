# Norte — Auditoría Técnica de Proyecto

> Auditoría realizada el 2026-05-29. Base: vanilla React 18 (CDN + Babel).

---

## RESUMEN EJECUTIVO

El proyecto actual es un **prototipo funcional** con diseño UI de producción pero sin ninguna infraestructura de backend real. Toda la persistencia es `localStorage`, la IA usa `window.claude.complete()` (fake), los pagos son simulados y no hay autenticación real.

**Estado actual:** MVP/demo → **Objetivo:** SaaS de producción

---

## P0 — IMPRESCINDIBLE PARA LANZAR

### P0-1: Autenticación real
- **Problema:** `auth.jsx` solo guarda `{name, email}` en localStorage. Cualquiera puede "registrarse" sin verificación.
- **Solución:** Supabase Auth (email/password + Google OAuth). Sesiones con cookies HTTP-only.
- **Archivos afectados:** `auth.jsx` (reemplazar completo), `store.jsx` (migrar signIn/signOut a Supabase)

### P0-2: Base de datos real
- **Problema:** Todo en `localStorage` con clave `"norte:v1"`. Datos perdidos al limpiar navegador. Sin multi-dispositivo. Sin escalabilidad.
- **Solución:** PostgreSQL en Supabase con RLS. 10 tablas con foreign keys e índices.
- **Tablas necesarias:** profiles, subscriptions, conversations, messages, projects, saved_prompts, usage_tracking, notifications, settings, feedback

### P0-3: IA real
- **Problema:** `ai.jsx` llama a `window.claude.complete()` que no existe en producción. Fallback es `chat-data.jsx` (respuestas hardcodeadas).
- **Solución:** OpenRouter API en route handler server-side seguro. Modelo gratuito: `google/gemini-flash-1.5`. Modelo Pro: `anthropic/claude-3-5-sonnet`.
- **Archivos afectados:** `ai.jsx` (reemplazar), `chat.jsx` (conectar a API real)

### P0-4: Rate limiting server-side
- **Problema:** `store.jsx` limita a 10 mensajes/día usando `state.usage` en localStorage. Cualquiera puede borrar el cache y obtener mensajes ilimitados gratis.
- **Solución:** `usage_tracking` table en PostgreSQL. API route verifica límite antes de llamar a IA. Reset diario automático.
- **Archivos afectados:** `store.jsx` `consume()`, nueva API route `/api/ai/chat`

### P0-5: Pagos reales
- **Problema:** `account.jsx` Checkout es un formulario de tarjeta falso que llama a `onSuccess()` directamente. Nadie paga nada.
- **Solución:** Stripe Checkout (hosted). Webhook actualiza `subscriptions` table. Feature gating basado en DB, no localStorage.
- **Archivos afectados:** `account.jsx` Checkout (reemplazar), nueva API route `/api/stripe/*`

### P0-6: Middleware de protección de rutas
- **Problema:** No existe. Cualquier URL del dashboard es accesible sin login.
- **Solución:** `middleware.ts` con Supabase SSR que protege `/dashboard/*`.

### P0-7: Variables de entorno
- **Problema:** No existe `.env`. Las claves API (cuando se añadan) estarían hardcodeadas.
- **Solución:** `.env.local` con todas las variables necesarias. `.env.example` para documentación.

### P0-8: Framework de producción
- **Problema:** Vanilla React con CDN + Babel sin bundler. Sin SSR, sin optimización, sin TypeScript, sin ESM. No desplegable en Vercel con build.
- **Solución:** Migrar a Next.js 15 App Router + TypeScript + Tailwind.

---

## P1 — IMPORTANTE PARA LAUNCH EXITOSO

### P1-1: Emails transaccionales
- **Problema:** No se envía ningún email (verificación, bienvenida, etc.)
- **Solución:** Resend con templates profesionales. Emails: verificación, bienvenida, premium activado, contraseña reseteada, suscripción cancelada.

### P1-2: OAuth Google
- **Problema:** Botón Google en `auth.jsx` no hace nada.
- **Solución:** Supabase Google OAuth con `app/auth/callback/route.ts`.

### P1-3: Analytics
- **Problema:** Sin visibilidad de uso, conversiones ni retención.
- **Solución:** PostHog. Eventos: signup, login, ai_message, tool_used, upgrade_clicked, upgrade_completed, churn.

### P1-4: Error tracking
- **Problema:** Sin monitorización de errores en producción.
- **Solución:** Sentry. Captura: frontend errors, API errors, auth errors, payment errors.

### P1-5: SEO básico
- **Problema:** Sin metadata, sin OG tags, sin sitemap.
- **Solución:** `metadata` en `app/layout.tsx` y `app/(marketing)/page.tsx`. `sitemap.ts` y `robots.ts`.

### P1-6: Onboarding persistido
- **Problema:** `auth.jsx` Onboarding guarda `{stage, business, goal}` en localStorage.
- **Solución:** Guardar en `profiles` table de Supabase. Server action en onboarding completion.

### P1-7: Stripe Customer Portal
- **Problema:** No hay forma de gestionar o cancelar suscripción.
- **Solución:** `/api/stripe/portal` route que crea sesión de Stripe Customer Portal.

### P1-8: Estado de carga y skeletons
- **Problema:** Sin loading states en consultas async.
- **Solución:** Skeleton components + Suspense boundaries en páginas con data fetching.

### P1-9: Manejo de errores UI
- **Problema:** Sin `error.tsx` en App Router. Errores causan pantalla en blanco.
- **Solución:** `error.tsx` en cada route group + React Error Boundaries.

---

## P2 — MEJORAS FUTURAS

### P2-1: Streaming real SSE
- **Actual:** `chat.jsx` simula streaming con animación de reveal carácter a carácter (14ms/char). Funciona bien visualmente pero no es streaming real.
- **Mejora:** Server-Sent Events desde `/api/ai/chat` con `ReadableStream`. Más rápido para respuestas largas.

### P2-2: Adjuntos de archivos
- **Actual:** `chat.jsx` muestra UI de attachments pero el procesamiento es fake.
- **Mejora:** Supabase Storage para subida. Parser de PDF/CSV/imagen antes de enviar a IA.

### P2-3: Exportación de proyectos
- **Actual:** Proyectos solo visibles en app.
- **Mejora:** Export a PDF (react-pdf), Markdown, JSON.

### P2-4: Tweaks Panel
- **Actual:** `tweaks-panel.jsx` es una UI de customización de tema muy completa (541 líneas) para modo debug/demo.
- **Mejora:** Migrar las settings de densidad/acento a la página de settings de usuario.

### P2-5: Internacionalización
- **Actual:** Solo español.
- **Mejora:** `next-intl` para soporte inglés/francés/portugués.

### P2-6: Búsqueda en conversaciones
- **Actual:** Sin búsqueda.
- **Mejora:** Búsqueda full-text PostgreSQL en `conversations.title` y `messages.content`.

### P2-7: Notificaciones push
- **Actual:** `notifications` table creada pero sin UI.
- **Mejora:** Web Push API o notificaciones in-app.

### P2-8: API pública
- **Actual:** Sin API externa.
- **Mejora:** API REST documentada con API keys para integración de terceros.

### P2-9: Tests
- **Actual:** Sin tests.
- **Mejora:** Vitest para unit tests. Playwright para E2E. Tests críticos: auth flow, Stripe webhook, rate limiting.

### P2-10: Modo oscuro
- **Actual:** Solo modo claro (aunque el diseño permite modo oscuro fácilmente).
- **Mejora:** `next-themes` para toggle dark/light mode.

---

## CÓDIGO MUERTO Y BUGS ENCONTRADOS

### Bugs críticos (bloquean producción)
1. **`ai.jsx:7-10`** — `window.claude.complete()` lanzará `TypeError` en producción. Toda la IA es no-funcional.
2. **`account.jsx:60-85`** — Formulario de pago completamente simulado. `onSuccess()` se llama sin ningún pago real.
3. **`store.jsx:25`** — `FREE_LIMIT = 10` verificado solo en cliente. Bypasseable con devtools.
4. **`auth.jsx:30-45`** — `signIn` solo guarda nombre en state. Sin verificación de credenciales.

### Código muerto
- `tweaks-panel.jsx` — 541 líneas de panel de configuración para desarrollo/demo. No conectado a ningún backend.
- `chat-data.jsx` — Respuestas hardcodeadas de IA. Debe moverse a test fixtures.
- `Norte.html` — Entry point CDN-based. Reemplazado por `app/layout.tsx`.

### Problemas de seguridad
- XSS posible: `chat-blocks.jsx` usa `dangerouslySetInnerHTML` en `RichText`. Necesita sanitización.
- No hay validación de inputs en formularios de auth.
- localStorage expone datos del usuario en texto plano.
- Sin CSRF protection en formularios.

### Problemas de escalabilidad
- `store.jsx` carga TODAS las conversaciones y mensajes en memoria (localStorage).
- Sin paginación en ninguna lista.
- Sin caching de queries a Supabase.

---

## DEPENDENCIAS ACTUALES vs. NECESARIAS

### Actuales (CDN, sin bundle)
```html
react@18.3.1 (CDN)
react-dom@18.3.1 (CDN)  
@babel/standalone (CDN, para JSX en browser)
Google Fonts (Schibsted Grotesk, JetBrains Mono)
```

### Necesarias para producción
```
next@15.x
react@19.x
typescript@5.x
tailwindcss@4.x
@supabase/supabase-js@2.x
@supabase/ssr@0.x
stripe@17.x
@stripe/stripe-js@5.x
openai@4.x (OpenRouter client)
resend@4.x
posthog-js@1.x
posthog-node@4.x
@sentry/nextjs@8.x
zustand@5.x
zod@3.x
sonner@1.x (toasts)
next-themes@0.x
lucide-react@0.x
```

---

## ARQUITECTURA OBJETIVO

```
Norte (TraderHub)
├── app/
│   ├── (marketing)/          # Landing page pública
│   ├── (auth)/               # Login, registro, recuperación
│   ├── (app)/                # Dashboard protegido
│   │   ├── dashboard/        # Home con stats, tools, recientes
│   │   ├── chat/[id]/        # Chat con IA
│   │   ├── tools/[id]/       # Herramientas de negocio
│   │   ├── projects/         # Proyectos guardados
│   │   ├── settings/         # Perfil y configuración
│   │   └── onboarding/       # Flujo inicial nuevo usuario
│   ├── api/
│   │   ├── ai/chat/          # Proxy OpenRouter + rate limiting
│   │   ├── stripe/           # checkout, webhook, portal
│   │   └── user/             # profile, usage
│   └── auth/callback/        # OAuth redirect handler
├── components/
│   ├── ui/                   # Primitivas: Button, Badge, Card...
│   ├── chat/                 # ChatContainer, blocks, input
│   ├── dashboard/            # DashboardHome, ToolCard, StatCard
│   ├── tools/                # ToolView
│   ├── layout/               # Sidebar, MobileNav, Header
│   ├── landing/              # Hero, Features, Pricing, FAQ
│   ├── auth/                 # LoginForm, RegisterForm, Onboarding
│   └── account/              # Settings, CheckoutModal, Subscription
├── lib/
│   ├── supabase/             # client.ts, server.ts, middleware.ts, admin.ts
│   ├── stripe/               # client.ts, server.ts
│   ├── openrouter/           # client.ts
│   ├── resend/               # client.ts, templates.tsx
│   ├── constants.ts          # TOOLS, ACCENTS, PLANS, FREE_LIMIT
│   └── utils.ts              # cn(), formatDate(), truncate()
├── hooks/
│   ├── use-user.ts           # Auth state + profile
│   ├── use-chat.ts           # Chat messages con realtime
│   ├── use-subscription.ts   # Plan + billing
│   └── use-usage.ts          # Rate limit tracking
├── store/
│   ├── app-store.ts          # Zustand: profile, settings
│   └── chat-store.ts         # Zustand: conversations cache
├── types/
│   ├── database.ts           # Tipos generados de Supabase
│   └── index.ts              # Tipos de dominio de la app
├── actions/
│   ├── auth.ts               # Server actions: signIn, signUp, signOut
│   ├── chat.ts               # createConversation, saveMessage
│   ├── projects.ts           # createProject, deleteProject
│   └── subscription.ts       # getSubscription, isPro, incrementUsage
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── middleware.ts             # Auth protection + session refresh
├── .env.example
└── SETUP.md
```

---

## MÉTRICAS DE MIGRACIÓN

| Categoría | Antes | Después |
|---|---|---|
| Persistencia | localStorage | PostgreSQL (Supabase) |
| Autenticación | Fake (nombre guardado) | Real (email/password + Google OAuth) |
| IA | window.claude.complete() (fake) | OpenRouter API (real, streaming) |
| Pagos | Formulario simulado | Stripe Checkout (hosted) |
| Rate limiting | Cliente (bypasseable) | Servidor (PostgreSQL) |
| Bundle | CDN scripts | Next.js optimizado |
| TypeScript | No | Sí (100%) |
| Tests | No | Vitest + Playwright (P2) |
| Monitoring | No | PostHog + Sentry |
| Emails | No | Resend |
| Deploy | No configurado | Vercel |
| SEO | Básico | Metadata + OG + Sitemap |
| Seguridad | Ninguna | RLS + Zod + CSRF + rate limiting |
