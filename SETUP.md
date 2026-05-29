# Norte — Guía de Configuración

## Requisitos previos
- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [OpenRouter](https://openrouter.ai)
- Cuenta en [Stripe](https://stripe.com)
- Cuenta en [Resend](https://resend.com)
- Cuenta en [PostHog](https://posthog.com)
- Cuenta en [Sentry](https://sentry.io)
- Cuenta en [Vercel](https://vercel.com)

---

## 1. Instalación

```bash
git clone https://github.com/tu-usuario/traderhub
cd traderhub
npm install
cp .env.example .env.local
```

---

## 2. Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **Settings → API** y copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

3. Ve al **SQL Editor** y ejecuta el contenido completo de:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
   Esto crea todas las tablas, RLS policies, índices y el trigger de nuevo usuario.

4. **Google OAuth** (opcional pero recomendado):
   - Ve a **Authentication → Providers → Google**
   - Actívalo y configura credenciales OAuth de [Google Cloud Console](https://console.cloud.google.com)
   - URL de callback: `https://tu-proyecto.supabase.co/auth/v1/callback`

5. En **Authentication → URL Configuration** añade:
   - `http://localhost:3000/auth/callback` (desarrollo)
   - `https://tu-dominio.vercel.app/auth/callback` (producción)

---

## 3. OpenRouter (IA)

1. Crea cuenta en [openrouter.ai](https://openrouter.ai)
2. Ve a **Keys** y genera una API key
3. Añade al `.env.local`:
   ```
   OPENROUTER_API_KEY=sk-or-v1-...
   ```

**Modelos usados:**
- Usuarios gratuitos: `google/gemini-flash-1.5` (gratis)
- Usuarios Pro: `anthropic/claude-3-5-sonnet` (requiere créditos)

---

## 4. Stripe (Pagos)

1. Crea cuenta en [stripe.com](https://stripe.com)
2. En el **Dashboard → Products**, crea dos productos:
   - **Norte Pro Mensual**: €19/mes (recurring, monthly)
   - **Norte Pro Anual**: €180/año (recurring, yearly)
3. Copia los **Price IDs** de cada producto

4. Ve a **Developers → API keys** y copia:
   - **Secret key** → `STRIPE_SECRET_KEY`
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

5. **Webhook local** (desarrollo):
   ```bash
   npm install -g stripe
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copia el `whsec_...` que aparece → `STRIPE_WEBHOOK_SECRET`

6. **Webhook producción**:
   - Ve a **Developers → Webhooks → Add endpoint**
   - URL: `https://tu-dominio.vercel.app/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## 5. Resend (Emails)

1. Crea cuenta en [resend.com](https://resend.com)
2. Verifica tu dominio en **Domains**
3. Crea API key en **API Keys**
4. Añade al `.env.local`:
   ```
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=Norte <hola@tudominio.com>
   ```

---

## 6. PostHog (Analytics)

1. Crea proyecto en [posthog.com](https://posthog.com)
2. Copia **Project API Key** y **Host**
3. Añade al `.env.local`:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_...
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

**Eventos trackeados:**
- `signup` — nuevo registro
- `login` — inicio de sesión
- `ai_message_sent` — mensaje enviado a la IA
- `tool_used` — herramienta utilizada
- `upgrade_clicked` — clic en upgrade
- `upgrade_completed` — pago completado

---

## 7. Sentry (Error Tracking)

1. Crea proyecto **Next.js** en [sentry.io](https://sentry.io)
2. Añade al `.env.local`:
   ```
   SENTRY_AUTH_TOKEN=sntrys_...
   NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
   ```

---

## 8. Desarrollo local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

**Orden de configuración recomendado:**
1. Supabase (auth + DB) — obligatorio
2. OpenRouter — para que la IA funcione
3. Stripe — para pagos (puedes saltarlo en dev)
4. Resend, PostHog, Sentry — opcionales en dev

---

## 9. Deploy en Vercel

1. Sube el código a GitHub
2. Importa el repositorio en [vercel.com](https://vercel.com)
3. En **Environment Variables**, añade todas las variables de `.env.example`
4. `NEXT_PUBLIC_APP_URL` = tu URL de Vercel (ej: `https://norte.vercel.app`)
5. Actualiza la URL del webhook de Stripe a tu URL de producción
6. Añade la URL de producción a Supabase **Authentication → URL Configuration**

---

## Variables de entorno completas

Ver `.env.example` para la lista completa de variables necesarias.

---

## Estructura del proyecto

```
app/
  (auth)/login, register, forgot-password, reset-password
  (dashboard)/page, chat, tools, projects, settings
  api/ai/chat, stripe/*, user/*
  auth/callback (OAuth)
components/
  ui/ (Button, Badge, Card, Avatar, Logo, Modal...)
  chat/ (ChatContainer, ChatInput, ChatBlocks...)
  dashboard/ (DashboardHome, StatCard, ToolCard)
  tools/ (ToolView)
  layout/ (Sidebar, MobileNav, DashboardShell)
  account/ (CheckoutModal, SettingsForm...)
lib/
  supabase/ (client, server, middleware, admin)
  stripe/ (client, server)
  openrouter/ (client)
  resend/ (client, templates)
actions/ (auth, chat, projects, subscription)
hooks/ (use-user, use-chat, use-usage, use-subscription)
store/ (app-store, chat-store)
types/ (database, index)
supabase/migrations/001_initial_schema.sql
```
