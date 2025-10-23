import type { Difficulty } from "./types"

export const DIFFICULTY_LEVELS: Difficulty[] = ["easy", "medium", "hard", "expert", "master", "extreme"]

export const TIME_CONSTRAINTS = {
  MIN_SECONDS: 30,
  MAX_SECONDS: 3599, // 59:59
}

export interface TimeValidation {
  valid: boolean
  error?: string
  seconds?: number
}

// Validate time input in MM:SS format
export const validateTimeInput = (input: string): TimeValidation => {
  const timeRegex = /^(\d{1,2}):([0-5]\d)$/
  const match = input.match(timeRegex)

  if (!match) {
    return {
      valid: false,
      error: "Invalid format. Use MM:SS (e.g., 5:23)",
    }
  }

  const minutes = Number.parseInt(match[1], 10)
  const seconds = Number.parseInt(match[2], 10)
  const totalSeconds = minutes * 60 + seconds

  if (totalSeconds < TIME_CONSTRAINTS.MIN_SECONDS) {
    return {
      valid: false,
      error: `Time must be at least ${TIME_CONSTRAINTS.MIN_SECONDS} seconds`,
    }
  }

  if (totalSeconds > TIME_CONSTRAINTS.MAX_SECONDS) {
    return {
      valid: false,
      error: "Time must be less than 60 minutes",
    }
  }

  return {
    valid: true,
    seconds: totalSeconds,
  }
}

// Format seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

// Check if time is a potential PR
export const isPotentialPR = (
  timeSeconds: number,
  difficulty: Difficulty,
  currentPRs: Record<Difficulty, number | null>,
): boolean => {
  const currentPR = currentPRs[difficulty]
  return currentPR === null || timeSeconds < currentPR
}
