"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StreakHeatmapProps {
  last7Days: { date: Date; solveCount: number }[]
  currentStreak: number
}

export function StreakHeatmap({ last7Days, currentStreak }: StreakHeatmapProps) {
  const maxSolves = Math.max(...last7Days.map((d) => d.solveCount), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Streak</CardTitle>
        <CardDescription>Last 7 days of solving</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">day streak</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-primary">
                {last7Days.reduce((sum, d) => sum + d.solveCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">solves this week</div>
            </div>
          </div>

          <div className="flex gap-2">
            {last7Days.map((day, index) => {
              const intensity = day.solveCount / maxSolves
              const dayName = day.date.toLocaleDateString("en-US", { weekday: "short" })

              return (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="h-16 w-full rounded transition-all hover:scale-105"
                    style={{
                      backgroundColor:
                        day.solveCount > 0
                          ? `color-mix(in oklch, var(--color-primary) ${intensity * 100}%, var(--color-muted))`
                          : "var(--color-muted)",
                    }}
                    title={`${dayName}: ${day.solveCount} solves`}
                  />
                  <div className="text-xs text-muted-foreground">{dayName}</div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
