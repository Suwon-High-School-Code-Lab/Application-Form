'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DynamicFormField } from '@/components/form/DynamicFormField'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UserMenu } from '@/components/UserMenu'
import Link from 'next/link'

interface Question {
  id: string
  order: number
  title: string
  content: string | null
  answer_type: 'short_text' | 'long_text' | 'number' | 'multiple_choice' | 'checkbox' | 'file_upload'
  options: any
  required: boolean
}

export default function ApplyPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchQuestions()
    if (user) {
      fetchExistingSubmission()
    }
  }, [user])

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('form_questions')
        .select('*')
        .order('order', { ascending: true })

      if (error) throw error
      setQuestions(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchExistingSubmission = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'draft')
        .single()

      if (data) {
        setAnswers(data.answers as Record<string, any>)
      }
    } catch (err) {
    }
  }

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const validateForm = () => {
    for (const question of questions) {
      if (question.required && !answers[question.id]) {
        setError(`필수 항목을 입력해주세요: ${question.title}`)
        return false
      }
    }
    return true
  }

  const handleSaveDraft = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const { data: existing } = await supabase
        .from('form_submissions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'draft')
        .single()

      if (existing) {
        const { error } = await supabase
          .from('form_submissions')
          .update({ answers })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('form_submissions')
          .insert({
            user_id: user.id,
            answers,
            status: 'draft',
          })

        if (error) throw error
      }

      alert('임시 저장되었습니다!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push('/login')
      return
    }

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const { data: existing } = await supabase
        .from('form_submissions')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existing) {
        const { error } = await supabase
          .from('form_submissions')
          .update({
            answers,
            status: 'submitted',
          })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('form_submissions')
          .insert({
            user_id: user.id,
            answers,
            status: 'submitted',
          })

        if (error) throw error
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/results')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>지원서를 불러오는 중...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md animate-scale-in">
          <CardHeader>
            <CardTitle>지원서가 제출되었습니다!</CardTitle>
            <CardDescription>
              지원서가 성공적으로 제출되었습니다. 결과 페이지로 이동합니다...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/">
            <h1 className="text-xl font-bold">수원고 Code Lab 지원서</h1>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu userEmail={user.email} />
            ) : (
              <Link href="/login">
                <Button variant="ghost">로그인</Button>
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl p-8">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Code Lab 지원서</CardTitle>
            <CardDescription>
              * 표시가 있는 모든 필수 항목을 작성해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {questions.map((question) => (
                <DynamicFormField
                  key={question.id}
                  question={question}
                  value={answers[question.id]}
                  onChange={(value) => handleAnswerChange(question.id, value)}
                />
              ))}

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={submitting}
                  className="hover:scale-105 transition-transform"
                >
                  임시 저장
                </Button>
                <Button type="submit" disabled={submitting} className="hover:scale-105 transition-transform">
                  {submitting ? '제출 중...' : '지원서 제출'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
