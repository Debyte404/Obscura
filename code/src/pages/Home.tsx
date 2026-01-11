import React from 'react'
import { useAuth } from '@/contexts/authStore'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Welcome{user ? `, ${user.displayName || user.email}` : ''}</h2>
        <p className="mt-4 text-neutral-300">This is the protected Home page.</p>
      </div>
    </div>
  )
}
