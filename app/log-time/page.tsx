"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth/context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TimeInput } from "@/components/log-time/time-input"
import { DifficultySelector } from "@/components/log-time/difficulty-selector"
import { PRCelebration } from "@/components/log-time/pr-celebration"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { logSolveTime } from "@/lib/firebase/actions"
import type { Difficulty } from "@/lib/firebase/types"
import { Loader2 } from "lucide-react"

export default function LogTimePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [timeInput, setTimeInput] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [integrityHint, setIntegrityHint] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [validSeconds, setValidSeconds] = useState<number>()
  const [loading, setLoading] = useState(false)
  const [showPRCelebration, setShowPRCelebration] = useState(false)
  const [prDetails, setPRDetails] = useState<{ difficulty: Difficulty; timeSeconds: number } | null>(null)

  const handleValidChange = (valid: boolean, seconds?: number) => {
    setIsValid(valid)
    setValidSeconds(seconds)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !isValid || !validSeconds) return

    // For now, use the first squad or create a default one
    const squadId = user.squadIds[0] || "default"

    setLoading(true)

    try {
      const result = await logSolveTime(user.uid, squadId, difficulty, timeInput, integrityHint || undefined)

      if (result.success) {
        if (result.isNewPR && result.timeSeconds) {
          setPRDetails({ difficulty, timeSeconds: result.timeSeconds })
          setShowPRCelebration(true)

          toast({
            title: "New Personal Record!",
            description: `You crushed your ${difficulty} PR!`,
          })
        } else {
          toast({
            title: "Time logged!",
            description: "Your solve has been recorded.",
          })
        }

        // Reset form
        setTimeInput("")
        setIntegrityHint("")
        setDifficulty("medium")

        // Redirect to dashboard after 2 seconds if PR, immediately otherwise
        setTimeout(
          () => {
            router.push("/dashboard")
          },
          result.isNewPR ? 2000 : 500,
        )
      } else {
        toast({
          title: "Failed to log time",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log time. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardNav />

        <main className="mx-auto max-w-2xl space-y-6 p-4 py-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Log Solve Time</h1>
            <p className="text-muted-foreground">Record your latest Sudoku solve</p>
          </div>

          {showPRCelebration && prDetails && (
            <PRCelebration difficulty={prDetails.difficulty} timeSeconds={prDetails.timeSeconds} />
          )}

          <Card>
            <CardHeader>
              <CardTitle>Solve Details</CardTitle>
              <CardDescription>Enter your completion time and difficulty level</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <TimeInput value={timeInput} onChange={setTimeInput} onValidChange={handleValidChange} />

                <DifficultySelector value={difficulty} onChange={setDifficulty} />

                <div className="space-y-2">
                  <Label htmlFor="integrity">Integrity Hint (Optional)</Label>
                  <Textarea
                    id="integrity"
                    placeholder="e.g., Solved on mobile app, used pencil marks..."
                    value={integrityHint}
                    onChange={(e) => setIntegrityHint(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Add context about your solve to help maintain leaderboard integrity
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={!isValid || loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging...
                      </>
                    ) : (
                      "Log Time"
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={loading}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h3 className="mb-2 text-sm font-semibold text-foreground">Time Guidelines</h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Minimum time: 30 seconds</li>
                <li>• Maximum time: 59 minutes 59 seconds</li>
                <li>• Format: MM:SS (minutes:seconds)</li>
                <li>• Times are validated to maintain fair competition</li>
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
