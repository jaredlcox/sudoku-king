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
import type { User } from "@/lib/firebase/types"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onProfileUpdated: () => void
}

export function EditProfileDialog({ open, onOpenChange, user, onProfileUpdated }: EditProfileDialogProps) {
  const [displayName, setDisplayName] = useState(user.displayName)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!displayName.trim()) {
      toast({
        title: "Display name required",
        description: "Please enter a display name",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Update Firebase Auth profile
      const { updateProfile } = await import("firebase/auth")
      const { auth } = await import("@/lib/firebase/config")

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim(),
        })
      }

      // Update Firestore user document
      const { doc, updateDoc } = await import("firebase/firestore")
      const { usersCollection } = await import("@/lib/firebase/firestore")

      await updateDoc(doc(usersCollection, user.uid), {
        displayName: displayName.trim(),
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      onProfileUpdated()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Failed to update profile",
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
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="Sudoku Master"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
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
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
