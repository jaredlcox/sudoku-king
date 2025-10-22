"use server"

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase/config"

export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to sign in"
    return { success: false, error: errorMessage }
  }
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create account"
    return { success: false, error: errorMessage }
  }
}
