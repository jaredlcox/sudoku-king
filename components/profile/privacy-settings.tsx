"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Privacy } from "@/lib/firebase/types"
import { useToast } from "@/hooks/use-toast"
import { Globe, Users, Lock } from "lucide-react"

interface PrivacySettingsProps {
  currentPrivacy: Privacy
  userId: string
  onPrivacyChange: () => void
}

export function PrivacySettings({ currentPrivacy, userId, onPrivacyChange }: PrivacySettingsProps) {
  const { toast } = useToast()

  const handlePrivacyChange = async (value: Privacy) => {
    try {
      const { doc, updateDoc } = await import("firebase/firestore")
      const { usersCollection } = await import("@/lib/firebase/firestore")

      await updateDoc(doc(usersCollection, userId), {
        privacy: value,
      })

      toast({
        title: "Privacy updated",
        description: `Your profile is now ${value}`,
      })

      onPrivacyChange()
    } catch (error) {
      toast({
        title: "Failed to update privacy",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Control who can see your solve times and stats</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={currentPrivacy} onValueChange={(value) => handlePrivacyChange(value as Privacy)}>
          <div className="flex items-start space-x-3 rounded-lg border p-4">
            <RadioGroupItem value="public" id="public" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="public" className="flex items-center gap-2 font-semibold cursor-pointer">
                <Globe className="h-4 w-4" />
                Public
              </Label>
              <p className="text-sm text-muted-foreground">Anyone can see your profile and solve times</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-lg border p-4">
            <RadioGroupItem value="squad" id="squad" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="squad" className="flex items-center gap-2 font-semibold cursor-pointer">
                <Users className="h-4 w-4" />
                Squad Only
              </Label>
              <p className="text-sm text-muted-foreground">Only your squad members can see your stats</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-lg border p-4">
            <RadioGroupItem value="private" id="private" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="private" className="flex items-center gap-2 font-semibold cursor-pointer">
                <Lock className="h-4 w-4" />
                Private
              </Label>
              <p className="text-sm text-muted-foreground">Only you can see your solve times and stats</p>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
