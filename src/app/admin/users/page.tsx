import { createClient } from '@/lib/supabase/server'
import { UserManagement } from '@/components/admin/UserManagement'

export default async function UsersPage() {
  const supabase = await createClient()
  
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, email, grade, class, student_number, is_admin, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return <div>사용자 목록을 불러오는 중 오류가 발생했습니다.</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">사용자 관리</h1>
        <p className="text-muted-foreground mt-2">
          사용자의 학년, 반, 번호 정보를 관리합니다.
        </p>
      </div>
      
      <UserManagement users={users || []} />
    </div>
  )
}
