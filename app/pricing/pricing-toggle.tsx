'use client'

import { useState } from 'react'

export function PricingToggle() {
  const [annual, setAnnual] = useState(false)

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-full)', padding: '4px 6px' }}>
      <button
        onClick={() => setAnnual(false)}
        style={{
          padding: '7px 18px',
          borderRadius: 'var(--r-full)',
          fontSize: 14,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          background: !annual ? 'var(--ink)' : 'transparent',
          color: !annual ? '#fff' : 'var(--ink-3)',
          fontFamily: 'var(--font-display)',
          transition: 'background .15s, color .15s',
        }}
      >
        Mensual
      </button>
      <button
        onClick={() => setAnnual(true)}
        style={{
          padding: '7px 18px',
          borderRadius: 'var(--r-full)',
          fontSize: 14,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          background: annual ? 'var(--ink)' : 'transparent',
          color: annual ? '#fff' : 'var(--ink-3)',
          fontFamily: 'var(--font-display)',
          transition: 'background .15s, color .15s',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        Anual
        <span style={{ background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--r-full)' }}>
          -21%
        </span>
      </button>
    </div>
  )
}
