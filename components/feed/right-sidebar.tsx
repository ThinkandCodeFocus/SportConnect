"use client"

import Link from "next/link"
import { UserPlus, ChevronRight, Calendar, Trophy, Briefcase, Building2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const suggestedConnections = [
  {
    id: 1,
    name: "Sophie Martin",
    role: "Agent FIFA",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    mutualConnections: 12,
    sport: "Football",
  },
  {
    id: 2,
    name: "Thomas Dubois",
    role: "Entraîneur National",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    mutualConnections: 8,
    sport: "Handball",
  },
  {
    id: 3,
    name: "Marie Leroy",
    role: "Préparatrice physique",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    mutualConnections: 5,
    sport: "Athlétisme",
  },
]

const recommendedJobs = [
  {
    id: 1,
    title: "Milieu de terrain",
    club: "AS Monaco",
    logo: "ASM",
    location: "Monaco",
    level: "Ligue 1",
    postedAt: "Il y a 2h",
  },
  {
    id: 2,
    title: "Défenseur central",
    club: "OGC Nice",
    logo: "OGCN",
    location: "Nice, France",
    level: "Ligue 1",
    postedAt: "Il y a 5h",
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Tournoi National U21",
    date: "15-17 Fév 2026",
    location: "Paris",
    type: "Tournoi",
  },
  {
    id: 2,
    title: "Détection Espoirs",
    date: "22 Fév 2026",
    location: "Lyon",
    type: "Détection",
  },
]

const clubsToFollow = [
  {
    id: 1,
    name: "Paris Saint-Germain",
    logo: "PSG",
    followers: "2.3M",
    recruiting: true,
  },
  {
    id: 2,
    name: "Olympique Lyonnais",
    logo: "OL",
    followers: "1.1M",
    recruiting: false,
  },
]

export function RightSidebar() {
  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
      {/* Suggested Connections */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Personnes à connaître</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {suggestedConnections.map((person) => (
            <div key={person.id} className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={person.avatar || "/placeholder.svg"} />
                <AvatarFallback>{person.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${person.id}`} className="font-medium text-sm text-foreground hover:underline hover:text-primary">
                  {person.name}
                </Link>
                <p className="text-xs text-muted-foreground truncate">{person.role}</p>
                <p className="text-xs text-muted-foreground">{person.mutualConnections} relations en commun</p>
                <Button variant="outline" size="sm" className="mt-2 h-7 text-xs gap-1 bg-transparent">
                  <UserPlus className="h-3 w-3" />
                  Se connecter
                </Button>
              </div>
            </div>
          ))}
          <Link href="/network/suggestions" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary pt-2">
            Voir plus
            <ChevronRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>

      {/* Recommended Jobs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Offres pour vous
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {recommendedJobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="block p-3 -mx-3 rounded-lg hover:bg-secondary transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{job.logo}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.club}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-[10px] h-5">{job.level}</Badge>
                    <span className="text-[10px] text-muted-foreground">{job.postedAt}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          <Link href="/jobs" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary pt-2">
            Voir toutes les offres
            <ChevronRight className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Événements à venir
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {upcomingEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="block p-2 -mx-2 rounded-lg hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-accent/10 flex flex-col items-center justify-center shrink-0">
                  <Trophy className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date} • {event.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Clubs to Follow */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Clubs à suivre
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {clubsToFollow.map((club) => (
            <div key={club.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-foreground">{club.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/clubs/${club.id}`} className="font-medium text-sm text-foreground hover:underline hover:text-primary">
                  {club.name}
                </Link>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{club.followers} abonnés</p>
                  {club.recruiting && (
                    <Badge className="text-[10px] h-4 bg-primary/10 text-primary hover:bg-primary/20">Recrute</Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs shrink-0 bg-transparent">
                Suivre
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="text-xs text-muted-foreground px-2 space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Link href="/about" className="hover:text-primary hover:underline">À propos</Link>
          <Link href="/help" className="hover:text-primary hover:underline">Aide</Link>
          <Link href="/privacy" className="hover:text-primary hover:underline">Confidentialité</Link>
          <Link href="/terms" className="hover:text-primary hover:underline">Conditions</Link>
        </div>
        <p>SportConnect © 2026</p>
      </div>
    </aside>
  )
}
