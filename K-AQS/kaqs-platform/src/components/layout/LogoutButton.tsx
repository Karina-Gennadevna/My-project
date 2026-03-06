'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={logout}
      className="text-xs text-text-muted hover:text-text-secondary transition-colors"
    >
      Выйти
    </button>
  )
}
