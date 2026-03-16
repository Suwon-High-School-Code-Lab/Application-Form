import { createClient } from '@/lib/supabase/server'
import { SubmissionsTable } from '@/components/admin/SubmissionsTable'

export default async function AdminResultsPage() {
  const supabase = await createClient()
  
  const [{ data: submissions, error: submissionsError }, { data: questions, error: questionsError }, { data: profiles, error: profilesError }] = await Promise.all([
    supabase
      .from('form_submissions')
      .select('*')
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: false }),
    supabase
      .from('form_questions')
      .select('id, title, content, answer_type')
      .order('order', { ascending: true }),
    supabase
      .from('profiles')
      .select('id, email, grade, class, student_number')
  ])

  if (submissionsError || questionsError || profilesError) {
    console.error('Error fetching data:', submissionsError || questionsError || profilesError)
    return <div>지원서 목록을 불러오는 중 오류가 발생했습니다.</div>
  }

  const profilesMap: Record<string, any> = {}
  profiles?.forEach((p) => {
    profilesMap[p.id] = p
  })

  const submissionsWithProfiles = submissions?.map(submission => ({
    ...submission,
    profiles: profilesMap[submission.user_id]
  })) || []

  const questionsMap: Record<string, any> = {}
  questions?.forEach((q) => {
    questionsMap[q.id] = q
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">지원서 제출 현황</h1>
        <p className="text-muted-foreground mt-2">
          총 {submissionsWithProfiles.length}개의 지원서가 제출되었습니다.
        </p>
      </div>
      
      <SubmissionsTable submissions={submissionsWithProfiles} questions={questionsMap} />
    </div>
  )
}
