"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getMondayOfWeek } from "@/lib/firebase/firestore"

interface WeekNavigationProps {
  currentWeek: Date
  onWeekChange: (week: Date) => void
}

export function WeekNavigation({ currentWeek, onWeekChange }: WeekNavigationProps) {
  const thisWeek = getMondayOfWeek()
  const isCurrentWeek = currentWeek.getTime() === thisWeek.getTime()

  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeek)
    prevWeek.setDate(prevWeek.getDate() - 7)
    onWeekChange(prevWeek)
  }

  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek)
    nextWeek.setDate(nextWeek.getDate() + 7)
    onWeekChange(nextWeek)
  }

  const goToCurrentWeek = () => {
    onWeekChange(thisWeek)
  }

  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
        <ChevronLeft className="mr-1 h-4 w-4" />
        Previous Week
      </Button>

      {!isCurrentWeek && (
        <Button variant="ghost" size="sm" onClick={goToCurrentWeek}>
          Current Week
        </Button>
      )}

      <Button variant="outline" size="sm" onClick={goToNextWeek} disabled={isCurrentWeek}>
        Next Week
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  )
}
