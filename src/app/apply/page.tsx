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
import Link from 'next/link'

interface Question {
  id: string
  order: number
  title: string
  content: string | null
  answer_type: 'short_text' | 'long_text' | 'multiple_choice' | 'checkbox' | 'file_upload'
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
        setError(`Please answer: ${question.title}`)
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

      alert('Draft saved successfully!')
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
        <p>Loading form...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Application Submitted!</CardTitle>
            <CardDescription>
              Your application has been successfully submitted. Redirecting to results...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/">
            <h1 className="text-xl font-bold">Application Form</h1>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/results">
                <Button variant="ghost">View Results</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl p-8">
        <Card>
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>
              Please fill out all required fields marked with *
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
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
                >
                  Save Draft
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
