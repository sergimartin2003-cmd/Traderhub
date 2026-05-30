import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

const h2Style: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: 'var(--ink)',
  margin: '36px 0 12px',
}

const pStyle: React.CSSProperties = {
  fontSize: 15,
  color: 'var(--ink-3)',
  lineHeight: 1.7,
  margin: '0 0 12px',
}

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32, textDecoration: 'none' }}>
            <Logo size={26} label="Norte" />
          </Link>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--ink)', margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>
            Términos de Servicio
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-4)', margin: 0 }}>
            Última actualización: Mayo 2026
          </p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: '36px 40px' }}>

          <h2 style={h2Style}>1. Aceptación de los términos</h2>
          <p style={pStyle}>
            Al acceder y utilizar Norte ("el Servicio"), aceptas estar vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al Servicio.
          </p>
          <p style={pStyle}>
            Estos términos se aplican a todos los usuarios del Servicio, incluidos visitantes, usuarios registrados y cualquier persona que acceda al Servicio.
          </p>

          <h2 style={h2Style}>2. Descripción del servicio</h2>
          <p style={pStyle}>
            Norte es una plataforma de inteligencia artificial para emprendedores y pequeñas empresas. Proporciona herramientas de análisis de negocios, asistencia mediante IA conversacional y funcionalidades de planificación estratégica.
          </p>
          <p style={pStyle}>
            Nos reservamos el derecho de modificar, suspender o interrumpir el Servicio en cualquier momento, con o sin previo aviso.
          </p>

          <h2 style={h2Style}>3. Planes y pagos</h2>
          <p style={pStyle}>
            Norte ofrece un plan gratuito con funcionalidades limitadas y un plan Pro de pago. Los precios del plan Pro se muestran en la página de precios y pueden cambiar con previo aviso de 30 días.
          </p>
          <p style={pStyle}>
            Los pagos se procesan de forma segura a través de Stripe. Al suscribirte al plan Pro, autorizas cargos recurrentes mensuales o anuales según el plan seleccionado. Puedes cancelar tu suscripción en cualquier momento desde los ajustes de tu cuenta.
          </p>
          <p style={pStyle}>
            No se realizan reembolsos por períodos parciales de suscripción, salvo que la ley aplicable lo requiera.
          </p>

          <h2 style={h2Style}>4. Uso aceptable</h2>
          <p style={pStyle}>
            Aceptas no utilizar el Servicio para:
          </p>
          <ul style={{ ...pStyle, paddingLeft: 20, margin: '0 0 12px' }}>
            <li>Actividades ilegales o fraudulentas</li>
            <li>Difundir contenido dañino, abusivo o engañoso</li>
            <li>Intentar acceder sin autorización a sistemas o cuentas de terceros</li>
            <li>Sobrecargar o interferir con la infraestructura del Servicio</li>
            <li>Revender o redistribuir el Servicio sin autorización expresa</li>
          </ul>
          <p style={pStyle}>
            El incumplimiento de estas normas puede resultar en la suspensión o cancelación inmediata de tu cuenta.
          </p>

          <h2 style={h2Style}>5. Privacidad</h2>
          <p style={pStyle}>
            Tu privacidad es importante para nosotros. El tratamiento de tus datos personales se rige por nuestra{' '}
            <Link href="/privacy" style={{ color: 'var(--accent-700)', fontWeight: 600, textDecoration: 'none' }}>
              Política de Privacidad
            </Link>
            , que forma parte integral de estos Términos de Servicio.
          </p>

          <h2 style={h2Style}>6. Propiedad intelectual</h2>
          <p style={pStyle}>
            El Servicio y su contenido original, características y funcionalidades son propiedad de Norte y están protegidos por derechos de autor, marcas comerciales y otras leyes de propiedad intelectual. Puedes utilizar el contenido generado para tus fines personales y comerciales.
          </p>

          <h2 style={h2Style}>7. Limitación de responsabilidad</h2>
          <p style={pStyle}>
            En la máxima medida permitida por la ley aplicable, Norte no será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos, ni de pérdida de beneficios o ingresos.
          </p>
          <p style={pStyle}>
            El Servicio se proporciona "tal cual" y "según disponibilidad", sin garantías de ningún tipo. Las respuestas generadas por IA son orientativas y no constituyen asesoramiento legal, financiero o profesional.
          </p>

          <h2 style={h2Style}>8. Modificaciones</h2>
          <p style={pStyle}>
            Nos reservamos el derecho de modificar estos Términos en cualquier momento. Te notificaremos los cambios relevantes mediante correo electrónico o un aviso destacado en el Servicio. El uso continuado del Servicio tras la notificación implica la aceptación de los nuevos términos.
          </p>

          <h2 style={h2Style}>9. Contacto</h2>
          <p style={pStyle}>
            Si tienes preguntas sobre estos Términos de Servicio, puedes contactarnos en:
          </p>
          <p style={{ ...pStyle, fontWeight: 600, color: 'var(--ink-2)' }}>
            hola@norte.ai
          </p>
        </div>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link
            href="/"
            style={{ fontSize: 14, color: 'var(--ink-4)', textDecoration: 'none', fontWeight: 500 }}
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
