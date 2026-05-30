'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ToolView } from '@/components/tools/tool-view'
import { createProject } from '@/actions/projects'

interface Props {
  toolId: string
  isPro: boolean
}

export function ToolViewWrapper({ toolId, isPro }: Props) {
  const router = useRouter()

  const handleSaveProject = async ({ name, tool, data }: { name: string; tool: string; data: unknown }) => {
    const result = await createProject(name, tool, data as Record<string, unknown>)
    if ('error' in result) {
      toast.error(result.error)
    } else {
      toast.success('Proyecto guardado en tu lista')
    }
  }

  return (
    <ToolView
      toolId={toolId}
      isPro={isPro}
      onBack={() => router.push('/dashboard/tools')}
      onUpgrade={() => router.push('/dashboard/billing')}
      onSaveProject={handleSaveProject}
    />
  )
}
