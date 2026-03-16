'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, GripVertical } from 'lucide-react'
import { Database } from '@/lib/types/database.types'

type Question = Database['public']['Tables']['form_questions']['Row']
type AnswerType = Database['public']['Enums']['answer_type']

interface QuestionListProps {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (id: string) => void
}

const answerTypeLabels: Record<AnswerType, string> = {
  short_text: '짧은 텍스트',
  long_text: '긴 텍스트',
  number: '숫자',
  multiple_choice: '객관식',
  checkbox: '체크박스',
  file_upload: '파일 업로드',
}

export function QuestionList({ questions, onEdit, onDelete }: QuestionListProps) {
  return (
    <div className="space-y-4">
      {questions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            아직 질문이 없습니다. "질문 추가" 버튼을 클릭하여 질문을 만드세요.
          </CardContent>
        </Card>
      ) : (
        questions.map((question) => (
          <Card key={question.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2 flex-1">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                <CardTitle className="text-base font-medium">
                  {question.title}
                  {question.required && <span className="text-destructive ml-1">*</span>}
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(question)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(question.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  유형: {answerTypeLabels[question.answer_type]}
                </p>
                {question.content && (
                  <p className="text-sm text-muted-foreground">
                    {question.content.substring(0, 100)}
                    {question.content.length > 100 ? '...' : ''}
                  </p>
                )}
                {(question.answer_type === 'multiple_choice' || question.answer_type === 'checkbox') &&
                  question.options && (
                    <div className="text-sm text-muted-foreground">
                      선택지: {Array.isArray(question.options) ? question.options.join(', ') : ''}
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
