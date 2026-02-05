"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Users,
  MapPin,
  BadgeCheck,
  Briefcase,
  Trophy,
  Building2,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Club {
  id: number
  name: string
  logo: string
  type: "club" | "academy" | "federation" | "sponsor"
  sport: string
  level: string
  location: string
  country: string
  followers: string
  employees: number
  openPositions: number
  verified: boolean
  banner: string
  description: string
  trophies?: number
}

const clubs: Club[] = [
  {
    id: 1,
    name: "Paris Saint-Germain",
    logo: "PSG",
    type: "club",
    sport: "Football",
    level: "Ligue 1",
    location: "Paris",
    country: "France",
    followers: "2.3M",
    employees: 850,
    openPositions: 12,
    verified: true,
    banner: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=200&fit=crop",
    description: "Club de football professionnel français, l'un des plus grands clubs européens.",
    trophies: 47,
  },
  {
    id: 2,
    name: "Olympique de Marseille",
    logo: "OM",
    type: "club",
    sport: "Football",
    level: "Ligue 1",
    location: "Marseille",
    country: "France",
    followers: "1.8M",
    employees: 620,
    openPositions: 8,
    verified: true,
    banner: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=200&fit=crop",
    description: "Seul club français vainqueur de la Ligue des Champions, symbole de la cité phocéenne.",
    trophies: 29,
  },
  {
    id: 3,
    name: "INF Clairefontaine",
    logo: "INF",
    type: "academy",
    sport: "Football",
    level: "Élite",
    location: "Clairefontaine",
    country: "France",
    followers: "520K",
    employees: 180,
    openPositions: 4,
    verified: true,
    banner: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=200&fit=crop",
    description: "Centre national de formation de la FFF, berceau des plus grands talents français.",
  },
  {
    id: 4,
    name: "Fédération Française de Football",
    logo: "FFF",
    type: "federation",
    sport: "Football",
    level: "National",
    location: "Paris",
    country: "France",
    followers: "5.2M",
    employees: 1200,
    openPositions: 15,
    verified: true,
    banner: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&h=200&fit=crop",
    description: "Instance dirigeante du football français, organisatrice des compétitions nationales.",
  },
  {
    id: 5,
    name: "AS Monaco",
    logo: "ASM",
    type: "club",
    sport: "Football",
    level: "Ligue 1",
    location: "Monaco",
    country: "Monaco",
    followers: "980K",
    employees: 420,
    openPositions: 6,
    verified: true,
    banner: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=200&fit=crop",
    description: "Club historique de la Principauté, réputé pour sa formation de haut niveau.",
    trophies: 21,
  },
  {
    id: 6,
    name: "Paris Basketball",
    logo: "PB",
    type: "club",
    sport: "Basketball",
    level: "Betclic Élite",
    location: "Paris",
    country: "France",
    followers: "120K",
    employees: 85,
    openPositions: 3,
    verified: true,
    banner: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=200&fit=crop",
    description: "Club ambitieux de basketball parisien évoluant au plus haut niveau français.",
    trophies: 2,
  },
  {
    id: 7,
    name: "Académie Jean-Marc Guillou",
    logo: "AJMG",
    type: "academy",
    sport: "Football",
    level: "Formation",
    location: "Abidjan",
    country: "Côte d'Ivoire",
    followers: "340K",
    employees: 120,
    openPositions: 5,
    verified: true,
    banner: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=200&fit=crop",
    description: "Académie de renommée mondiale, formatrice de talents africains pour l'Europe.",
  },
  {
    id: 8,
    name: "Decathlon Sport",
    logo: "DEC",
    type: "sponsor",
    sport: "Multi-sports",
    level: "International",
    location: "Villeneuve-d'Ascq",
    country: "France",
    followers: "890K",
    employees: 95000,
    openPositions: 45,
    verified: true,
    banner: "https://images.unsplash.com/photo-1461896836934- voices?w=600&h=200&fit=crop",
    description: "Leader mondial de la distribution d'articles de sport et sponsor de nombreux athlètes.",
  },
]

const typeConfig = {
  club: { icon: Building2, label: "Club", color: "bg-primary/10 text-primary" },
  academy: { icon: GraduationCap, label: "Académie", color: "bg-yellow-500/10 text-yellow-600" },
  federation: { icon: Trophy, label: "Fédération", color: "bg-orange-500/10 text-orange-600" },
  sponsor: { icon: Briefcase, label: "Sponsor", color: "bg-blue-500/10 text-blue-600" },
}

export function ClubsGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{clubs.length}</span> organisations trouvées
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clubs.map((club) => {
          const TypeIcon = typeConfig[club.type].icon
          return (
            <Card key={club.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-24">
                <Image
                  src={club.banner || "/placeholder.svg"}
                  alt={`${club.name} banner`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <Badge className={`absolute top-3 left-3 ${typeConfig[club.type].color} gap-1`}>
                  <TypeIcon className="h-3 w-3" />
                  {typeConfig[club.type].label}
                </Badge>
              </div>
              <CardContent className="p-4 pt-0 relative">
                <div className="absolute -top-8 left-4">
                  <div className="w-16 h-16 rounded-lg bg-card border-4 border-card shadow-md flex items-center justify-center">
                    <span className="font-bold text-lg text-foreground">{club.logo}</span>
                  </div>
                </div>
                <div className="pt-10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <Link href={`/clubs/${club.id}`} className="font-semibold text-foreground hover:text-primary hover:underline truncate">
                          {club.name}
                        </Link>
                        {club.verified && (
                          <BadgeCheck className="h-4 w-4 text-primary fill-primary/20 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{club.sport}</span>
                        <span>•</span>
                        <span>{club.level}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                    {club.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {club.location}, {club.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {club.followers} abonnés
                    </span>
                    {club.trophies && (
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3.5 w-3.5 text-yellow-600" />
                        {club.trophies} trophées
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    {club.openPositions > 0 ? (
                      <Link href={`/jobs?club=${club.id}`} className="text-sm text-primary hover:underline">
                        {club.openPositions} offres ouvertes
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">Aucune offre</span>
                    )}
                    <Button size="sm">Suivre</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
