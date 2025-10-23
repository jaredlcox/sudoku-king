"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Difficulty } from "@/lib/firebase/types"
import { formatTime } from "@/lib/firebase/validation"

interface PRRingsProps {
  prs: Record<Difficulty, number | null>
}

const DIFFICULTY_CONFIG = {
  easy: { color: "var(--color-pr-easy)", label: "Easy", radius: 60 },
  medium: { color: "var(--color-pr-medium)", label: "Medium", radius: 80 },
  hard: { color: "var(--color-pr-hard)", label: "Hard", radius: 100 },
  expert: { color: "var(--color-pr-expert)", label: "Expert", radius: 120 },
  master: { color: "var(--color-pr-master)", label: "Master", radius: 140 },
  extreme: { color: "var(--color-pr-extreme)", label: "Extreme", radius: 160 },
}

export function PRRings({ prs }: PRRingsProps) {
  const centerX = 160
  const centerY = 160

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Records</CardTitle>
        <CardDescription>Your best times across all difficulties</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative" style={{ width: 320, height: 320 }}>
          <svg width="320" height="320" className="transform -rotate-90">
            {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, (typeof DIFFICULTY_CONFIG)[Difficulty]][]).map(
              ([difficulty, config]) => {
                const pr = prs[difficulty]
                const strokeWidth = 16
                const circumference = 2 * Math.PI * config.radius

                // Calculate progress (inverse - lower time = more progress)
                // Max time is 60 minutes (3600 seconds)
                const progress = pr ? Math.max(0, 1 - pr / 3600) : 0
                const strokeDashoffset = circumference * (1 - progress)

                return (
                  <g key={difficulty}>
                    {/* Background ring */}
                    <circle
                      cx={centerX}
                      cy={centerY}
                      r={config.radius}
                      fill="none"
                      stroke="var(--color-muted)"
                      strokeWidth={strokeWidth}
                      opacity={0.2}
                    />
                    {/* Progress ring */}
                    {pr && (
                      <circle
                        cx={centerX}
                        cy={centerY}
                        r={config.radius}
                        fill="none"
                        stroke={config.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    )}
                  </g>
                )
              },
            )}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground">PRs</div>
              <div className="text-sm text-muted-foreground">
                {Object.values(prs).filter((pr) => pr !== null).length}/6
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
          {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, (typeof DIFFICULTY_CONFIG)[Difficulty]][]).map(
            ([difficulty, config]) => {
              const pr = prs[difficulty]
              return (
                <div key={difficulty} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: config.color }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{config.label}</div>
                    <div className="text-xs text-muted-foreground">{pr ? formatTime(pr) : "No PR yet"}</div>
                  </div>
                </div>
              )
            },
          )}
        </div>
      </CardContent>
    </Card>
  )
}
