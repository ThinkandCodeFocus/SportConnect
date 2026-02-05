"use client"

import Link from "next/link"
import {
  MapPin,
  Calendar,
  Users,
  Globe,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  Briefcase,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const similarClubs = [
  {
    id: 1,
    name: "Paris Saint-Germain",
    logo: "PSG",
    sport: "Football",
    level: "Ligue 1",
    followers: "2.3M",
  },
  {
    id: 2,
    name: "AS Monaco",
    logo: "ASM",
    sport: "Football",
    level: "Ligue 1",
    followers: "980K",
  },
  {
    id: 3,
    name: "Olympique Lyonnais",
    logo: "OL",
    sport: "Football",
    level: "Ligue 1",
    followers: "1.1M",
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "OM vs PSG",
    type: "Match",
    date: "15 Fév 2026",
    location: "Stade Vélodrome",
  },
  {
    id: 2,
    title: "Journée portes ouvertes",
    type: "Événement",
    date: "22 Fév 2026",
    location: "Centre d'entraînement",
  },
]

const contacts = [
  { id: 1, name: "Service Recrutement", email: "recrutement@om.fr" },
  { id: 2, name: "Relations Presse", email: "presse@om.fr" },
]

export function ClubSidebar() {
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4">
      {/* Quick Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-foreground">Stade Vélodrome</p>
              <p className="text-muted-foreground">3 Boulevard Michelet, 13008 Marseille</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground">Fondé en <span className="text-foreground">1899</span></p>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground"><span className="text-foreground">620</span> employés</p>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground">Capacité: <span className="text-foreground">67 394</span> places</p>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Link href="https://om.fr" target="_blank" className="text-primary hover:underline flex items-center gap-1">
              om.fr
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Open Positions Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Recrutement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 bg-secondary/50 rounded-lg mb-4">
            <p className="text-3xl font-bold text-primary">8</p>
            <p className="text-sm text-muted-foreground">offres ouvertes</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Joueurs</span>
              <span className="font-medium text-foreground">5 postes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Staff technique</span>
              <span className="font-medium text-foreground">2 postes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Administration</span>
              <span className="font-medium text-foreground">1 poste</span>
            </div>
          </div>
          <Link href="/jobs?club=1">
            <Button className="w-full mt-4">Voir les offres</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Événements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{event.type}</Badge>
                <span className="text-xs text-muted-foreground">{event.date}</span>
              </div>
              <p className="font-medium text-foreground mt-1">{event.title}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {event.location}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Contact professionnel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{contact.name}</p>
                <Link href={`mailto:${contact.email}`} className="text-xs text-primary hover:underline">
                  {contact.email}
                </Link>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-2">
            Les coordonnées complètes sont visibles pour les utilisateurs connectés.
          </p>
        </CardContent>
      </Card>

      {/* Similar Clubs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Clubs similaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {similarClubs.map((club) => (
            <div key={club.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <span className="font-bold text-sm text-foreground">{club.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/clubs/${club.id}`} className="font-medium text-sm text-foreground hover:underline hover:text-primary block truncate">
                  {club.name}
                </Link>
                <p className="text-xs text-muted-foreground">{club.sport} • {club.level}</p>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs shrink-0 bg-transparent">
                Suivre
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  )
}
