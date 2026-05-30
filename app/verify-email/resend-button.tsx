'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function ResendVerificationButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleResend = async () => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    setLoading(false)
    if (error) {
      toast.error('Error al reenviar. Inténtalo de nuevo.')
    } else {
      setSent(true)
      toast.success('Email de verificación reenviado')
    }
  }

  return (
    <button
      onClick={handleResend}
      disabled={loading || sent}
      style={{
        width: '100%',
        padding: '12px 20px',
        borderRadius: 'var(--r-md)',
        fontSize: 15,
        fontWeight: 700,
        color: '#fff',
        background: sent ? 'var(--ink-4)' : 'var(--accent)',
        border: 'none',
        cursor: loading || sent ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-display)',
        transition: 'background .15s',
      }}
    >
      {sent ? 'Email enviado' : loading ? 'Enviando...' : 'Reenviar email de verificación'}
    </button>
  )
}
