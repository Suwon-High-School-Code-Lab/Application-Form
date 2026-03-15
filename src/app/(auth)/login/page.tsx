import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function LoginPage() {
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
        
        <LoginForm />
        
        <p className="text-center text-sm text-muted-foreground animate-fade-in">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
