"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface CreateSquadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSquadCreated: (squadId: string) => void
  userId: string
}

export function CreateSquadDialog({ open, onOpenChange, onSquadCreated, userId }: CreateSquadDialogProps) {
  const [squadName, setSquadName] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!squadName.trim()) {
      toast({
        title: "Squad name required",
        description: "Please enter a name for your squad",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Import dynamically to avoid client-side Firebase Admin issues
      const { createSquad } = await import("@/lib/firebase/firestore")
      const squadId = await createSquad(squadName.trim(), userId)

      toast({
        title: "Squad created!",
        description: `${squadName} is ready to compete`,
      })

      onSquadCreated(squadId)
      setSquadName("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Failed to create squad",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Squad</DialogTitle>
          <DialogDescription>Start a new squad and invite your friends to compete</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="squadName">Squad Name</Label>
              <Input
                id="squadName"
                placeholder="The Speed Solvers"
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Squad"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
