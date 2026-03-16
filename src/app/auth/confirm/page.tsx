'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function ConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setStatus('error')
          setErrorMessage(error.message)
          return
        }

        if (session) {
          setStatus('success')
        } else {
          setStatus('error')
          setErrorMessage('이메일 인증에 실패했습니다.')
        }
      } catch (err: any) {
        setStatus('error')
        setErrorMessage(err.message || '이메일 인증 중 오류가 발생했습니다.')
      }
    }

    confirmEmail()
  }, [supabase])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-linear-to-br from-background to-muted/20">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader>
            <CardTitle>이메일 인증 중...</CardTitle>
            <CardDescription>잠시만 기다려주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-linear-to-br from-background to-muted/20">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">수원고등학교 Code Lab</h1>
            <p className="text-muted-foreground">동아리 지원 시스템</p>
          </div>
          
          <Card className="w-full max-w-md animate-scale-in">
            <CardHeader>
              <CardTitle>이메일 인증 완료</CardTitle>
              <CardDescription>회원가입이 성공적으로 완료되었습니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="animate-fade-in bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <p className="font-medium text-lg mb-2">✅ 이메일 인증이 완료되었습니다!</p>
                  <p className="text-sm">
                    축하합니다! 이제 Code Lab 지원 시스템을 사용하실 수 있습니다.
                  </p>
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => router.push('/')} 
                  className="w-full"
                  size="lg"
                >
                  홈으로 이동
                </Button>
                <Button 
                  onClick={() => router.push('/apply')} 
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  지원서 작성하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-linear-to-br from-background to-muted/20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader>
          <CardTitle>이메일 인증 실패</CardTitle>
          <CardDescription>인증 중 문제가 발생했습니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive" className="animate-fade-in">
            <AlertDescription>
              <p className="font-medium mb-2">❌ 이메일 인증에 실패했습니다</p>
              <p className="text-sm">{errorMessage}</p>
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Button 
              onClick={() => router.push('/signup')} 
              className="w-full"
            >
              다시 회원가입하기
            </Button>
            <Button 
              onClick={() => router.push('/login')} 
              variant="outline"
              className="w-full"
            >
              로그인 페이지로 이동
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
