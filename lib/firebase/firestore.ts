import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, limit, Timestamp } from "firebase/firestore"
import { db } from "./config"
import type { User, Squad, WeeklyLeader, Difficulty } from "./types"

// Collection references
export const usersCollection = collection(db, "users")
export const squadsCollection = collection(db, "squads")
export const resultsCollection = collection(db, "results")
export const prsCollection = collection(db, "prs")
export const leadersCollection = collection(db, "leaders")

// Helper: Convert Firestore timestamp to Date
export const timestampToDate = (timestamp: Timestamp | Date): Date => {
  if (timestamp instanceof Date) return timestamp
  return timestamp.toDate()
}

// Helper: Get Monday of current week
export const getMondayOfWeek = (date: Date = new Date()): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

// User operations
export const createUser = async (uid: string, email: string, displayName: string, photoURL?: string): Promise<void> => {
  const userDoc = doc(usersCollection, uid)
  await setDoc(userDoc, {
    uid,
    email,
    displayName,
    photoURL: photoURL || null,
    createdAt: Timestamp.now(),
    privacy: "squad",
    squadIds: [],
  })
}

export const getUser = async (uid: string): Promise<User | null> => {
  const userDoc = doc(usersCollection, uid)
  const snapshot = await getDoc(userDoc)
  if (!snapshot.exists()) return null

  const data = snapshot.data()
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
  } as User
}

// Squad operations
export const createSquad = async (name: string, createdBy: string): Promise<string> => {
  const squadDoc = doc(squadsCollection)
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()

  await setDoc(squadDoc, {
    id: squadDoc.id,
    name,
    createdBy,
    createdAt: Timestamp.now(),
    memberIds: [createdBy],
    inviteCode,
  })

  return squadDoc.id
}

export const getSquad = async (squadId: string): Promise<Squad | null> => {
  const squadDoc = doc(squadsCollection, squadId)
  const snapshot = await getDoc(squadDoc)
  if (!snapshot.exists()) return null

  const data = snapshot.data()
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
  } as Squad
}

// Result operations
export const createResult = async (
  userId: string,
  squadId: string,
  difficulty: Difficulty,
  timeSeconds: number,
  integrityHint?: string,
): Promise<string> => {
  const resultDoc = doc(resultsCollection)
  const now = new Date()
  const weekStart = getMondayOfWeek(now)

  await setDoc(resultDoc, {
    id: resultDoc.id,
    userId,
    squadId,
    difficulty,
    timeSeconds,
    timestamp: Timestamp.now(),
    weekStart: Timestamp.fromDate(weekStart),
    integrityHint: integrityHint || null,
  })

  return resultDoc.id
}

// PR operations
export const getUserPRs = async (userId: string): Promise<Record<Difficulty, number | null>> => {
  const q = query(prsCollection, where("userId", "==", userId), orderBy("timeSeconds", "asc"))

  const snapshot = await getDocs(q)
  const prs: Record<Difficulty, number | null> = {
    easy: null,
    medium: null,
    hard: null,
    expert: null,
    master: null,
    extreme: null,
  }

  snapshot.forEach((doc) => {
    const data = doc.data()
    const difficulty = data.difficulty as Difficulty
    if (!prs[difficulty] || data.timeSeconds < prs[difficulty]!) {
      prs[difficulty] = data.timeSeconds
    }
  })

  return prs
}

// Weekly leaderboard operations
export const getWeeklyLeaderboard = async (squadId: string, weekStart?: Date): Promise<WeeklyLeader[]> => {
  const monday = weekStart || getMondayOfWeek()
  const q = query(
    leadersCollection,
    where("squadId", "==", squadId),
    where("weekStart", "==", Timestamp.fromDate(monday)),
    orderBy("solveCount", "desc"),
    orderBy("bestTime", "asc"),
    limit(50),
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      ...data,
      weekStart: timestampToDate(data.weekStart),
    } as WeeklyLeader
  })
}
