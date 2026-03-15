import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/admin/SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: settings, error } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['max_grade', 'max_class', 'max_student_number'])

  if (error) {
    console.error('Error fetching settings:', error)
    return <div>설정을 불러오는 중 오류가 발생했습니다.</div>
  }

  const settingsMap = settings?.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, number>) || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">시스템 설정</h1>
        <p className="text-muted-foreground mt-2">
          학년, 반, 번호의 최대값을 설정합니다.
        </p>
      </div>
      
      <SettingsForm 
        maxGrade={settingsMap.max_grade || 3}
        maxClass={settingsMap.max_class || 20}
        maxStudentNumber={settingsMap.max_student_number || 50}
      />
    </div>
  )
}
