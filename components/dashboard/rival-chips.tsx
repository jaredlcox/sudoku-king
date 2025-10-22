"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface Rival {
  uid: string
  displayName: string
  photoURL?: string
  weekSolves: number
  delta: number // difference from current user
}

interface RivalChipsProps {
  rivals: Rival[]
  userWeekSolves: number
}

export function RivalChips({ rivals, userWeekSolves }: RivalChipsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Squad Rivals</CardTitle>
        <CardDescription>Compare your weekly progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rivals.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Join a squad to see your rivals here</div>
          ) : (
            rivals.map((rival) => {
              const isAhead = rival.weekSolves > userWeekSolves
              const isTied = rival.weekSolves === userWeekSolves
              const delta = Math.abs(rival.delta)

              return (
                <div key={rival.uid} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={rival.photoURL || "/placeholder.svg"} alt={rival.displayName} />
                      <AvatarFallback>{rival.displayName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{rival.displayName}</div>
                      <div className="text-sm text-muted-foreground">{rival.weekSolves} solves this week</div>
                    </div>
                  </div>

                  <Badge
                    variant={isAhead ? "destructive" : isTied ? "secondary" : "default"}
                    className="flex items-center gap-1"
                  >
                    {isTied ? (
                      <>
                        <Minus className="h-3 w-3" />
                        Tied
                      </>
                    ) : isAhead ? (
                      <>
                        <TrendingUp className="h-3 w-3" />+{delta}
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-3 w-3" />-{delta}
                      </>
                    )}
                  </Badge>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
