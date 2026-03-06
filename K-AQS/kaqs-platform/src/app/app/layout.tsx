import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/layout/LogoutButton'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/auth')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border-subtle sticky top-0 z-10 bg-bg-base/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/app" className="font-mono text-sm text-accent tracking-widest uppercase hover:opacity-80 transition-opacity">
            K-A-Q-S™
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-xs text-text-muted hidden sm:block">{session.email}</span>
            {session.role === 'admin' && (
              <Link href="/admin" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
                Админ
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {children}
      </main>
    </div>
  )
}
