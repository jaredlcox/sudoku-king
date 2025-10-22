"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, signOut as firebaseSignOut, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { getUser, createUser } from "@/lib/firebase/firestore"
import type { User } from "@/lib/firebase/types"

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser)

        // Get or create user document
        let userData = await getUser(firebaseUser.uid)

        if (!userData) {
          // Create new user document
          await createUser(
            firebaseUser.uid,
            firebaseUser.email || "",
            firebaseUser.displayName || "Sudoku Player",
            firebaseUser.photoURL || undefined,
          )
          userData = await getUser(firebaseUser.uid)
        }

        setUser(userData)
      } else {
        setFirebaseUser(null)
        setUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
    setFirebaseUser(null)
  }

  return <AuthContext.Provider value={{ user, firebaseUser, loading, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
