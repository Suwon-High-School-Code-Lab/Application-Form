'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Save } from 'lucide-react'

interface SettingsFormProps {
  maxGrade: number
  maxClass: number
  maxStudentNumber: number
}

export function SettingsForm({ maxGrade: initialMaxGrade, maxClass: initialMaxClass, maxStudentNumber: initialMaxStudentNumber }: SettingsFormProps) {
  const [maxGrade, setMaxGrade] = useState(initialMaxGrade.toString())
  const [maxClass, setMaxClass] = useState(initialMaxClass.toString())
  const [maxStudentNumber, setMaxStudentNumber] = useState(initialMaxStudentNumber.toString())
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!maxGrade || !maxClass || !maxStudentNumber) {
      setError('모든 값을 입력해주세요')
      return
    }

    const maxGradeNum = parseInt(maxGrade)
    const maxClassNum = parseInt(maxClass)
    const maxStudentNumberNum = parseInt(maxStudentNumber)

    if (maxGradeNum < 1 || maxGradeNum > 10) {
      setError('최대 학년은 1~10 사이의 숫자여야 합니다')
      return
    }

    if (maxClassNum < 1 || maxClassNum > 50) {
      setError('최대 반은 1~50 사이의 숫자여야 합니다')
      return
    }

    if (maxStudentNumberNum < 1 || maxStudentNumberNum > 100) {
      setError('최대 번호는 1~100 사이의 숫자여야 합니다')
      return
    }

    setLoading(true)

    try {
      const updates = [
        { key: 'max_grade', value: maxGradeNum },
        { key: 'max_class', value: maxClassNum },
        { key: 'max_student_number', value: maxStudentNumberNum },
      ]

      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('settings')
          .update({ value: update.value })
          .eq('key', update.key)

        if (updateError) throw updateError
      }

      setSuccess('설정이 성공적으로 저장되었습니다')
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setError(err.message || '설정 저장 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>최대값 설정</CardTitle>
        <CardDescription>
          사용자가 입력할 수 있는 학년, 반, 번호의 최대값을 설정합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxGrade">최대 학년</Label>
              <Input
                id="maxGrade"
                type="number"
                placeholder="3"
                min="1"
                max="10"
                value={maxGrade}
                onChange={(e) => setMaxGrade(e.target.value)}
                disabled={loading}
                required
              />
              <p className="text-sm text-muted-foreground">
                사용자가 선택할 수 있는 최대 학년 (1~10)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxClass">최대 반</Label>
              <Input
                id="maxClass"
                type="number"
                placeholder="20"
                min="1"
                max="50"
                value={maxClass}
                onChange={(e) => setMaxClass(e.target.value)}
                disabled={loading}
                required
              />
              <p className="text-sm text-muted-foreground">
                사용자가 선택할 수 있는 최대 반 (1~50)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxStudentNumber">최대 번호</Label>
              <Input
                id="maxStudentNumber"
                type="number"
                placeholder="50"
                min="1"
                max="100"
                value={maxStudentNumber}
                onChange={(e) => setMaxStudentNumber(e.target.value)}
                disabled={loading}
                required
              />
              <p className="text-sm text-muted-foreground">
                사용자가 선택할 수 있는 최대 번호 (1~100)
              </p>
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? '저장 중...' : '설정 저장'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
