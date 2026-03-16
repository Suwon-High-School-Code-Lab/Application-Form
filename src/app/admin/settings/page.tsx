'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SettingsForm } from '@/components/admin/SettingsForm'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [maxGrade, setMaxGrade] = useState(3)
  const [maxClass, setMaxClass] = useState(20)
  const [maxStudentNumber, setMaxStudentNumber] = useState(50)
  const supabase = createClient()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: settings, error } = await supabase
          .from('settings')
          .select('key, value')
          .in('key', ['max_grade', 'max_class', 'max_student_number'])

        if (error) throw error

        const settingsMap = settings?.reduce((acc, setting) => {
          acc[setting.key] = setting.value
          return acc
        }, {} as Record<string, number>) || {}

        setMaxGrade(settingsMap.max_grade || 3)
        setMaxClass(settingsMap.max_class || 20)
        setMaxStudentNumber(settingsMap.max_student_number || 50)
      } catch (err: any) {
        console.error('Error fetching settings:', err)
        setError('설정을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [supabase])

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">로딩 중...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">시스템 설정</h1>
        <p className="text-muted-foreground mt-2">
          학년, 반, 번호의 최대값을 설정합니다.
        </p>
      </div>
      
      <SettingsForm 
        maxGrade={maxGrade}
        maxClass={maxClass}
        maxStudentNumber={maxStudentNumber}
      />
    </div>
  )
}
