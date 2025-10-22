import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-foreground md:text-6xl">Sudoku Squad</h1>
          <p className="text-xl text-muted-foreground md:text-2xl">
            Track your personal records, compete with friends, and dominate the weekly leaderboards
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="text-lg">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>

        <div className="grid gap-6 pt-8 sm:grid-cols-3">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">PR Rings</div>
            <p className="text-sm text-muted-foreground">
              Visualize your personal records across all difficulty levels
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-accent">Weekly Seasons</div>
            <p className="text-sm text-muted-foreground">Compete in fresh leaderboards every Monday</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-chart-3">Squad Up</div>
            <p className="text-sm text-muted-foreground">Track progress with friends and friendly rivals</p>
          </div>
        </div>
      </div>
    </div>
  )
}
