import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, FileText, LogOut, Users, Settings, ClipboardList } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <h2 className="text-2xl font-bold">관리자 패널</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        
        <nav className="space-y-2 px-4">
          <Link href="/admin/forms">
            <Button variant="ghost" className="w-full justify-start hover:bg-accent transition-colors">
              <FileText className="mr-2 h-4 w-4" />
              지원서 양식 관리
            </Button>
          </Link>
          <Link href="/admin/results">
            <Button variant="ghost" className="w-full justify-start hover:bg-accent transition-colors">
              <ClipboardList className="mr-2 h-4 w-4" />
              지원서 제출 현황
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="ghost" className="w-full justify-start hover:bg-accent transition-colors">
              <Users className="mr-2 h-4 w-4" />
              사용자 관리
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="ghost" className="w-full justify-start hover:bg-accent transition-colors">
              <Settings className="mr-2 h-4 w-4" />
              시스템 설정
            </Button>
          </Link>
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <form action="/api/auth/signout" method="post">
            <Button variant="ghost" className="w-full justify-start hover:bg-accent transition-colors" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </form>
        </div>
      </aside>

      <main className="flex-1">
        <div className="border-b bg-card">
          <div className="flex items-center justify-between p-4">
            <div />
            <ThemeToggle />
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
