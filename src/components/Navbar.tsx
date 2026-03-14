'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UserMenu } from '@/components/UserMenu'
import { useAuth } from '@/lib/hooks/useAuth'
import { Code, Shield } from 'lucide-react'

export function Navbar() {
  const { user, isAdmin } = useAuth()

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Code className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">수원고 Code Lab</h1>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {isAdmin && (
                <Button variant="ghost" asChild>
                  <Link href="/admin/forms">
                    <Shield className="mr-2 h-4 w-4" />
                    관리자 패널
                  </Link>
                </Button>
              )}
              <UserMenu userEmail={user.email} />
            </>
          ) : (
            <Link href="/login">
              <Button variant="ghost">로그인</Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
