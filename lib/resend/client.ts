import { Resend } from 'resend'
import {
  WelcomeEmail,
  PremiumActivatedEmail,
  SubscriptionCancelledEmail,
} from './templates'

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL ?? 'Norte <hello@norte.ai>'

// ---------------------------------------------------------------------------
// Email senders
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(email: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `Bienvenido a Norte, ${name} 🚀`,
    html: WelcomeEmail({ name }),
  })
}

export async function sendVerificationEmail(
  email: string,
  verificationUrl: string
) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verifica tu cuenta en Norte',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;">
        <h1 style="color:#10B981;margin-bottom:8px;">Norte</h1>
        <h2 style="color:#111827;margin-bottom:16px;">Verifica tu correo electrónico</h2>
        <p style="color:#374151;margin-bottom:24px;">
          Haz clic en el botón de abajo para verificar tu dirección de correo electrónico y activar tu cuenta.
        </p>
        <a href="${verificationUrl}"
           style="display:inline-block;background:#10B981;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;">
          Verificar cuenta
        </a>
        <p style="color:#6B7280;margin-top:24px;font-size:13px;">
          Si no creaste esta cuenta, puedes ignorar este correo.
        </p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Restablecer contraseña — Norte',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;">
        <h1 style="color:#10B981;margin-bottom:8px;">Norte</h1>
        <h2 style="color:#111827;margin-bottom:16px;">Restablecer contraseña</h2>
        <p style="color:#374151;margin-bottom:24px;">
          Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para continuar.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;background:#10B981;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;">
          Restablecer contraseña
        </a>
        <p style="color:#6B7280;margin-top:24px;font-size:13px;">
          Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este correo.
        </p>
      </div>
    `,
  })
}

export async function sendPremiumActivatedEmail(email: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: '¡Tu suscripción Pro está activa! — Norte',
    html: PremiumActivatedEmail({ name }),
  })
}

export async function sendSubscriptionCancelledEmail(
  email: string,
  name: string
) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Tu suscripción ha sido cancelada — Norte',
    html: SubscriptionCancelledEmail({ name }),
  })
}
