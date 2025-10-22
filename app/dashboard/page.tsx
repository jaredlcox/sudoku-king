"use client"

import { useAuth } from "@/lib/auth/context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { PRRings } from "@/components/dashboard/pr-rings"
import { StreakHeatmap } from "@/components/dashboard/streak-heatmap"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RivalChips } from "@/components/dashboard/rival-chips"
import { useEffect, useState } from "react"
import { getUserPRs } from "@/lib/firebase/firestore"
import type { Difficulty } from "@/lib/firebase/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const [prs, setPRs] = useState<Record<Difficulty, number | null>>({
    easy: null,
    medium: null,
    hard: null,
    expert: null,
  })

  useEffect(() => {
    if (user) {
      getUserPRs(user.uid).then(setPRs)
    }
  }, [user])

  // Mock data for demonstration
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date,
      solveCount: Math.floor(Math.random() * 5),
    }
  })

  const mockRivals = [
    {
      uid: "1",
      displayName: "Alex Chen",
      weekSolves: 12,
      delta: 3,
    },
    {
      uid: "2",
      displayName: "Sarah Kim",
      weekSolves: 8,
      delta: -1,
    },
    {
      uid: "3",
      displayName: "Mike Johnson",
      weekSolves: 9,
      delta: 0,
    },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardNav />

        <main className="mx-auto max-w-7xl space-y-6 p-4 py-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.displayName}!</h1>
            <p className="text-muted-foreground">Track your progress and compete with your squad</p>
          </div>

          <StatsCards weekRank={null} totalSolves={0} currentStreak={0} squadCount={user?.squadIds.length || 0} />

          <div className="grid gap-6 lg:grid-cols-2">
            <PRRings prs={prs} />
            <StreakHeatmap last7Days={last7Days} currentStreak={0} />
          </div>

          <RivalChips rivals={mockRivals} userWeekSolves={9} />
        </main>
      </div>
    </ProtectedRoute>
  )
}
