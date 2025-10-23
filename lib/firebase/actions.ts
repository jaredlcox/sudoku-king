import { createResult, getUserPRs } from "./firestore"
import type { Difficulty } from "./types"
import { validateTimeInput, isPotentialPR } from "./validation"
import { doc, setDoc, Timestamp } from "firebase/firestore"
import { prsCollection } from "./firestore"

export async function logSolveTime(
  userId: string,
  squadId: string,
  difficulty: Difficulty,
  timeInput: string,
  integrityHint?: string,
) {
  // Validate time input
  const validation = validateTimeInput(timeInput)
  if (!validation.valid || !validation.seconds) {
    return {
      success: false,
      error: validation.error || "Invalid time input",
    }
  }

  try {
    // Check if this is a PR
    const currentPRs = await getUserPRs(userId)
    const isNewPR = isPotentialPR(validation.seconds, difficulty, currentPRs)

    // Create result
    const resultId = await createResult(userId, squadId, difficulty, validation.seconds, integrityHint)

    // If it's a PR, update the PRs collection
    if (isNewPR) {
      const prDoc = doc(prsCollection)
      await setDoc(prDoc, {
        id: prDoc.id,
        userId,
        difficulty,
        timeSeconds: validation.seconds,
        achievedAt: Timestamp.now(),
        resultId,
      })
    }

    return {
      success: true,
      isNewPR,
      timeSeconds: validation.seconds,
      resultId,
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to log time"
    return {
      success: false,
      error: errorMessage,
    }
  }
}
