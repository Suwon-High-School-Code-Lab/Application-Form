import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { FileText, Users, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Application Form</h1>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-5xl px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-5xl font-bold tracking-tight">
            Welcome to the Application Portal
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Submit your application with our easy-to-use form system. Track your submission and get real-time updates.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/apply">
              <Button size="lg">
                Start Application
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center space-y-4 p-6 rounded-lg border bg-card">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Easy Application</h3>
            <p className="text-muted-foreground">
              Fill out a simple form with dynamic questions tailored to your needs
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg border bg-card">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Track Progress</h3>
            <p className="text-muted-foreground">
              Save drafts and view your submission status anytime
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg border bg-card">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your data is protected with enterprise-grade security
            </p>
          </div>
        </div>

        <div className="mt-16 p-8 rounded-lg border bg-card text-center">
          <h3 className="text-2xl font-semibold mb-4">Ready to get started?</h3>
          <p className="text-muted-foreground mb-6">
            Create an account or login to begin your application
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/apply">
              <Button>Apply Now</Button>
            </Link>
            <Link href="/results">
              <Button variant="outline">View Results</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Application Form System. Built with Next.js and Supabase.</p>
        </div>
      </footer>
    </div>
  )
}
