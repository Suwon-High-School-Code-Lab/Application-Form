'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { QuestionEditor } from '@/components/admin/QuestionEditor'
import { QuestionList } from '@/components/admin/QuestionList'
import { Plus } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Database } from '@/lib/types/database.types'

type Question = Database['public']['Tables']['form_questions']['Row']

export default function FormsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Omit<Question, 'created_at' | 'updated_at'> | undefined>()
  const supabase = createClient()

  useEffect(() => {
    fetchQuestions()
  }, [])

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

  const handleSave = async (question: any) => {
    try {
      if (question.id) {
        const { error } = await supabase
          .from('form_questions')
          .update({
            title: question.title,
            content: question.content,
            answer_type: question.answer_type,
            options: question.options,
            required: question.required,
          })
          .eq('id', question.id)

        if (error) throw error
      } else {
        const maxOrder = questions.length > 0 ? Math.max(...questions.map(q => q.order)) : 0
        const { error } = await supabase
          .from('form_questions')
          .insert({
            ...question,
            order: maxOrder + 1,
          })

        if (error) throw error
      }

      await fetchQuestions()
      setEditingQuestion(undefined)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const handleEdit = (question: Question) => {
    const { created_at, updated_at, ...questionWithoutTimestamps } = question
    setEditingQuestion(questionWithoutTimestamps)
    setEditorOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      const { error } = await supabase
        .from('form_questions')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchQuestions()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleAddNew = () => {
    setEditingQuestion(undefined)
    setEditorOpen(true)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">로딩 중...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">지원서 양식 관리</h1>
          <p className="text-muted-foreground">Code Lab 지원서 질문을 생성하고 관리하세요</p>
        </div>
        <Button onClick={handleAddNew} className="hover:scale-105 transition-transform">
          <Plus className="mr-2 h-4 w-4" />
          질문 추가
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <QuestionList
        questions={questions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <QuestionEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        question={editingQuestion}
        onSave={handleSave}
      />
    </div>
  )
}
