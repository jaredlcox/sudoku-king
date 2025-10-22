"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ProfileHeader } from "@/components/profile/profile-header"
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog"
import { PrivacySettings } from "@/components/profile/privacy-settings"
import { SquadManagement } from "@/components/profile/squad-management"
import { StatsOverview } from "@/components/profile/stats-overview"
import { getUserPRs } from "@/lib/firebase/firestore"
import type { Difficulty } from "@/lib/firebase/types"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [prs, setPRs] = useState<Record<Difficulty, number | null>>({
    easy: null,
    medium: null,
    hard: null,
    expert: null,
  })

  useEffect(() => {
    if (user) {
      getUserPRs(user.uid).then(setPRs)
    }
  }, [user, refreshKey])

  const handleProfileUpdated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handlePrivacyChange = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleLeaveSquad = async (squadId: string) => {
    toast({
      title: "Left squad",
      description: "You have left the squad",
    })
    setRefreshKey((prev) => prev + 1)
  }

  // Mock squad data
  const mockSquads = [
    {
      id: "squad1",
      name: "Speed Demons",
      memberCount: 5,
      inviteCode: "ABC123",
      isCreator: true,
    },
    {
      id: "squad2",
      name: "Puzzle Masters",
      memberCount: 3,
      inviteCode: "XYZ789",
      isCreator: false,
    },
  ]

  if (!user) return null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardNav />

        <main className="mx-auto max-w-5xl space-y-6 p-4 py-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile & Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <ProfileHeader user={user} onEditProfile={() => setEditProfileOpen(true)} />

          <div className="grid gap-6 lg:grid-cols-2">
            <StatsOverview totalSolves={0} currentStreak={0} longestStreak={0} prs={prs} />
            <PrivacySettings currentPrivacy={user.privacy} userId={user.uid} onPrivacyChange={handlePrivacyChange} />
          </div>

          <SquadManagement squads={mockSquads} onLeaveSquad={handleLeaveSquad} />
        </main>

        <EditProfileDialog
          open={editProfileOpen}
          onOpenChange={setEditProfileOpen}
          user={user}
          onProfileUpdated={handleProfileUpdated}
        />
      </div>
    </ProtectedRoute>
  )
}
