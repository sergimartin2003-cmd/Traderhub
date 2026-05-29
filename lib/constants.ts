// Application-wide constants for Norte (TraderHub)

export const BRAND_NAME = 'Norte'

export const FREE_DAILY_LIMIT = 10

export const PLANS = {
  monthly: {
    price: 19,
    currency: 'EUR',
  },
  annual: {
    price: 180,
    currency: 'EUR',
    monthlyEquivalent: 15,
  },
} as const

export interface ToolDefinition {
  id: string
  icon: string
  name: string
  description: string
  pro: boolean
  accent: string
}

export const TOOLS: ToolDefinition[] = [
  {
    id: 'idea',
    icon: 'Lightbulb',
    name: 'Validador de Ideas',
    description: 'Valida tu idea de negocio con análisis profundo de mercado y viabilidad.',
    pro: false,
    accent: '#10B981',
  },
  {
    id: 'canvas',
    icon: 'LayoutTemplate',
    name: 'Lean Canvas',
    description: 'Construye tu modelo de negocio con la metodología Lean Canvas.',
    pro: false,
    accent: '#3B82F6',
  },
  {
    id: 'marketing',
    icon: 'Megaphone',
    name: 'Plan de Marketing',
    description: 'Crea un plan de marketing completo adaptado a tu negocio.',
    pro: false,
    accent: '#8B5CF6',
  },
  {
    id: 'ads',
    icon: 'Zap',
    name: 'Generador de Anuncios',
    description: 'Genera copys y creatividades de alto rendimiento para tus campañas.',
    pro: true,
    accent: '#F59E0B',
  },
  {
    id: 'competitor',
    icon: 'Target',
    name: 'Análisis de Competencia',
    description: 'Analiza en profundidad a tus competidores y descubre oportunidades.',
    pro: true,
    accent: '#EC4899',
  },
  {
    id: 'pricing',
    icon: 'TrendingUp',
    name: 'Estrategia de Precios',
    description: 'Define la estrategia de precios óptima para maximizar tus ingresos.',
    pro: true,
    accent: '#06B6D4',
  },
]

export const ACCENTS = {
  esmeralda: {
    name: 'Esmeralda',
    color: '#10B981',
    tailwind: 'emerald',
  },
  azul: {
    name: 'Azul',
    color: '#3B82F6',
    tailwind: 'blue',
  },
  violeta: {
    name: 'Violeta',
    color: '#8B5CF6',
    tailwind: 'violet',
  },
  ambar: {
    name: 'Ámbar',
    color: '#F59E0B',
    tailwind: 'amber',
  },
  rosa: {
    name: 'Rosa',
    color: '#EC4899',
    tailwind: 'pink',
  },
  cian: {
    name: 'Cian',
    color: '#06B6D4',
    tailwind: 'cyan',
  },
} as const

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  chat: '/dashboard/chat',
  tools: '/dashboard/tools',
  projects: '/dashboard/projects',
  settings: '/dashboard/settings',
  billing: '/dashboard/billing',
  profile: '/dashboard/profile',
  upgrade: '/upgrade',
  // API routes
  api: {
    chat: '/api/chat',
    stripe: {
      checkout: '/api/stripe/checkout',
      portal: '/api/stripe/portal',
      webhook: '/api/stripe/webhook',
    },
    user: {
      profile: '/api/user/profile',
      usage: '/api/user/usage',
    },
  },
} as const
