"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatTime } from "@/lib/firebase/validation"
import type { Difficulty } from "@/lib/firebase/types"

interface StatsOverviewProps {
  totalSolves: number
  currentStreak: number
  longestStreak: number
  prs: Record<Difficulty, number | null>
}

export function StatsOverview({ totalSolves, currentStreak, longestStreak, prs }: StatsOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
        <CardDescription>Overall performance summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <div className="text-3xl font-bold text-foreground">{totalSolves}</div>
            <div className="text-sm text-muted-foreground">Total Solves</div>
          </div>

          <div>
            <div className="text-3xl font-bold text-foreground">{currentStreak}</div>
            <div className="text-sm text-muted-foreground">Current Streak (days)</div>
          </div>

          <div>
            <div className="text-3xl font-bold text-foreground">{longestStreak}</div>
            <div className="text-sm text-muted-foreground">Longest Streak (days)</div>
          </div>

          <div>
            <div className="text-3xl font-bold text-foreground">
              {Object.values(prs).filter((pr) => pr !== null).length}/6
            </div>
            <div className="text-sm text-muted-foreground">PRs Set</div>
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t pt-6">
          <h4 className="text-sm font-semibold text-foreground">Personal Records</h4>
          {(Object.entries(prs) as [Difficulty, number | null][]).map(([difficulty, time]) => (
            <div key={difficulty} className="flex items-center justify-between">
              <span className="text-sm capitalize text-muted-foreground">{difficulty}</span>
              <span className="font-mono text-sm font-semibold text-foreground">{time ? formatTime(time) : "—"}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
