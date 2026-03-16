'use client'

import { useState } from 'react'
import { Database } from '@/lib/types/database.types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, Search } from 'lucide-react'
import { Markdown } from '@/components/ui/markdown'

type Submission = Database['public']['Tables']['form_submissions']['Row'] & {
  profiles?: {
    email: string
    grade: number | null
    class: number | null
    student_number: number | null
  }
}

type Question = {
  id: string
  title: string
  content: string | null
  answer_type: string
}

interface SubmissionsTableProps {
  submissions: Submission[]
  questions: Record<string, Question>
}

export function SubmissionsTable({ submissions, questions }: SubmissionsTableProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleView = (submission: Submission) => {
    setSelectedSubmission(submission)
    setDialogOpen(true)
  }

  const formatAnswer = (questionId: string, answer: any) => {
    if (answer === null || answer === undefined) {
      return '답변 없음'
    }
    if (Array.isArray(answer)) {
      return answer.join(', ')
    }
    return answer.toString()
  }

  const formatStudentInfo = (profile: Submission['profiles']) => {
    if (!profile) return 'N/A'
    const parts = []
    if (profile.grade) parts.push(`${profile.grade}학년`)
    if (profile.class) parts.push(`${profile.class}반`)
    if (profile.student_number) parts.push(`${profile.student_number}번`)
    return parts.length > 0 ? parts.join(' ') : 'N/A'
  }

  const filteredSubmissions = submissions.filter((submission) => {
    if (!searchQuery) return true
    const email = submission.profiles?.email?.toLowerCase() || ''
    const studentInfo = formatStudentInfo(submission.profiles).toLowerCase()
    return email.includes(searchQuery.toLowerCase()) || studentInfo.includes(searchQuery.toLowerCase())
  })

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="이메일 또는 학년/반/번호로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredSubmissions.length}개 표시 중
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이메일</TableHead>
                  <TableHead>학생 정보</TableHead>
                  <TableHead>제출 시간</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? '검색 결과가 없습니다.' : '제출된 지원서가 없습니다.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {submission.profiles?.email || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {formatStudentInfo(submission.profiles)}
                      </TableCell>
                      <TableCell>
                        {new Date(submission.submitted_at).toLocaleString('ko-KR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(submission)}
                          className="hover:scale-105 transition-transform"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>지원서 상세 내용</DialogTitle>
            <DialogDescription>
              {selectedSubmission?.profiles?.email || 'N/A'} ({formatStudentInfo(selectedSubmission?.profiles)})
              <br />
              제출 시간: {selectedSubmission && new Date(selectedSubmission.submitted_at).toLocaleString('ko-KR')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-6 mt-4">
              {Object.entries(selectedSubmission.answers as Record<string, any>).map(([questionId, answer]) => {
                const question = questions[questionId]
                if (!question) return null

                return (
                  <div key={questionId} className="space-y-2 border-b pb-4 last:border-b-0">
                    <h4 className="font-semibold text-lg">{question.title}</h4>
                    {question.content && (
                      <Markdown className="text-sm text-muted-foreground">{question.content}</Markdown>
                    )}
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">
                        {formatAnswer(questionId, answer)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
