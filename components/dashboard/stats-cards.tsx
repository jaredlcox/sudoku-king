"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Target, Flame, Users } from "lucide-react"

interface StatsCardsProps {
  weekRank: number | null
  totalSolves: number
  currentStreak: number
  squadCount: number
}

export function StatsCards({ weekRank, totalSolves, currentStreak, squadCount }: StatsCardsProps) {
  const stats = [
    {
      icon: Trophy,
      label: "Week Rank",
      value: weekRank ? `#${weekRank}` : "—",
      color: "text-accent",
    },
    {
      icon: Target,
      label: "Total Solves",
      value: totalSolves.toString(),
      color: "text-primary",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${currentStreak} days`,
      color: "text-chart-2",
    },
    {
      icon: Users,
      label: "Squads",
      value: squadCount.toString(),
      color: "text-chart-3",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
