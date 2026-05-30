import { redirect } from 'next/navigation'

// This file exists to prevent route conflict with app/page.tsx (landing page).
// Authenticated app home lives at /dashboard via app/(dashboard)/dashboard/page.tsx
export default function DashboardRootRedirect() {
  redirect('/dashboard')
}
