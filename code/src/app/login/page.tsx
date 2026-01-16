"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase-client";
import { Button } from "@/components/ui/button";
import Antigravity from "@/components/Antigravity";
import GlassSurface from "@/components/GlassSurface";
import { loginWithGoogleAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);

    try {
      // 1. Client-side Google Login
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // 2. Server-side verification & session creation
      const res = await loginWithGoogleAction(idToken);

      if (res.success) {
        if (res.isNewUser) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(res.error || "Authentication failed on server.");
      }
    } catch (err: any) {
      console.error("Login Check Error:", err);
      // Helpful user error if Popup closed
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign in cancelled.");
      } else {
        setError("Failed to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 relative overflow-hidden">
        {/* Background Animation */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}>
        <Antigravity
          count={700}
          magnetRadius={5}
          ringRadius={6}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={0.7}
          lerpSpeed={0.05}
          color={'#099efb'}
          autoAnimate={true}
          particleVariance={1}
          particleShape={'tetrahedron'}
        />
      </div>

      <GlassSurface 
          width={400} 
          height="auto"
          borderRadius={24}
      >
        <div className="relative w-full max-w-md rounded-xl p-8 z-10 font-[family-name:var(--font-geist-sans)]">
            
          {/* App Title */}
          <h1 className="text-3xl font-bold text-center mb-2">
            <span className="text-blue-500">Ob</span>
            <span className="text-red-500">scura</span>
          </h1>

          <p className="mb-8 text-center text-sm text-neutral-400">
            Anonymous. Private. Secure.
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-md bg-red-950/50 border border-red-800 p-3 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Google login */}
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            variant="outline"
            className="w-full bg-neutral-900/50 border-neutral-700 hover:bg-neutral-800 text-neutral-200 h-11"
          >
            {loading ? "Connecting..." : "Continue with Google"}
          </Button>

          <p className="mt-6 text-center text-xs text-neutral-600">
            By continuing, you agree to our Terms of Service.
          </p>
        </div>
      </GlassSurface>
    </div>
  )
}
