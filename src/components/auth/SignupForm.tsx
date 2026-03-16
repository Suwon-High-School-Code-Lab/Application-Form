'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [grade, setGrade] = useState('')
  const [classNum, setClassNum] = useState('')
  const [studentNumber, setStudentNumber] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [maxGrade, setMaxGrade] = useState(3)
  const [maxClass, setMaxClass] = useState(20)
  const [maxStudentNumber, setMaxStudentNumber] = useState(50)
  const router = useRouter()
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다')
      return
    }

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
      const { data: existingStudent } = await supabase
        .from('profiles')
        .select('id')
        .eq('grade', gradeNum)
        .eq('class', classNumber)
        .eq('student_number', studentNum)
        .maybeSingle()

      if (existingStudent) {
        setError(`${gradeNum}학년 ${classNumber}반 ${studentNum}번은 이미 등록된 학생 정보입니다. 다른 정보를 입력해주세요.`)
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            grade: gradeNum,
            class: classNumber,
            student_number: studentNum,
          }
        }
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      if (err.message?.includes('unique_student_identifier')) {
        setError(`${gradeNum}학년 ${classNumber}반 ${studentNum}번은 이미 등록된 학생 정보입니다. 다른 정보를 입력해주세요.`)
      } else {
        setError(err.message || '회원가입 중 오류가 발생했습니다')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader>
          <CardTitle>회원가입 완료</CardTitle>
          <CardDescription>이메일 인증이 필요합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="animate-fade-in">
            <AlertDescription>
              <p className="font-medium mb-2">가입해주셔서 감사합니다!</p>
              <p className="text-sm">
                <strong>{email}</strong>로 인증 이메일이 발송되었습니다.
                이메일을 확인하고 인증 링크를 클릭해주세요.
              </p>
            </AlertDescription>
          </Alert>
          <Alert className="animate-fade-in">
            <AlertDescription>
              <p className="text-sm">
                이메일 인증을 완료하신 후 로그인해주세요.
              </p>
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => router.push('/login')} 
            className="w-full"
          >
            로그인 페이지로 이동
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md animate-scale-in">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>Code Lab 지원을 위한 계정을 만드세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="animate-fade-in">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">학년</Label>
              <Input
                id="grade"
                type="number"
                placeholder="1"
                min="1"
                max="3"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">반</Label>
              <Input
                id="class"
                type="number"
                placeholder="1"
                min="1"
                max="20"
                value={classNum}
                onChange={(e) => setClassNum(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentNumber">번호</Label>
              <Input
                id="studentNumber"
                type="number"
                placeholder="1"
                min="1"
                max="50"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '계정 생성 중...' : '회원가입'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
