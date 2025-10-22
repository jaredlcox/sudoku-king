"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { WeeklyStandings } from "@/components/leaderboard/weekly-standings"
import { WeekNavigation } from "@/components/leaderboard/week-navigation"
import { SquadSelector } from "@/components/leaderboard/squad-selector"
import { CreateSquadDialog } from "@/components/leaderboard/create-squad-dialog"
import { SeasonCards } from "@/components/leaderboard/season-cards"
import { getMondayOfWeek } from "@/lib/firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus } from "lucide-react"

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [currentWeek, setCurrentWeek] = useState(getMondayOfWeek())
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(null)
  const [createSquadOpen, setCreateSquadOpen] = useState(false)

  // Mock data for demonstration
  const mockSquads = [
    { id: "squad1", name: "Speed Demons", memberCount: 5 },
    { id: "squad2", name: "Puzzle Masters", memberCount: 3 },
  ]

  const mockLeaderboard = [
    {
      rank: 1,
      userId: "user1",
      displayName: "Alex Chen",
      photoURL: undefined,
      solveCount: 15,
      bestTime: 245,
      difficulty: "hard" as const,
    },
    {
      rank: 2,
      userId: user?.uid || "user2",
      displayName: user?.displayName || "You",
      photoURL: user?.photoURL,
      solveCount: 12,
      bestTime: 289,
      difficulty: "medium" as const,
      isCurrentUser: true,
    },
    {
      rank: 3,
      userId: "user3",
      displayName: "Sarah Kim",
      photoURL: undefined,
      solveCount: 10,
      bestTime: 312,
      difficulty: "hard" as const,
    },
  ]

  const mockSeasons = [
    {
      weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      rank: 2,
      solveCount: 14,
      topPerformer: "Alex Chen",
    },
    {
      weekStart: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      rank: 1,
      solveCount: 18,
      topPerformer: user?.displayName || "You",
    },
  ]

  const handleSquadCreated = (squadId: string) => {
    setSelectedSquadId(squadId)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardNav />

        <main className="mx-auto max-w-7xl space-y-6 p-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
              <p className="text-muted-foreground">Compete with your squad</p>
            </div>

            <Button variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Friends
            </Button>
          </div>

          {user?.squadIds.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Join or Create a Squad
                </CardTitle>
                <CardDescription>
                  Squads let you compete with friends and track weekly progress together
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Button onClick={() => setCreateSquadOpen(true)}>
                    <Users className="mr-2 h-4 w-4" />
                    Create Squad
                  </Button>
                  <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Join with Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <SquadSelector
                squads={mockSquads}
                selectedSquadId={selectedSquadId || mockSquads[0]?.id}
                onSquadChange={setSelectedSquadId}
                onCreateSquad={() => setCreateSquadOpen(true)}
              />

              <WeekNavigation currentWeek={currentWeek} onWeekChange={setCurrentWeek} />

              <WeeklyStandings entries={mockLeaderboard} weekStart={currentWeek} />

              <SeasonCards seasons={mockSeasons} />
            </>
          )}
        </main>

        <CreateSquadDialog
          open={createSquadOpen}
          onOpenChange={setCreateSquadOpen}
          onSquadCreated={handleSquadCreated}
          userId={user?.uid || ""}
        />
      </div>
    </ProtectedRoute>
  )
}
