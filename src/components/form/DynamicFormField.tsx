'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { AnswerType } from '@/lib/types/database.types'
import ReactMarkdown from 'react-markdown'

interface DynamicFormFieldProps {
  question: {
    id: string
    title: string
    content: string | null
    answer_type: AnswerType
    options: any
    required: boolean
  }
  value: any
  onChange: (value: any) => void
}

export function DynamicFormField({ question, value, onChange }: DynamicFormFieldProps) {
  const renderField = () => {
    switch (question.answer_type) {
      case 'short_text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={question.required}
          />
        )

      case 'long_text':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={question.required}
            rows={6}
          />
        )

      case 'number':
        const numberOptions = question.options || {}
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={question.required}
            min={numberOptions.min}
            max={numberOptions.max}
          />
        )

      case 'multiple_choice':
        const options = Array.isArray(question.options) ? question.options : []
        return (
          <RadioGroup value={value || ''} onValueChange={onChange} required={question.required}>
            {options.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'checkbox':
        const checkboxOptions = Array.isArray(question.options) ? question.options : []
        const selectedValues = Array.isArray(value) ? value : []
        
        return (
          <div className="space-y-2">
            {checkboxOptions.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selectedValues, option])
                    } else {
                      onChange(selectedValues.filter((v: string) => v !== option))
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )

      case 'file_upload':
        return (
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                onChange(file.name)
              }
            }}
            required={question.required}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">
        {question.title}
        {question.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {question.content && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{question.content}</ReactMarkdown>
        </div>
      )}
      
      {renderField()}
    </div>
  )
}
