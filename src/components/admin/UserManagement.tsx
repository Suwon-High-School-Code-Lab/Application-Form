'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Edit, Save, X } from 'lucide-react'

interface User {
  id: string
  email: string
  grade: number | null
  class: number | null
  student_number: number | null
  is_admin: boolean
  created_at: string
}

interface UserManagementProps {
  users: User[]
}

export function UserManagement({ users: initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [grade, setGrade] = useState('')
  const [classNum, setClassNum] = useState('')
  const [studentNumber, setStudentNumber] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [maxGrade, setMaxGrade] = useState(3)
  const [maxClass, setMaxClass] = useState(20)
  const [maxStudentNumber, setMaxStudentNumber] = useState(50)
  const supabase = createClient()

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['max_grade', 'max_class', 'max_student_number'])

      if (data) {
        data.forEach(setting => {
          if (setting.key === 'max_grade') setMaxGrade(setting.value)
          if (setting.key === 'max_class') setMaxClass(setting.value)
          if (setting.key === 'max_student_number') setMaxStudentNumber(setting.value)
        })
      }
    }
    fetchSettings()
  }, [])

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setGrade(user.grade?.toString() || '')
    setClassNum(user.class?.toString() || '')
    setStudentNumber(user.student_number?.toString() || '')
    setError('')
    setSuccess('')
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!editingUser) return

    setError('')
    setSuccess('')

    if (!grade || !classNum || !studentNumber) {
      setError('학년, 반, 번호를 모두 입력해주세요')
      return
    }

    const gradeNum = parseInt(grade)
    const classNumber = parseInt(classNum)
    const studentNum = parseInt(studentNumber)

    if (gradeNum < 1 || gradeNum > maxGrade) {
      setError(`학년은 1~${maxGrade} 사이의 숫자여야 합니다`)
      return
    }

    if (classNumber < 1 || classNumber > maxClass) {
      setError(`반은 1~${maxClass} 사이의 숫자여야 합니다`)
      return
    }

    if (studentNum < 1 || studentNum > maxStudentNumber) {
      setError(`번호는 1~${maxStudentNumber} 사이의 숫자여야 합니다`)
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          grade: gradeNum,
          class: classNumber,
          student_number: studentNum,
        })
        .eq('id', editingUser.id)

      if (updateError) throw updateError

      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, grade: gradeNum, class: classNumber, student_number: studentNum }
          : u
      ))

      setSuccess('사용자 정보가 성공적으로 업데이트되었습니다')
      setTimeout(() => {
        setDialogOpen(false)
        setEditingUser(null)
      }, 1500)
    } catch (err: any) {
      if (err.message?.includes('unique_student_identifier')) {
        setError(`${gradeNum}학년 ${classNumber}반 ${studentNum}번은 이미 등록된 학생 정보입니다. 다른 정보를 입력해주세요.`)
      } else {
        setError(err.message || '업데이트 중 오류가 발생했습니다')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingUser(null)
    setError('')
    setSuccess('')
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이메일</TableHead>
              <TableHead className="text-center">학년</TableHead>
              <TableHead className="text-center">반</TableHead>
              <TableHead className="text-center">번호</TableHead>
              <TableHead className="text-center">관리자</TableHead>
              <TableHead className="text-center">가입일</TableHead>
              <TableHead className="text-center">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  등록된 사용자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell className="text-center">
                    {user.grade || '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.class || '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.student_number || '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.is_admin ? '예' : '아니오'}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(user.created_at).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell className="text-center">
                    <Dialog open={dialogOpen && editingUser?.id === user.id} onOpenChange={(open) => {
                      if (!open) handleCancel()
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>사용자 정보 수정</DialogTitle>
                          <DialogDescription>
                            {user.email}의 학년, 반, 번호를 수정합니다.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          {error && (
                            <Alert variant="destructive">
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          )}
                          {success && (
                            <Alert className="border-green-500 text-green-700">
                              <AlertDescription>{success}</AlertDescription>
                            </Alert>
                          )}

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-grade">학년</Label>
                              <Input
                                id="edit-grade"
                                type="number"
                                placeholder="1"
                                min="1"
                                max="3"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                disabled={loading}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-class">반</Label>
                              <Input
                                id="edit-class"
                                type="number"
                                placeholder="1"
                                min="1"
                                max="20"
                                value={classNum}
                                onChange={(e) => setClassNum(e.target.value)}
                                disabled={loading}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-student-number">번호</Label>
                              <Input
                                id="edit-student-number"
                                type="number"
                                placeholder="1"
                                min="1"
                                max="50"
                                value={studentNumber}
                                onChange={(e) => setStudentNumber(e.target.value)}
                                disabled={loading}
                              />
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                          >
                            <X className="mr-2 h-4 w-4" />
                            취소
                          </Button>
                          <Button onClick={handleSave} disabled={loading}>
                            <Save className="mr-2 h-4 w-4" />
                            {loading ? '저장 중...' : '저장'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
