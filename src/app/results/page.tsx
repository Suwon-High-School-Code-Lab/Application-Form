'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { Database } from '@/lib/types/database.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { Markdown } from '@/components/ui/markdown'

type Question = Pick<Database['public']['Tables']['form_questions']['Row'], 'id' | 'title' | 'content' | 'answer_type'>

type Submission = Database['public']['Tables']['form_submissions']['Row']

export default function ResultsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [questions, setQuestions] = useState<Record<string, Question>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      router.push('/login')
      return
    }
    fetchData()
  }, [user, authLoading])

  const fetchData = async () => {
    if (!user) return

    try {
      const { data: questionsData, error: questionsError } = await supabase
        .from('form_questions')
        .select('id, title, content, answer_type')

      if (questionsError) throw questionsError

      const questionsMap: Record<string, Question> = {}
      questionsData?.forEach((q) => {
        questionsMap[q.id] = q
      })
      setQuestions(questionsMap)

      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatAnswer = (questionId: string, answer: any) => {
    if (Array.isArray(answer)) {
      return answer.join(', ')
    }
    return answer?.toString() || '답변 없음'
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>결과를 불러오는 중...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-5xl p-8">
        <div className="mb-6 animate-fade-in">
          <h2 className="text-3xl font-bold">내 지원서</h2>
          <p className="text-muted-foreground">제출한 지원서를 확인하세요</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 animate-fade-in">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {submissions.length === 0 ? (
          <Card className="animate-scale-in">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                아직 결과가 나오지 않았습니다.
              </p>
              <p className="text-sm text-muted-foreground">
                지원서를 제출하셨다면 결과 발표를 기다려주세요.{' '}
                <Link href="/apply" className="text-primary hover:underline">
                  지원서 작성하기
                </Link>
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission, index) => (
              <Card key={submission.id} className="animate-slide-up hover:shadow-lg transition-shadow" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <CardTitle>내 지원서</CardTitle>
                  <CardDescription>
                    제출일: {new Date(submission.submitted_at).toLocaleString('ko-KR')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(submission.answers as Record<string, any>).map(([questionId, answer]) => {
                    const question = questions[questionId]
                    if (!question) return null

                    return (
                      <div key={questionId} className="space-y-2">
                        <h4 className="font-medium">{question.title}</h4>
                        {question.content && (
                          <Markdown className="text-muted-foreground">{question.content}</Markdown>
                        )}
                        <p className="text-sm bg-muted/50 p-3 rounded-md">
                          {formatAnswer(questionId, answer)}
                        </p>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
