"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Squad {
  id: string
  name: string
  memberCount: number
}

interface SquadSelectorProps {
  squads: Squad[]
  selectedSquadId: string | null
  onSquadChange: (squadId: string) => void
  onCreateSquad: () => void
}

export function SquadSelector({ squads, selectedSquadId, onSquadChange, onCreateSquad }: SquadSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <Select value={selectedSquadId || undefined} onValueChange={onSquadChange}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select a squad" />
        </SelectTrigger>
        <SelectContent>
          {squads.map((squad) => (
            <SelectItem key={squad.id} value={squad.id}>
              {squad.name} ({squad.memberCount} {squad.memberCount === 1 ? "member" : "members"})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" onClick={onCreateSquad}>
        <Plus className="mr-2 h-4 w-4" />
        Create Squad
      </Button>
    </div>
  )
}
