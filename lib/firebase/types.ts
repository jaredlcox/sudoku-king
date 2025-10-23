export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "extreme"

export type Privacy = "public" | "squad" | "private"

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: Date
  privacy: Privacy
  squadIds: string[]
}

export interface Squad {
  id: string
  name: string
  createdBy: string
  createdAt: Date
  memberIds: string[]
  inviteCode: string
}

export interface Result {
  id: string
  userId: string
  squadId: string
  difficulty: Difficulty
  timeSeconds: number
  timestamp: Date
  weekStart: Date // Monday of the week
  integrityHint?: string
}

export interface PersonalRecord {
  id: string
  userId: string
  difficulty: Difficulty
  timeSeconds: number
  achievedAt: Date
  resultId: string
}

export interface WeeklyLeader {
  id: string
  squadId: string
  weekStart: Date // Monday
  userId: string
  solveCount: number
  bestTime: number
  difficulty: Difficulty
}

export interface UserStats {
  totalSolves: number
  currentStreak: number
  longestStreak: number
  lastSolveDate?: Date
  prsByDifficulty: {
    easy?: number
    medium?: number
    hard?: number
    expert?: number
    master?: number
    extreme?: number
  }
}
