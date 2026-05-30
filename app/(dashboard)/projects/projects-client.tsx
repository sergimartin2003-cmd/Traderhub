'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/icons'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TOOLS } from '@/lib/constants'
import type { Project } from '@/types'

const TOOL_MAP = Object.fromEntries(TOOLS.map((t) => [t.id, t]))

interface ProjectsClientProps {
  projects: Project[]
  isPro: boolean
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este proyecto?')) return
    setDeleting(id)
    await fetch(`/api/user/projects/${id}`, { method: 'DELETE' })
    setDeleting(null)
    window.location.reload()
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 100px' }}>
      <h1 style={{ margin: '0 0 22px', fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>
        Proyectos guardados
      </h1>

      {projects.length === 0 ? (
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 'var(--r-lg)', background: 'var(--surface-3)', color: 'var(--ink-4)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <Icon name="folder" size={28} />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>Aún no hay proyectos</h3>
          <p style={{ margin: '0 auto 18px', fontSize: 14.5, color: 'var(--ink-3)', maxWidth: 320, lineHeight: 1.5 }}>
            Usa una herramienta y guarda el resultado para verlo aquí.
          </p>
          <Link href="/dashboard/tools">
            <Button variant="primary" icon="tools">Ir a herramientas</Button>
          </Link>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {projects.map((p) => {
            const tool = TOOL_MAP[p.type] ?? { icon: 'doc', accent: '#10B981', name: p.type }
            return (
              <Card key={p.id} hover style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 130, position: 'relative' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', background: tool.accent + '15', color: tool.accent }}>
                  <Icon name={tool.icon} size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 650, fontSize: 15, letterSpacing: '-0.01em' }}>{p.title}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-4)', marginTop: 3 }}>{tool.name}</div>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deleting === p.id}
                  style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', color: 'var(--danger)', opacity: 0.6, cursor: 'pointer' }}
                  title="Eliminar"
                >
                  <Icon name="trash" size={15} />
                </button>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
