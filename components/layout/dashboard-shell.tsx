'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileBar, MobileHeader } from '@/components/layout/mobile-nav'
import type { Profile, Subscription } from '@/types'

interface SidebarConversation {
  id: string
  title: string
  context?: string | null
}

interface DashboardShellProps {
  user: { id: string; email: string }
  profile: Profile | null
  subscription: Subscription | null
  isPro: boolean
  conversations?: SidebarConversation[]
  children: React.ReactNode
}

export default function DashboardShell({
  user,
  profile,
  isPro,
  conversations = [] as SidebarConversation[],
  children,
}: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleNewChat = () => {
    router.push('/dashboard/chat')
  }

  const handleUpgrade = () => {
    router.push('/upgrade')
  }

  // Build sidebar user object
  const sidebarUser = {
    id: user.id,
    full_name: profile?.full_name ?? null,
    avatar_url: profile?.avatar_url ?? null,
    email: user.email,
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--canvas)',
      }}
    >
      {/* Desktop sidebar */}
      <Sidebar
        currentPath={pathname}
        isPro={isPro}
        user={sidebarUser}
        conversations={conversations}
        onNewChat={handleNewChat}
        onUpgrade={handleUpgrade}
      />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {/* Mobile header */}
        <MobileHeader
          currentPath={pathname}
          onNewChat={handleNewChat}
        />

        {/* Page content */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {children}
        </main>

        {/* Mobile bottom nav */}
        <MobileBar currentPath={pathname} onNewChat={handleNewChat} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .mobile-bar { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
