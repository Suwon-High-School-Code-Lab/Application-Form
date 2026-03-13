'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AnswerType } from '@/lib/types/database.types'
import { X } from 'lucide-react'

interface QuestionEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question?: {
    id: string
    order: number
    title: string
    content: string | null
    answer_type: AnswerType
    options: any
    required: boolean
  }
  onSave: (question: any) => Promise<void>
}

export function QuestionEditor({ open, onOpenChange, question, onSave }: QuestionEditorProps) {
  const [title, setTitle] = useState(question?.title || '')
  const [content, setContent] = useState(question?.content || '')
  const [answerType, setAnswerType] = useState<AnswerType>(question?.answer_type || 'short_text')
  const [options, setOptions] = useState<string[]>(
    question?.options ? (Array.isArray(question.options) ? question.options : []) : []
  )
  const [minNumber, setMinNumber] = useState<string>(
    question?.options?.min !== undefined ? String(question.options.min) : ''
  )
  const [maxNumber, setMaxNumber] = useState<string>(
    question?.options?.max !== undefined ? String(question.options.max) : ''
  )
  const [required, setRequired] = useState(question?.required ?? true)
  const [loading, setLoading] = useState(false)

  const handleAddOption = () => {
    setOptions([...options, ''])
  }

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      let optionsValue = null
      if (answerType === 'multiple_choice' || answerType === 'checkbox') {
        optionsValue = options.filter(o => o.trim())
      } else if (answerType === 'number') {
        optionsValue = {
          min: minNumber !== '' ? Number(minNumber) : undefined,
          max: maxNumber !== '' ? Number(maxNumber) : undefined,
        }
      }

      await onSave({
        id: question?.id,
        title,
        content: content || null,
        answer_type: answerType,
        options: optionsValue,
        required,
        order: question?.order || 0,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving question:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? '질문 수정' : '질문 추가'}</DialogTitle>
          <DialogDescription>
            지원서 질문을 생성하거나 수정합니다. 내용 필드에서 마크다운을 사용할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">질문 제목 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="질문 제목을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용 (마크다운)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="추가 설명이나 안내사항 (선택사항)"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answerType">답변 유형 *</Label>
            <Select value={answerType} onValueChange={(value) => setAnswerType(value as AnswerType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short_text">짧은 텍스트</SelectItem>
                <SelectItem value="long_text">긴 텍스트</SelectItem>
                <SelectItem value="number">숫자</SelectItem>
                <SelectItem value="multiple_choice">객관식</SelectItem>
                <SelectItem value="checkbox">체크박스</SelectItem>
                <SelectItem value="file_upload">파일 업로드</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {answerType === 'number' && (
            <div className="space-y-2">
              <Label>숫자 범위 (선택사항)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minNumber">최솟값</Label>
                  <Input
                    id="minNumber"
                    type="number"
                    value={minNumber}
                    onChange={(e) => setMinNumber(e.target.value)}
                    placeholder="제한 없음"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxNumber">최댓값</Label>
                  <Input
                    id="maxNumber"
                    type="number"
                    value={maxNumber}
                    onChange={(e) => setMaxNumber(e.target.value)}
                    placeholder="제한 없음"
                  />
                </div>
              </div>
            </div>
          )}

          {(answerType === 'multiple_choice' || answerType === 'checkbox') && (
            <div className="space-y-2">
              <Label>선택지</Label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`선택지 ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddOption}>
                  선택지 추가
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={required}
              onCheckedChange={setRequired}
            />
            <Label htmlFor="required">필수 항목</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={loading || !title}>
            {loading ? '저장 중...' : '저장'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
