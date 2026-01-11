/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Login.tsx
// Frontend-only login page for Obscura
// Uses Firebase Email/Password + Google Auth
// Dark theme with red & blue accents only

import { useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { Button } from "@/components/ui/button"

export default function Login() {
  // Local state for form inputs
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Email + Password Login
   * Firebase handles password security internally
   */
  async function handleEmailLogin() {
    setLoading(true)
    setError(null)

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      // Firebase user object
      const user = userCredential.user

      // 🔑 This token is what your backend will verify later
      const token = await user.getIdToken()

      console.log("Logged in user:", user)
      console.log("Firebase ID Token:", token)

      // TODO:
      // Send `token` to your backend
      // Backend verifies it and creates/returns Obscura session
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Google Login
   * Uses popup (simpler for MVP)
   */
  async function handleGoogleLogin() {
    setLoading(true)
    setError(null)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const token = await user.getIdToken()

      console.log("Google user:", user)
      console.log("Firebase ID Token:", token)

      // TODO:
      // Send token to backend for verification
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
        
        {/* App Title */}
        <h1 className="text-3xl font-bold text-center">
          <span className="text-blue-500">Ob</span>
          <span className="text-red-500">scura</span>
        </h1>

        <p className="mt-2 text-center text-sm text-neutral-400">
          Anonymous. Private. Secure.
        </p>

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-md bg-red-950 border border-red-800 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Email input */}
        <div className="mt-6">
          <label className="text-sm text-neutral-400">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password input */}
        <div className="mt-4">
          <label className="text-sm text-neutral-400">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:border-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Email login button */}
        <Button
          onClick={handleEmailLogin}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Signing in..." : "Sign in with Email"}
        </Button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-800" />
          <span className="text-xs text-neutral-500">OR</span>
          <div className="h-px flex-1 bg-neutral-800" />
        </div>

        {/* Google login */}
        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          variant="outline"
          className="w-full border-neutral-700 hover:bg-neutral-800"
        >
          Continue with Google
        </Button>
      </div>
    </div>
  )
}
