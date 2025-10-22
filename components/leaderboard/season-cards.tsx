"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy } from "lucide-react"

interface SeasonData {
  weekStart: Date
  rank: number
  solveCount: number
  topPerformer: string
}

interface SeasonCardsProps {
  seasons: SeasonData[]
}

export function SeasonCards({ seasons }: SeasonCardsProps) {
  if (seasons.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Season History</CardTitle>
        <CardDescription>Your past weekly performances</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {seasons.map((season, index) => {
            const weekEnd = new Date(season.weekStart)
            weekEnd.setDate(weekEnd.getDate() + 6)

            return (
              <div key={index} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {season.weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                  {weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">#{season.rank}</div>
                    <div className="text-xs text-muted-foreground">{season.solveCount} solves</div>
                  </div>

                  {season.rank === 1 && (
                    <Badge variant="default" className="bg-accent">
                      <Trophy className="mr-1 h-3 w-3" />
                      Winner
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">Top: {season.topPerformer}</div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
