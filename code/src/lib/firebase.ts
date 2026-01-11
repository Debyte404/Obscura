// src/lib/firebase.ts
// This file initializes Firebase and exports auth helpers
// You will NEVER put backend logic here
/// <reference types="vite/client" />

import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// 🔴 Replace these values with your Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig)

// Firebase Auth instance (used everywhere)
export const auth = getAuth(app)

// Google provider (for Google sign-in)
export const googleProvider = new GoogleAuthProvider()
