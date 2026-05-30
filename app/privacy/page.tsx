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

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32, textDecoration: 'none' }}>
            <Logo size={26} label="Norte" />
          </Link>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--ink)', margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>
            Política de Privacidad
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-4)', margin: 0 }}>
            Última actualización: Mayo 2026
          </p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-xl)', padding: '36px 40px' }}>

          <p style={pStyle}>
            En Norte, nos comprometemos a proteger tu privacidad y a ser transparentes sobre cómo gestionamos tus datos personales. Esta política cumple con el Reglamento General de Protección de Datos (RGPD) y la legislación española aplicable.
          </p>

          <h2 style={h2Style}>1. Datos que recopilamos</h2>
          <p style={pStyle}>Recopilamos los siguientes tipos de datos:</p>
          <ul style={{ ...pStyle, paddingLeft: 20, margin: '0 0 12px' }}>
            <li><strong>Datos de cuenta:</strong> nombre, dirección de correo electrónico y contraseña cifrada al registrarte.</li>
            <li><strong>Datos de uso:</strong> conversaciones con la IA, proyectos guardados, herramientas utilizadas y métricas de actividad.</li>
            <li><strong>Datos de facturación:</strong> información de pago procesada de forma segura por Stripe. No almacenamos datos de tarjetas directamente.</li>
            <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo y datos de sesión necesarios para el funcionamiento del servicio.</li>
          </ul>

          <h2 style={h2Style}>2. Cómo usamos tus datos</h2>
          <p style={pStyle}>Utilizamos tus datos para:</p>
          <ul style={{ ...pStyle, paddingLeft: 20, margin: '0 0 12px' }}>
            <li>Proporcionar, mantener y mejorar el Servicio</li>
            <li>Personalizar tu experiencia y las respuestas de la IA</li>
            <li>Gestionar tu suscripción y procesar pagos</li>
            <li>Enviarte comunicaciones relacionadas con el servicio (actualizaciones, cambios de política)</li>
            <li>Detectar y prevenir fraudes o abusos</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
          <p style={pStyle}>
            La base legal para el tratamiento es la ejecución del contrato de servicio, el interés legítimo en mejorar el servicio y, cuando aplica, tu consentimiento explícito.
          </p>

          <h2 style={h2Style}>3. Compartición de datos</h2>
          <p style={pStyle}>
            No vendemos tus datos personales. Compartimos datos únicamente con los siguientes terceros, bajo acuerdos de protección de datos adecuados:
          </p>
          <ul style={{ ...pStyle, paddingLeft: 20, margin: '0 0 12px' }}>
            <li><strong>Supabase:</strong> infraestructura de base de datos y autenticación (servidores en la UE)</li>
            <li><strong>Stripe:</strong> procesamiento de pagos</li>
            <li><strong>OpenRouter / Anthropic:</strong> procesamiento de consultas de IA</li>
            <li><strong>Resend:</strong> envío de correos transaccionales</li>
          </ul>
          <p style={pStyle}>
            Podemos compartir datos si así lo exige la ley o para proteger los derechos legales de Norte.
          </p>

          <h2 style={h2Style}>4. Seguridad</h2>
          <p style={pStyle}>
            Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos frente a accesos no autorizados, pérdida o divulgación. Esto incluye cifrado en tránsito (TLS) y en reposo, acceso restringido a datos y auditorías de seguridad regulares.
          </p>
          <p style={pStyle}>
            Sin embargo, ningún sistema es completamente seguro. En caso de una brecha de seguridad que afecte a tus datos, te notificaremos según los plazos legales aplicables.
          </p>

          <h2 style={h2Style}>5. Cookies</h2>
          <p style={pStyle}>
            Utilizamos cookies estrictamente necesarias para el funcionamiento del Servicio (gestión de sesión y autenticación). Podemos utilizar cookies de análisis para entender cómo se usa el Servicio, siempre con tu consentimiento cuando sea requerido.
          </p>
          <p style={pStyle}>
            Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar al funcionamiento del Servicio.
          </p>

          <h2 style={h2Style}>6. Retención de datos</h2>
          <p style={pStyle}>
            Conservamos tus datos durante el tiempo que mantengas una cuenta activa. Al eliminar tu cuenta, tus datos personales serán eliminados en un plazo de 30 días, excepto aquellos que debamos conservar por obligaciones legales (como registros de facturación).
          </p>

          <h2 style={h2Style}>7. Tus derechos (RGPD)</h2>
          <p style={pStyle}>Si resides en el Espacio Económico Europeo, tienes los siguientes derechos:</p>
          <ul style={{ ...pStyle, paddingLeft: 20, margin: '0 0 12px' }}>
            <li><strong>Acceso:</strong> solicitar una copia de tus datos personales</li>
            <li><strong>Rectificación:</strong> corregir datos inexactos</li>
            <li><strong>Supresión:</strong> solicitar la eliminación de tus datos ("derecho al olvido")</li>
            <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado</li>
            <li><strong>Oposición:</strong> oponerte al tratamiento basado en interés legítimo</li>
            <li><strong>Limitación:</strong> solicitar la restricción del tratamiento</li>
          </ul>
          <p style={pStyle}>
            Para ejercer cualquiera de estos derechos, contáctanos en privacidad@norte.ai. Responderemos en un plazo máximo de 30 días. También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).
          </p>

          <h2 style={h2Style}>8. Contacto</h2>
          <p style={pStyle}>
            Para cualquier consulta sobre privacidad o protección de datos:
          </p>
          <p style={{ ...pStyle, fontWeight: 600, color: 'var(--ink-2)' }}>
            privacidad@norte.ai
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
