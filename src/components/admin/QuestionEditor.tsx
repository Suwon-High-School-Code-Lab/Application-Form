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
      await onSave({
        id: question?.id,
        title,
        content: content || null,
        answer_type: answerType,
        options: (answerType === 'multiple_choice' || answerType === 'checkbox') ? options.filter(o => o.trim()) : null,
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
          <DialogTitle>{question ? 'Edit Question' : 'Add Question'}</DialogTitle>
          <DialogDescription>
            Create or edit a form question. Use markdown in the content field for rich formatting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Question Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter question title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (Markdown)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Optional additional content or instructions"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answerType">Answer Type *</Label>
            <Select value={answerType} onValueChange={(value) => setAnswerType(value as AnswerType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short_text">Short Text</SelectItem>
                <SelectItem value="long_text">Long Text</SelectItem>
                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="file_upload">File Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(answerType === 'multiple_choice' || answerType === 'checkbox') && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
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
                  Add Option
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
            <Label htmlFor="required">Required</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading || !title}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
