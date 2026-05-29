/* global window */
// chat-data.jsx — respuestas guionizadas del asistente.

function generateResponse(prompt) {
  const p = prompt.toLowerCase();

  // — Validación de idea —
  if (p.includes('valida') || p.includes('idea') || p.includes('café') || p.includes('negocio')) {
    return {
      lead: 'He analizado tu idea contra **9 señales de mercado** (demanda, competencia, márgenes, escalabilidad y timing). Aquí tienes el veredicto y el modelo de negocio para arrancar.',
      blocks: [
        { type: 'score', data: {
          overall: 82, verdict: 'Viable', title: 'Cafés de especialidad por suscripción',
          subtitle: 'Nicho con alta recurrencia y márgenes defendibles.',
          metrics: [
            { label: 'Demanda de mercado', value: 84 },
            { label: 'Margen unitario', value: 78 },
            { label: 'Competencia', value: 56 },
            { label: 'Escalabilidad', value: 71 },
            { label: 'Timing', value: 88 },
          ],
        }},
        { type: 'text', value: '## Por qué funciona\n• La **recurrencia** convierte un producto físico en ingresos predecibles tipo SaaS.\n• El nicho de especialidad tolera un **precio premium** (40-55% de margen bruto).\n• Bajo coste de adquisición si construyes comunidad antes de vender.' },
        { type: 'canvas', data: { blocks: [
          { k: 'Problema', v: 'Café de tienda inconsistente y caro' },
          { k: 'Solución', v: 'Suscripción curada quincenal' },
          { k: 'Métricas', v: 'MRR, churn, LTV/CAC' },
          { k: 'Ventaja', v: 'Relación directa con tostadores' },
          { k: 'Propuesta de valor', v: 'Café de origen, fresco, a tu puerta cada 2 semanas' },
          { k: 'Canales', v: 'Instagram · referidos · catas locales' },
          { k: 'Clientes', v: 'Profesionales 28-45, amantes del café' },
          { k: 'Ingresos', v: 'Suscripción 24€/mes + tienda puntual' },
        ]}},
      ],
      followups: ['Calcula el punto de equilibrio', 'Diséñame el funnel de captación', 'Sugiere 5 nombres de marca'],
    };
  }

  // — Pricing —
  if (p.includes('precio') || p.includes('pricing') || p.includes('saas')) {
    return {
      lead: 'Para un SaaS, la regla es **anclar al valor, no al coste**. Te propongo una arquitectura de 3 planes con un ancla premium que empuja al plan del medio (efecto señuelo).',
      blocks: [
        { type: 'table', data: {
          cols: ['Plan', 'Precio/mes', 'Objetivo', 'Conversión est.'],
          rows: [
            Object.assign(['Starter', '0 €', 'Adquisición', '—'], {}),
            Object.assign(['Growth', '29 €', 'Caballo de batalla', '8-12%'], { highlight: true }),
            ['Scale', '89 €', 'Ancla de valor', '2-3%'],
          ],
        }},
        { type: 'text', value: '## Recomendaciones\n• Haz que **Growth** parezca la opción obvia: destácalo visualmente y lista en él las 3 funciones más deseadas.\n• Cobra **anual con 2 meses gratis** para mejorar caja y reducir churn.\n• Revisa precios cada 6 meses; subir un 10-15% rara vez mueve la conversión si el valor crece.' },
      ],
      followups: ['¿Cuándo subir precios?', 'Diseña el plan anual', 'Compara con mi competencia'],
    };
  }

  // — Marketing / funnel —
  if (p.includes('marketing') || p.includes('funnel') || p.includes('lanzamiento') || p.includes('captación')) {
    return {
      lead: 'Te armo un **funnel de 4 etapas** con el canal y el mensaje para cada una. La clave es no saltar de "desconocido" a "compra" sin construir confianza en medio.',
      blocks: [
        { type: 'text', value: '## Funnel de lanzamiento\n• **Atracción** — Reels de valor + colaboraciones de nicho. Objetivo: alcance.\n• **Captación** — Lead magnet (guía gratuita) a cambio del email.\n• **Nutrición** — Secuencia de 5 emails: historia → prueba social → oferta.\n• **Conversión** — Oferta de lanzamiento con escasez real (7 días).' },
        { type: 'table', data: {
          cols: ['Etapa', 'Canal', 'KPI'],
          rows: [
            ['Atracción', 'Instagram / TikTok', 'Alcance'],
            Object.assign(['Captación', 'Landing + lead magnet', 'Email opt-in %'], { highlight: true }),
            ['Nutrición', 'Email', 'Open / CTR'],
            ['Conversión', 'Página de venta', 'Conversión %'],
          ],
        }},
      ],
      followups: ['Escribe la secuencia de emails', 'Ideas de lead magnet', 'Presupuesto de ads para empezar'],
    };
  }

  // — Competencia —
  if (p.includes('competencia') || p.includes('competidor')) {
    return {
      lead: 'Mapear competencia no es copiar: es **encontrar el hueco**. Aquí tienes un comparativo rápido y dónde veo tu oportunidad.',
      blocks: [
        { type: 'table', data: {
          cols: ['Competidor', 'Precio', 'Fortaleza', 'Hueco'],
          rows: [
            ['Líder A', '$$$', 'Marca', 'Caro y lento'],
            ['Retador B', '$$', 'Producto', 'Mal soporte'],
            Object.assign(['Tú', '$$', 'Cercanía + IA', 'A construir'], { highlight: true }),
          ],
        }},
        { type: 'text', value: '## Tu oportunidad\n• Posiciónate en **rapidez + acompañamiento**, justo donde el líder es débil.\n• No compitas en precio: compite en **tiempo a resultado**.' },
      ],
      followups: ['Define mi propuesta de valor única', 'Analiza sus anuncios', 'Estrategia de diferenciación'],
    };
  }

  // — Genérico —
  return {
    lead: 'Buena pregunta. Vamos a estructurarlo para que salgas de aquí con un **siguiente paso concreto**, no solo teoría.',
    blocks: [
      { type: 'text', value: '## Cómo lo abordaría\n• Primero clarificamos el **objetivo medible** (qué cambia y para cuándo).\n• Luego elegimos la **palanca de mayor impacto** con el menor esfuerzo.\n• Y definimos un **experimento** que puedas ejecutar esta semana.' },
    ],
    followups: ['Profundiza en el primer punto', 'Dame un ejemplo concreto', 'Conviértelo en un plan de acción'],
  };
}

window.generateResponse = generateResponse;
