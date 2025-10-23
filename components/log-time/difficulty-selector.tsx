"use client"

import { Label } from "@/components/ui/label"
import type { Difficulty } from "@/lib/firebase/types"
import { DIFFICULTY_LEVELS } from "@/lib/firebase/validation"

interface DifficultySelectorProps {
  value: Difficulty
  onChange: (difficulty: Difficulty) => void
}

const DIFFICULTY_COLORS = {
  easy: "bg-[var(--color-pr-easy)] hover:bg-[var(--color-pr-easy)]/80",
  medium: "bg-[var(--color-pr-medium)] hover:bg-[var(--color-pr-medium)]/80",
  hard: "bg-[var(--color-pr-hard)] hover:bg-[var(--color-pr-hard)]/80",
  expert: "bg-[var(--color-pr-expert)] hover:bg-[var(--color-pr-expert)]/80",
  master: "bg-[var(--color-pr-master)] hover:bg-[var(--color-pr-master)]/80",
  extreme: "bg-[var(--color-pr-extreme)] hover:bg-[var(--color-pr-extreme)]/80",
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Difficulty</Label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {DIFFICULTY_LEVELS.map((difficulty) => {
          const isSelected = value === difficulty
          return (
            <button
              key={difficulty}
              type="button"
              onClick={() => onChange(difficulty)}
              className={`rounded-lg px-4 py-3 text-sm font-medium capitalize transition-all ${
                isSelected
                  ? `${DIFFICULTY_COLORS[difficulty]} text-white ring-2 ring-offset-2 ring-offset-background`
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {difficulty}
            </button>
          )
        })}
      </div>
    </div>
  )
}
