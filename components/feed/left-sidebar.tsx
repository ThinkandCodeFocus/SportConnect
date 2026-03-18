"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import api from "@/lib/api/endpoints"
import {
  User,
  TrendingUp,
  FileText,
  Building2,
  BarChart3,
  Bookmark,
  Users,
  Loader2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const quickLinks = [
  { href: "/profile", icon: User, label: "Mon profil" },
  { href: "/jobs", icon: FileText, label: "Offres d'emploi" },
  { href: "/clubs", icon: Building2, label: "Clubs" },
  { href: "/network", icon: Users, label: "Réseau" },
  { href: "/saved", icon: Bookmark, label: "Enregistrés" },
]

export function LeftSidebar() {
  const { user, profile, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Get user initials
  const getUserInitials = () => {
    if (!user) return "U"
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
  }

  if (authLoading) {
    return (
      <aside className="w-full lg:w-56 xl:w-64 shrink-0">
        <Card>
          <CardContent className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </aside>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <aside className="w-full lg:w-56 xl:w-64 shrink-0">
        <Card>
          <CardContent className="py-8 text-center">
            <h3 className="font-semibold text-foreground">Non connecté</h3>
            <p className="text-sm text-muted-foreground mt-2">Connectez-vous pour voir votre profil</p>
            <Link href="/login" className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 text-sm font-medium">
              Se connecter
            </Link>
          </CardContent>
        </Card>
      </aside>
    )
  }

  return (
    <aside className="w-full lg:w-56 xl:w-64 shrink-0 space-y-4">
      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-green-600 to-green-700 relative">
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
            <Avatar className="h-16 w-16 border-4 border-card">
              <AvatarImage src={profile?.profilePicture} />
              <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardContent className="pt-10 pb-4 text-center">
          <Link href="/profile" className="hover:underline">
            <h3 className="font-semibold text-foreground text-lg">
              {user.firstName} {user.lastName}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-0.5">
            {profile?.position || user.role || "Utilisateur"}
          </p>
          {profile?.currentClub && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs font-normal">
                {profile.level || "Joueur"}
              </Badge>
              <Badge className="text-xs font-normal bg-green-500/10 text-green-700 hover:bg-green-500/20">
                Football
              </Badge>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-border">
            {profile?.currentClub && (
              <Link href="/profile" className="flex items-center justify-between text-sm hover:bg-secondary px-2 py-1.5 rounded-md transition-colors">
                <span className="text-muted-foreground">Club actuel</span>
                <span className="font-medium text-foreground truncate">{profile.currentClub}</span>
              </Link>
            )}
          </div>
          {/* Stats */}
          <div className="mt-1 border-t border-border pt-3 space-y-1">
            <Link href="/network" className="flex items-center justify-between text-sm hover:bg-secondary px-2 py-1.5 rounded-md transition-colors">
              <span className="text-muted-foreground">Connexions</span>
              <span className="font-medium text-primary">--</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardContent className="p-2">
          <nav className="space-y-0.5">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>

      {/* Groups */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm text-foreground">Mes groupes</h4>
            <Link href="/groups" className="text-xs text-primary hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="space-y-2">
            <Link href="/groups/1" className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary transition-colors">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Milieux de terrain</p>
                <p className="text-xs text-muted-foreground">1.2k membres</p>
              </div>
            </Link>
            <Link href="/groups/2" className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary transition-colors">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Football Ligue 1</p>
                <p className="text-xs text-muted-foreground">5.8k membres</p>
              </div>
            </Link>
            <Link href="/groups/3" className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary transition-colors">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Recrutement Pro</p>
                <p className="text-xs text-muted-foreground">3.4k membres</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
