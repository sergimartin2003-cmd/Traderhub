'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ToolView } from '@/components/tools/tool-view'
import { createProject } from '@/actions/projects'

interface ToolPageClientProps {
  toolId: string
  isPro: boolean
}

export function ToolPageClient({ toolId, isPro }: ToolPageClientProps) {
  const router = useRouter()

  const handleBack = useCallback(() => {
    router.push('/dashboard/tools')
  }, [router])

  const handleUpgrade = useCallback(() => {
    router.push('/upgrade')
  }, [router])

  const handleSaveProject = useCallback(
    async (data: { name: string; tool: string; data: unknown }) => {
      const result = await createProject(data.name, data.tool, data.data as Record<string, unknown>)
      if ('error' in result) {
        toast.error('Error al guardar el proyecto')
      } else {
        toast.success('Proyecto guardado')
      }
    },
    []
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
