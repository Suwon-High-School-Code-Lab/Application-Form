'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserManagement } from '@/components/admin/UserManagement'

export default function UsersPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, grade, class, student_number, role, created_at')
          .order('created_at', { ascending: false })

        if (error) throw error
        setUsers(data || [])
      } catch (err: any) {
        console.error('Error fetching users:', err)
        setError('사용자 목록을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [supabase])

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">로딩 중...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">사용자 관리</h1>
        <p className="text-muted-foreground mt-2">
          사용자의 학년, 반, 번호 정보를 관리합니다.
        </p>
      </div>
      
      <UserManagement users={users} />
    </div>
  )
}
