'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  children: React.ReactNode
  existingId?: string
  restart?: boolean
}

export default function StartAssessmentButton({ children, existingId, restart }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      if (restart && existingId) {
        // Create a new assessment
        const res = await fetch('/api/assessment', { method: 'POST' })
        const data = await res.json()
        router.push(`/app/assessment?id=${data.id}`)
      } else if (existingId) {
        router.push(`/app/assessment?id=${existingId}`)
      } else {
        const res = await fetch('/api/assessment', { method: 'POST' })
        const data = await res.json()
        router.push(`/app/assessment?id=${data.id}`)
      }
    } catch {
      alert('Ошибка при создании диагностики')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-6 py-2.5 rounded-card text-sm font-medium bg-accent text-white hover:bg-accent-light
        transition-all active:scale-[0.98] disabled:opacity-50 whitespace-nowrap"
    >
      {loading ? 'Загрузка...' : children}
    </button>
  )
}
