'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/lib/hooks/useAuth'
import { FileText, Users, Shield } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto max-w-5xl px-4 py-16">
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            수원고등학교 동아리
          </div>
          <h2 className="text-5xl font-bold tracking-tight">
            Code Lab 지원하기
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            코딩과 컴퓨터 공학을 좋아하는 학생들을 위한 동아리입니다. <br />
            온라인 지원서를 작성하고 결과를 확인할 수 있습니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center space-y-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 animate-slide-up">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">프로젝트 중심 활동</h3>
            <p className="text-muted-foreground">
              웹, 게임, 프로그램 등 다양한 프로젝트를 직접 만들어봅니다
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">함께 배우는 코딩</h3>
            <p className="text-muted-foreground">
              C, Asm, Python, Web 등 다양한 기술을 서로 배우고 공유합니다
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">실제 개발 경험</h3>
            <p className="text-muted-foreground">
              아이디어를 코드로 만들며 개발 경험을 쌓을 수 있습니다
            </p>
          </div>
        </div>

        <div className="mt-16 p-8 rounded-lg border bg-gradient-to-br from-card to-muted/20 text-center animate-scale-in">
          <h3 className="text-2xl font-semibold mb-4">Code Lab 지원하기!</h3>
          {user ? (
            <>
              <p className="text-muted-foreground mb-6">
                Code Lab 지원을 위해 설문지를 작성해주세요!
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/apply">
                  <Button className="hover:scale-105 transition-transform">지원서 작성하기</Button>
                </Link>
                <Link href="/results">
                  <Button variant="outline" className="hover:scale-105 transition-transform">지원 결과 확인하기</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                Code Lab 지원을 위해 회원가입 또는 로그인 해주세요
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/signup">
                  <Button className="hover:scale-105 transition-transform">회원가입</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="hover:scale-105 transition-transform">로그인</Button>
                </Link>
              </div>
            </>
          )}
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
