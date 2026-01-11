import React, { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut as firebaseSignOut
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { AuthContext } from './authStore'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {})

    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  async function signOut() {
    await firebaseSignOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
