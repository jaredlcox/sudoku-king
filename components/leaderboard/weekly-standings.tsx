"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"
import { formatTime } from "@/lib/firebase/validation"
import type { Difficulty } from "@/lib/firebase/types"

interface LeaderboardEntry {
  rank: number
  userId: string
  displayName: string
  photoURL?: string
  solveCount: number
  bestTime: number
  difficulty: Difficulty
  isCurrentUser?: boolean
}

interface WeeklyStandingsProps {
  entries: LeaderboardEntry[]
  weekStart: Date
}

export function WeeklyStandings({ entries, weekStart }: WeeklyStandingsProps) {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-accent" />
      case 2:
        return <Medal className="h-5 w-5 text-chart-2" />
      case 3:
        return <Award className="h-5 w-5 text-chart-4" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Leaderboard</CardTitle>
        <CardDescription>
          {weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
          {weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No solves recorded this week. Be the first!
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.userId}
                className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                  entry.isCurrentUser ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
                }`}
              >
                <div className="flex w-8 items-center justify-center">
                  {getRankIcon(entry.rank) || (
                    <span className="text-lg font-bold text-muted-foreground">#{entry.rank}</span>
                  )}
                </div>

                <Avatar className="h-10 w-10">
                  <AvatarImage src={entry.photoURL || "/placeholder.svg"} alt={entry.displayName} />
                  <AvatarFallback>{entry.displayName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{entry.displayName}</span>
                    {entry.isCurrentUser && (
                      <Badge variant="secondary" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {entry.solveCount} {entry.solveCount === 1 ? "solve" : "solves"}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">{formatTime(entry.bestTime)}</div>
                  <div className="text-xs capitalize text-muted-foreground">{entry.difficulty}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
