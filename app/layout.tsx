import type { Metadata, Viewport } from 'next'
import './globals.css'
import { PostHogProviderWrapper } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'Norte — Tu copiloto de IA para emprender',
    template: '%s | Norte',
  },
  description:
    'Norte valida ideas, diseña tu marketing, fija tus precios y analiza a tu competencia. El copiloto de IA para emprendedores en español.',
  keywords: ['emprendimiento', 'startup', 'IA', 'inteligencia artificial', 'negocio', 'marketing', 'validación de ideas'],
  authors: [{ name: 'Norte' }],
  creator: 'Norte',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://norte.app',
    siteName: 'Norte',
    title: 'Norte — Tu copiloto de IA para emprender',
    description:
      'Norte valida ideas, diseña tu marketing, fija tus precios y analiza a tu competencia. Resultados reales, no teoría.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Norte — Copiloto de IA para emprendedores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Norte — Tu copiloto de IA para emprender',
    description: 'Norte valida ideas, diseña tu marketing, fija tus precios y analiza a tu competencia.',
    images: ['/og-image.png'],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://norte.app'),
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#10B981',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <PostHogProviderWrapper>{children}</PostHogProviderWrapper>
      </body>
    </html>
  )
}
