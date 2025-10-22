"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Copy, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Squad {
  id: string
  name: string
  memberCount: number
  inviteCode: string
  isCreator: boolean
}

interface SquadManagementProps {
  squads: Squad[]
  onLeaveSquad: (squadId: string) => void
}

export function SquadManagement({ squads, onLeaveSquad }: SquadManagementProps) {
  const { toast } = useToast()

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Invite code copied",
      description: "Share this code with friends to invite them",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Squads</CardTitle>
        <CardDescription>Manage your squad memberships</CardDescription>
      </CardHeader>
      <CardContent>
        {squads.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            You're not in any squads yet. Create or join one to start competing!
          </div>
        ) : (
          <div className="space-y-3">
            {squads.map((squad) => (
              <div key={squad.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{squad.name}</span>
                      {squad.isCreator && <Badge variant="secondary">Creator</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {squad.memberCount} {squad.memberCount === 1 ? "member" : "members"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyInviteCode(squad.inviteCode)}>
                    <Copy className="mr-2 h-4 w-4" />
                    {squad.inviteCode}
                  </Button>
                  {!squad.isCreator && (
                    <Button variant="ghost" size="sm" onClick={() => onLeaveSquad(squad.id)}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
