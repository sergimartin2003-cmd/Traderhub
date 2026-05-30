'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function BillingPortalButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Error al abrir el portal de facturación')
      }
    } catch {
      toast.error('Error al abrir el portal de facturación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '10px 18px',
        borderRadius: 'var(--r-md)',
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--ink)',
        background: 'var(--surface)',
        border: '1.5px solid var(--line-2)',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        transition: 'background .15s',
      }}
    >
      {loading ? 'Cargando...' : 'Gestionar suscripción'}
    </button>
  )
}
