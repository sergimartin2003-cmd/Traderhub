// Email templates for Norte (TraderHub)
// These return HTML strings used by Resend email sending functions.
// Colors: #10B981 (emerald accent), #111827 (heading), #374151 (body), #6B7280 (muted)

const baseWrapper = (content: string) => `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;background:#ffffff;">
  <div style="margin-bottom:32px;">
    <span style="font-size:24px;font-weight:700;color:#10B981;">Norte</span>
  </div>
  ${content}
  <div style="margin-top:40px;padding-top:24px;border-top:1px solid #E5E7EB;">
    <p style="color:#9CA3AF;font-size:12px;margin:0;">
      Norte · La plataforma de IA para emprendedores<br/>
      Si tienes dudas, escríbenos a <a href="mailto:hello@norte.ai" style="color:#10B981;">hello@norte.ai</a>
    </p>
  </div>
</div>
`

// ---------------------------------------------------------------------------
// WelcomeEmail
// ---------------------------------------------------------------------------

export function WelcomeEmail({ name }: { name: string }): string {
  return baseWrapper(`
    <h1 style="color:#111827;font-size:24px;font-weight:700;margin:0 0 8px;">
      ¡Bienvenido a Norte, ${name}! 🎉
    </h1>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px;">
      Estamos muy contentos de tenerte aquí. Norte es tu asistente de IA para
      validar ideas de negocio, construir tu Lean Canvas, crear planes de
      marketing y mucho más.
    </p>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
      Con tu cuenta gratuita tienes acceso a <strong>10 mensajes diarios</strong>
      y las herramientas esenciales para arrancar tu proyecto.
    </p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://norte.ai'}/dashboard"
       style="display:inline-block;background:#10B981;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;">
      Ir al dashboard
    </a>
    <div style="margin-top:32px;padding:20px;background:#F0FDF4;border-radius:8px;border-left:4px solid #10B981;">
      <p style="color:#065F46;font-size:14px;font-weight:600;margin:0 0 8px;">
        Consejo de inicio rápido
      </p>
      <p style="color:#374151;font-size:14px;margin:0;">
        Empieza por el <strong>Validador de Ideas</strong> — cuéntale a Norte
        tu idea de negocio y recibirás un análisis completo de viabilidad y
        mercado en segundos.
      </p>
    </div>
  `)
}

// ---------------------------------------------------------------------------
// PremiumActivatedEmail
// ---------------------------------------------------------------------------

export function PremiumActivatedEmail({ name }: { name: string }): string {
  return baseWrapper(`
    <h1 style="color:#111827;font-size:24px;font-weight:700;margin:0 0 8px;">
      ¡Tu suscripción Pro está activa, ${name}! 🚀
    </h1>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px;">
      Gracias por confiar en Norte. A partir de ahora tienes acceso ilimitado a
      todas las herramientas Pro y a los modelos de IA más avanzados.
    </p>
    <div style="margin:24px 0;">
      <p style="color:#111827;font-size:15px;font-weight:600;margin:0 0 12px;">
        Lo que incluye tu plan Pro:
      </p>
      <ul style="color:#374151;font-size:15px;line-height:1.8;margin:0;padding-left:20px;">
        <li>Mensajes ilimitados con Claude 3.5 Sonnet</li>
        <li>Generador de Anuncios de alto rendimiento</li>
        <li>Análisis de Competencia profundo</li>
        <li>Estrategia de Precios personalizada</li>
        <li>Historial completo de conversaciones y proyectos</li>
        <li>Soporte prioritario</li>
      </ul>
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://norte.ai'}/dashboard"
       style="display:inline-block;background:#10B981;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;">
      Explorar herramientas Pro
    </a>
  `)
}

// ---------------------------------------------------------------------------
// SubscriptionCancelledEmail
// ---------------------------------------------------------------------------

export function SubscriptionCancelledEmail({ name }: { name: string }): string {
  return baseWrapper(`
    <h1 style="color:#111827;font-size:24px;font-weight:700;margin:0 0 8px;">
      Tu suscripción ha sido cancelada, ${name}
    </h1>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px;">
      Hemos procesado la cancelación de tu suscripción Pro. Seguirás teniendo
      acceso a todas las funciones Pro hasta el final del período de facturación
      actual.
    </p>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
      Después pasarás automáticamente al plan gratuito con 10 mensajes diarios.
      Tus conversaciones y proyectos guardados permanecerán intactos.
    </p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://norte.ai'}/upgrade"
       style="display:inline-block;background:#10B981;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;">
      Reactivar suscripción
    </a>
    <p style="color:#6B7280;font-size:14px;margin-top:24px;">
      ¿Cancelaste por algún problema? Escríbenos a
      <a href="mailto:hello@norte.ai" style="color:#10B981;">hello@norte.ai</a>
      y lo solucionamos juntos.
    </p>
  `)
}
