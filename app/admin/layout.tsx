import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { SessionProvider } from 'next-auth/react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (!['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
    redirect('/')
  }

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden w-64 lg:block">
          <AdminSidebar />
        </aside>
        <main className="flex-1 overflow-y-auto">
          <div className="container py-8">{children}</div>
        </main>
      </div>
    </SessionProvider>
  )
}
