'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Database } from '@/lib/types/database.types'
import { Markdown } from '@/components/ui/markdown'

interface DynamicFormFieldProps {
  question: Pick<Database['public']['Tables']['form_questions']['Row'], 'id' | 'title' | 'content' | 'answer_type' | 'options' | 'required'>
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
            required={question.required ?? undefined}
          />
        )

      case 'long_text':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={question.required ?? undefined}
            rows={6}
          />
        )

      case 'number':
        const numberOptions = (question.options as { min?: number; max?: number }) || {}
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={question.required ?? undefined}
            min={numberOptions.min}
            max={numberOptions.max}
          />
        )

      case 'multiple_choice':
        const options = Array.isArray(question.options) ? (question.options as string[]) : []
        return (
          <RadioGroup value={value || ''} onValueChange={onChange} required={question.required ?? undefined}>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'checkbox':
        const checkboxOptions = Array.isArray(question.options) ? (question.options as string[]) : []
        const selectedValues = Array.isArray(value) ? value : []
        
        return (
          <div className="space-y-2">
            {checkboxOptions.map((option, index) => (
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
            required={question.required ?? undefined}
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
        <Markdown>{question.content}</Markdown>
      )}
      
      {renderField()}
    </div>
  )
}
