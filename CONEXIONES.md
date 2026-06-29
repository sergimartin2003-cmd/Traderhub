# Conexiones pendientes — Norte (TraderHub)

> La app está **terminada y compila** (`npm run build` ✓, 21 rutas, 0 warnings).
> Solo faltan las claves de servicios externos. Rellena `.env.local` (copia de `.env.example`)
> y, en producción, las mismas variables en Vercel.

---

## 1. Tabla de variables de entorno

Leyenda: **Obligatoria** = la app no funciona sin ella · **Recomendada** = funcionalidad
completa · **Opcional** = se puede dejar vacía (la app degrada con gracia).

| Variable | Servicio | Nivel | Dónde se obtiene |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | **Obligatoria** | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | **Obligatoria** | Supabase → Project Settings → API → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | **Obligatoria** | Supabase → Project Settings → API → `service_role` (¡secreta!) |
| `OPENROUTER_API_KEY` | OpenRouter | **Obligatoria** | openrouter.ai → Keys → Create Key (`sk-or-v1-...`) |
| `STRIPE_SECRET_KEY` | Stripe | **Recomendada** (pagos) | Stripe → Developers → API keys → Secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe | **Recomendada** (pagos) | Stripe → Developers → Webhooks → tu endpoint → Signing secret (`whsec_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe | **Recomendada** (pagos) | Stripe → Developers → API keys → Publishable key (`pk_test_...`) |
| `NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID` | Stripe | **Recomendada** (pagos) | Stripe → Products → Pro mensual → Price ID (`price_...`) |
| `NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID` | Stripe | **Recomendada** (pagos) | Stripe → Products → Pro anual → Price ID (`price_...`) |
| `RESEND_API_KEY` | Resend | Opcional (emails) | resend.com → API Keys (`re_...`) |
| `RESEND_FROM_EMAIL` | Resend | Opcional (emails) | Tu remitente verificado, ej. `Norte <hola@tudominio.com>` |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog | Opcional (analytics) | posthog.com → Project Settings (`phc_...`) |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog | Opcional (analytics) | `https://eu.i.posthog.com` o `https://us.i.posthog.com` |
| `NEXT_PUBLIC_APP_URL` | App | **Obligatoria** | `http://localhost:3000` en local · tu dominio en prod |

> Nota Stripe: el código usa los price IDs **con prefijo `NEXT_PUBLIC_`** (cliente).
> Las variables `STRIPE_MONTHLY_PRICE_ID` / `STRIPE_ANNUAL_PRICE_ID` sin prefijo del
> `.env.example` son legacy/no usadas por el flujo de checkout actual — puedes ignorarlas
> o ponerlas con el mismo valor.
>
> Nota Sentry: hay variables de Sentry en `.env.example` pero **no está cableado en el
> código** todavía. Déjalas vacías; no afectan.

---

## 2. Qué configurar en Supabase (paso a paso)

### 2.1 Crear el proyecto y copiar las claves
1. supabase.com → **New project** (elige región cercana, ej. `eu-west`).
2. Espera a que aprovisione → **Project Settings → API**. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (solo servidor, nunca al cliente)

### 2.2 Crear las tablas (correr la migración)
1. Supabase → **SQL Editor → New query**.
2. Pega **todo** el contenido de `supabase/migrations/001_initial_schema.sql`.
3. **Run**. Esto crea: `profiles`, `subscriptions`, `conversations`, `messages`,
   `projects`, `usage_tracking`, etc., con **RLS** (políticas por usuario) y el
   **trigger `handle_new_user`** que crea automáticamente `profile + subscription(free) +
   usage_tracking` al registrarse cada usuario.

### 2.3 Autenticación — Email
1. Supabase → **Authentication → Providers → Email**: actívalo.
2. (Dev) puedes desactivar "Confirm email" para probar rápido; (Prod) déjalo activo.

### 2.4 Autenticación — Google OAuth (opcional, el botón ya está en la UI)
1. Google Cloud Console → crea **OAuth Client ID** (tipo *Web application*).
2. Authorized redirect URI: `https://<TU-PROYECTO>.supabase.co/auth/v1/callback`.
3. Copia Client ID + Secret → Supabase → **Authentication → Providers → Google** → pega y activa.

### 2.5 URLs de redirección
Supabase → **Authentication → URL Configuration**:
- **Site URL**: `http://localhost:3000` (dev) / tu dominio (prod).
- **Redirect URLs** (añade ambas):
  - `http://localhost:3000/auth/callback`
  - `https://TU-DOMINIO/auth/callback`

> La app ya tiene el handler en `app/auth/callback/route.ts` y redirige a `/dashboard`.

---

## 3. Stripe (paso a paso)
1. Stripe → **Products** → crea producto "Norte Pro" con **dos precios**:
   - Recurrente **mensual** 19 € → copia su `price_...` → `NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID`
   - Recurrente **anual** 180 € → copia su `price_...` → `NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID`
2. **Developers → API keys**: copia Secret (`STRIPE_SECRET_KEY`) y Publishable (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
3. **Developers → Webhooks → Add endpoint**:
   - URL: `https://TU-DOMINIO/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`,
     `customer.subscription.deleted`, `invoice.payment_failed`
   - Copia el **Signing secret** → `STRIPE_WEBHOOK_SECRET`
4. En local, para probar webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
   (usa el `whsec_...` que imprime el CLI).

---

## 4. OpenRouter (IA)
1. openrouter.ai → **Keys → Create Key** → `OPENROUTER_API_KEY`.
2. Carga saldo o usa modelos free. Modelos configurados en `lib/openrouter/client.ts`:
   - Free: `google/gemini-flash-1.5`
   - Pro: `anthropic/claude-3-5-sonnet`

---

## 5. Comprobación final
```bash
cp .env.example .env.local   # y rellena los valores
npm install
npm run build                # debe terminar en ✓
npm run dev                  # http://localhost:3000
```
Flujo de humo: registrarse → entra a `/dashboard` → enviar mensaje en chat (IA real) →
usar una herramienta → guardar proyecto → `/upgrade` → checkout Stripe.

---

## 6. Pendientes menores (no bloquean)
- `public/og-image.png` y `public/manifest.json` están referenciados pero no existen
  (solo afectan a preview social / PWA; dan 404 silencioso).
- Sentry: dependencia instalada pero sin configurar (sin `sentry.*.config.ts`).
