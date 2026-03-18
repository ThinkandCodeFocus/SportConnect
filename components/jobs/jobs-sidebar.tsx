"use client"

import Link from "next/link"
import {
  Bell,
  Settings,
  FileText,
  Bookmark,
  TrendingUp,
  Building2,
  Users,
  ChevronRight,
  Plus,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

const recentApplications = [
  {
    id: 1,
    title: "Milieu offensif",
    club: "Olympique Lyonnais",
    status: "En cours d'examen",
    statusColor: "bg-yellow-500",
    appliedAt: "Il y a 3j",
  },
  {
    id: 2,
    title: "Ailier droit",
    club: "AS Monaco",
    status: "Profil consulté",
    statusColor: "bg-primary",
    appliedAt: "Il y a 1 sem",
  },
  {
    id: 3,
    title: "Milieu de terrain",
    club: "FC Nantes",
    status: "Refusé",
    statusColor: "bg-destructive",
    appliedAt: "Il y a 2 sem",
  },
]

const savedJobs = [
  {
    id: 1,
    title: "Attaquant de pointe",
    club: "RC Lens",
    deadline: "Dans 5 jours",
  },
  {
    id: 2,
    title: "Défenseur central",
    club: "Stade Rennais",
    deadline: "Dans 2 semaines",
  },
]

const topRecruiters = [
  {
    id: 1,
    name: "AS Jeanne d'Arc",
    logo: "JA",
    openPositions: 12,
    followers: "2.3M",
  },
  {
    id: 2,
    name: "AS Dakar Sacré-Cœur",
    logo: "ASDC",
    openPositions: 8,
    followers: "1.8M",
  },
  {
    id: 3,
    name: "Génération Foot",
    logo: "GF",
    openPositions: 6,
    followers: "980K",
  },
]

export function JobsSidebar() {
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4">
      {/* Job Alerts */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Alertes emploi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Milieu de terrain</p>
              <p className="text-xs text-muted-foreground">Ligue 1, France</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Offres internationales</p>
              <p className="text-xs text-muted-foreground">Europe Top 5</p>
            </div>
            <Switch />
          </div>
          <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Créer une alerte
          </Button>
        </CardContent>
      </Card>

      {/* My Applications */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Mes candidatures
            </CardTitle>
            <Badge variant="secondary">3</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentApplications.map((app) => (
            <Link
              key={app.id}
              href={`/applications/${app.id}`}
              className="block p-3 -mx-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${app.statusColor}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{app.title}</p>
                  <p className="text-xs text-muted-foreground">{app.club}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{app.status}</span>
                    <span className="text-xs text-muted-foreground">{app.appliedAt}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          <Link href="/applications" className="flex items-center justify-center gap-1 text-sm text-primary hover:underline pt-2">
            Voir toutes mes candidatures
            <ChevronRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>

      {/* Saved Jobs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary" />
            Offres sauvegardées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {savedJobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block p-3 -mx-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <p className="font-medium text-sm text-foreground">{job.title}</p>
              <p className="text-xs text-muted-foreground">{job.club}</p>
              <p className="text-xs text-orange-600 mt-1">Expire {job.deadline}</p>
            </Link>
          ))}
          <Link href="/saved-jobs" className="flex items-center justify-center gap-1 text-sm text-primary hover:underline pt-2">
            Voir tout
            <ChevronRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>

      {/* Top Recruiters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Clubs qui recrutent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topRecruiters.map((club) => (
            <div key={club.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <span className="font-bold text-sm text-foreground">{club.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/clubs/${club.id}`} className="font-medium text-sm text-foreground hover:underline hover:text-primary block truncate">
                  {club.name}
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{club.openPositions} postes ouverts</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs shrink-0 bg-transparent">
                Suivre
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Career Resources */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Ressources carrière</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/resources/cv" className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-sm text-muted-foreground hover:text-foreground">
            <FileText className="h-4 w-4" />
            Optimiser mon profil
          </Link>
          <Link href="/resources/interview" className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-sm text-muted-foreground hover:text-foreground">
            <Users className="h-4 w-4" />
            Préparer mes essais
          </Link>
          <Link href="/resources/agents" className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-sm text-muted-foreground hover:text-foreground">
            <Building2 className="h-4 w-4" />
            Trouver un agent
          </Link>
          <Link href="/settings/job-preferences" className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-sm text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
            Préférences de recherche
          </Link>
        </CardContent>
      </Card>
    </aside>
  )
}
