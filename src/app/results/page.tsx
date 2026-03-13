'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

interface Question {
  id: string
  title: string
  content: string | null
  answer_type: string
}

interface Submission {
  id: string
  user_id: string
  answers: Record<string, any>
  submitted_at: string
  status: string
  profiles?: {
    email: string
  }
}

export default function ResultsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [questions, setQuestions] = useState<Record<string, Question>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchData()
  }, [user, isAdmin])

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

      if (isAdmin) {
        const { data, error } = await supabase
          .from('form_submissions')
          .select(`
            *,
            profiles (
              email
            )
          `)
          .eq('status', 'submitted')
          .order('submitted_at', { ascending: false })

        if (error) throw error
        setSubmissions(data || [])
      } else {
        const { data, error } = await supabase
          .from('form_submissions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'submitted')
          .order('submitted_at', { ascending: false })

        if (error) throw error
        setSubmissions(data || [])
      }
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
    return answer?.toString() || 'No answer'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading results...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/">
            <h1 className="text-xl font-bold">Results</h1>
          </Link>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link href="/admin/forms">
                <Button variant="ghost">Admin Panel</Button>
              </Link>
            )}
            <Link href="/apply">
              <Button variant="ghost">Application Form</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">
            {isAdmin ? 'All Submissions' : 'Your Submission'}
          </h2>
          <p className="text-muted-foreground">
            {isAdmin
              ? `Viewing ${submissions.length} submission(s)`
              : 'View your submitted application'}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No submissions found.
              {!isAdmin && (
                <>
                  {' '}
                  <Link href="/apply" className="text-primary hover:underline">
                    Submit your application
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <CardTitle>
                    {isAdmin && submission.profiles
                      ? `Submission by ${submission.profiles.email}`
                      : 'Your Submission'}
                  </CardTitle>
                  <CardDescription>
                    Submitted on {new Date(submission.submitted_at).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(submission.answers).map(([questionId, answer]) => {
                    const question = questions[questionId]
                    if (!question) return null

                    return (
                      <div key={questionId} className="space-y-2">
                        <h4 className="font-medium">{question.title}</h4>
                        {question.content && (
                          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                            <ReactMarkdown>{question.content}</ReactMarkdown>
                          </div>
                        )}
                        <p className="text-sm bg-muted p-3 rounded-md">
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
