"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Sparkles } from "lucide-react"
import { formatTime } from "@/lib/firebase/validation"
import type { Difficulty } from "@/lib/firebase/types"

interface PRCelebrationProps {
  difficulty: Difficulty
  timeSeconds: number
}

export function PRCelebration({ difficulty, timeSeconds }: PRCelebrationProps) {
  return (
    <Card className="border-accent bg-accent/10">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <Trophy className="h-6 w-6 text-accent-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">New Personal Record!</h3>
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <p className="text-sm text-muted-foreground">
            {formatTime(timeSeconds)} on {difficulty} difficulty
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
