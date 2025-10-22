"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit } from "lucide-react"
import type { User } from "@/lib/firebase/types"

interface ProfileHeaderProps {
  user: User
  onEditProfile: () => void
}

export function ProfileHeader({ user, onEditProfile }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-6 p-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.photoURL || "/placeholder.svg"} alt={user.displayName} />
          <AvatarFallback className="text-2xl">{user.displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">{user.displayName}</h2>
            <Badge variant="secondary" className="capitalize">
              {user.privacy}
            </Badge>
          </div>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Member since {user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

        <Button onClick={onEditProfile}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  )
}
