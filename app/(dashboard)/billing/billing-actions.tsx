'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface Props {
  isPro: boolean
  portalOnly?: boolean
}

export function BillingActions({ isPro, portalOnly = false }: Props) {
  const [loading, setLoading] = useState(false)

  const handlePortal = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error('Error al abrir el portal de facturación')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: priceId || 'price_monthly' }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error('Error al iniciar el pago')
    } finally {
      setLoading(false)
    }
  }

  if (portalOnly) {
    return (
      <Button variant="secondary" onClick={handlePortal} disabled={loading}>
        {loading ? 'Cargando...' : 'Abrir portal de facturación'}
      </Button>
    )
  }

  if (isPro) {
    return (
      <Button variant="secondary" onClick={handlePortal} disabled={loading}>
        {loading ? 'Cargando...' : 'Gestionar suscripción'}
      </Button>
    )
  }

  return (
    <Button variant="gold" icon="crown" onClick={handleUpgrade} disabled={loading}>
      {loading ? 'Cargando...' : 'Mejorar a Pro — 19€/mes'}
    </Button>
  )
}
