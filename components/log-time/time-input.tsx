"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { validateTimeInput } from "@/lib/firebase/validation"

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  onValidChange: (isValid: boolean, seconds?: number) => void
}

export function TimeInput({ value, onChange, onValidChange }: TimeInputProps) {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (value.length === 0) {
      setError(null)
      onValidChange(false)
      return
    }

    const validation = validateTimeInput(value)
    if (validation.valid) {
      setError(null)
      onValidChange(true, validation.seconds)
    } else {
      setError(validation.error || "Invalid format")
      onValidChange(false)
    }
  }, [value, onValidChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value

    // Auto-format: allow only digits and colon
    input = input.replace(/[^\d:]/g, "")

    // Auto-add colon after 2 digits
    if (input.length === 2 && !input.includes(":")) {
      input = input + ":"
    }

    // Limit to MM:SS format
    if (input.length > 5) {
      input = input.slice(0, 5)
    }

    onChange(input)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="time">Solve Time</Label>
      <Input
        id="time"
        type="text"
        placeholder="5:23"
        value={value}
        onChange={handleChange}
        className={`text-2xl font-mono ${error ? "border-destructive" : ""}`}
        maxLength={5}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">Format: MM:SS (e.g., 5:23 for 5 minutes 23 seconds)</p>
    </div>
  )
}
