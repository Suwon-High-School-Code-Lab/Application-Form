'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UserMenu } from '@/components/UserMenu'
import { useAuth } from '@/lib/hooks/useAuth'
import { FileText, Users, Shield, Code } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">수원고 Code Lab</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu userEmail={user.email} />
            ) : (
              <Link href="/login">
                <Button variant="ghost">로그인</Button>
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-5xl px-4 py-16">
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            수원고등학교 동아리
          </div>
          <h2 className="text-5xl font-bold tracking-tight">
            Code Lab 지원하기
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            코딩과 프로그래밍에 관심 있는 학생들을 위한 동아리입니다.<br />
            간편한 온라인 지원서로 지원하고 결과를 확인하세요.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/apply">
              <Button size="lg" className="hover:scale-105 transition-transform">
                지원서 작성하기
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-transform">
                회원가입
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center space-y-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 animate-slide-up">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">간편한 지원</h3>
            <p className="text-muted-foreground">
              동적 질문 시스템으로 구성된 간단한 지원서 양식
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">진행 상황 추적</h3>
            <p className="text-muted-foreground">
              임시 저장 기능과 실시간 제출 상태 확인
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">안전한 보안</h3>
            <p className="text-muted-foreground">
              엔터프라이즈급 보안으로 개인정보 보호
            </p>
          </div>
        </div>

        <div className="mt-16 p-8 rounded-lg border bg-gradient-to-br from-card to-muted/20 text-center animate-scale-in">
          <h3 className="text-2xl font-semibold mb-4">지금 바로 시작하세요!</h3>
          <p className="text-muted-foreground mb-6">
            계정을 만들거나 로그인하여 Code Lab 지원을 시작하세요
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/apply">
              <Button className="hover:scale-105 transition-transform">지금 지원하기</Button>
            </Link>
            <Link href="/results">
              <Button variant="outline" className="hover:scale-105 transition-transform">결과 확인</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 수원고등학교 Code Lab. Built with Next.js and Supabase.</p>
        </div>
      </footer>
    </div>
  )
}
