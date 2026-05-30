'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ToolView } from '@/components/tools/tool-view'
import { createProject } from '@/actions/projects'
import { useAnalytics } from '@/lib/posthog/events'

interface ToolPageClientProps {
  toolId: string
  isPro: boolean
}

export function ToolPageClient({ toolId, isPro }: ToolPageClientProps) {
  const router = useRouter()
  const { track } = useAnalytics()

  const handleBack = useCallback(() => {
    router.push('/dashboard/tools')
  }, [router])

  const handleUpgrade = useCallback(() => {
    track('upgrade_clicked', { source: 'tool', tool_id: toolId })
    router.push('/upgrade')
  }, [router, toolId, track])

  const handleSaveProject = useCallback(
    async (data: { name: string; tool: string; data: unknown }) => {
      track('tool_used', { tool_id: data.tool })
      const result = await createProject(data.name, data.tool, data.data as Record<string, unknown>)
      if ('error' in result) {
        toast.error('Error al guardar el proyecto')
      } else {
        track('project_created', { tool_id: data.tool })
        toast.success('Proyecto guardado')
      }
    },
    [track]
  )

  return (
    <ToolView
      toolId={toolId}
      isPro={isPro}
      onBack={handleBack}
      onUpgrade={handleUpgrade}
      onSaveProject={handleSaveProject}
    />
  )
}
