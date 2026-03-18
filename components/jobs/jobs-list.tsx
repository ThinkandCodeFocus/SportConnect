"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MapPin,
  Clock,
  Bookmark,
  Building2,
  Users,
  Euro,
  ChevronRight,
  Trophy,
  Shield,
  BadgeCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Job {
  id: number
  title: string
  type: "recruitment" | "tender"
  club: {
    name: string
    logo: string
    verified: boolean
    followers: string
  }
  location: string
  sport: string
  level: string
  salary?: string
  deadline?: string
  postedAt: string
  description: string
  requirements: string[]
  applicants: number
  isSaved?: boolean
  isUrgent?: boolean
  category?: string
}

const jobs: Job[] = [
  {
    id: 1,
    title: "Milieu de terrain central",
    type: "recruitment",
    club: {
      name: "Paris Saint-Germain",
      logo: "PSG",
      verified: true,
      followers: "2.3M",
    },
    location: "Paris, France",
    sport: "Football",
    level: "Ligue 1",
    salary: "Selon profil",
    postedAt: "Il y a 2h",
    description: "Nous recherchons un milieu de terrain expérimenté pour renforcer notre effectif. Le candidat idéal possède une excellente vision de jeu et une capacité à dicter le tempo.",
    requirements: ["5+ ans d'expérience professionnelle", "Expérience européenne", "Âge: 24-30 ans"],
    applicants: 47,
    isUrgent: true,
  },
  {
    id: 2,
    title: "Défenseur latéral droit",
    type: "recruitment",
    club: {
      name: "AS Dakar Sacré-Cœur",
      logo: "ASDC",
      verified: true,
      followers: "1.8M",
    },
    location: "Dakar, Sénégal",
    sport: "Football",
    level: "Division 1",
    salary: "150k-250k CFA/mois",
    postedAt: "Il y a 5h",
    description: "Recherche d'un latéral droit offensif capable de participer activement à la construction du jeu. Profil moderne avec capacités défensives solides.",
    requirements: ["Expérience Championnat national ou équivalent", "Moins de 28 ans", "Citoyenneté CEDEAO"],
    applicants: 32,
  },
  {
    id: 3,
    title: "Équipementier officiel 2026-2030",
    type: "tender",
    club: {
      name: "Fédération Française de Football",
      logo: "FFF",
      verified: true,
      followers: "5.2M",
    },
    location: "France",
    sport: "Football",
    level: "National",
    deadline: "15 Mars 2026",
    postedAt: "Il y a 1j",
    description: "Appel d'offres pour la fourniture d'équipements pour l'ensemble des équipes nationales françaises de football.",
    requirements: ["Expérience internationale", "Capacité de production", "Garanties financières"],
    applicants: 8,
    category: "Équipement",
  },
  {
    id: 4,
    title: "Préparateur physique",
    type: "recruitment",
    club: {
      name: "OGC Nice",
      logo: "OGCN",
      verified: true,
      followers: "450K",
    },
    location: "Nice, France",
    sport: "Football",
    level: "Ligue 1",
    salary: "80k-120k€/an",
    postedAt: "Il y a 2j",
    description: "Intégrer notre staff technique pour optimiser la préparation physique de l'équipe première. Collaboration étroite avec le coach et le staff médical.",
    requirements: ["Diplôme préparation physique", "Expérience haut niveau", "Maîtrise logiciels analyse"],
    applicants: 23,
  },
  {
    id: 5,
    title: "Arrière fort - Équipe première",
    type: "recruitment",
    club: {
      name: "Paris Basketball",
      logo: "PB",
      verified: true,
      followers: "120K",
    },
    location: "Paris, France",
    sport: "Basketball",
    level: "Betclic Élite",
    salary: "Selon profil",
    postedAt: "Il y a 3j",
    description: "Recherche d'un arrière fort polyvalent capable de scorer et de défendre. Minimum 2.00m souhaité.",
    requirements: ["Expérience pro européenne", "Taille min 2.00m", "Disponibilité immédiate"],
    applicants: 15,
  },
  {
    id: 6,
    title: "Sponsoring maillot équipe première",
    type: "tender",
    club: {
      name: "Racing Club de Strasbourg",
      logo: "RCSA",
      verified: true,
      followers: "280K",
    },
    location: "Strasbourg, France",
    sport: "Football",
    level: "Ligue 1",
    deadline: "28 Fév 2026",
    postedAt: "Il y a 4j",
    description: "Appel à partenaires pour le sponsoring maillot de l'équipe première pour les saisons 2026-2029.",
    requirements: ["Entreprise établie", "Budget minimum 2M€/an", "Valeurs alignées"],
    applicants: 12,
    category: "Sponsoring",
  },
  {
    id: 7,
    title: "Entraîneur des gardiens",
    type: "recruitment",
    club: {
      name: "FC Nantes",
      logo: "FCN",
      verified: true,
      followers: "520K",
    },
    location: "Nantes, France",
    sport: "Football",
    level: "Ligue 1",
    salary: "60k-90k€/an",
    postedAt: "Il y a 5j",
    description: "Rejoindre notre staff technique pour la formation et le perfectionnement de nos gardiens. Travail avec l'équipe première et la réserve.",
    requirements: ["Diplôme entraîneur gardiens", "Expérience pro", "Pédagogie reconnue"],
    applicants: 34,
  },
]

export function JobsList() {
  const [savedJobs, setSavedJobs] = useState<number[]>([])

  const toggleSave = (jobId: number) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{jobs.length}</span> offres trouvées
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Trier par :</span>
          <Button variant="ghost" size="sm" className="gap-1 text-primary">
            Plus récentes
            <ChevronRight className="h-4 w-4 rotate-90" />
          </Button>
        </div>
      </div>

      {jobs.map((job) => (
        <Card key={job.id} className={`hover:shadow-md transition-shadow ${job.isUrgent ? "border-l-4 border-l-destructive" : ""}`}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <span className="font-bold text-foreground">{job.club.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/jobs/${job.id}`} className="font-semibold text-lg text-foreground hover:text-primary hover:underline">
                        {job.title}
                      </Link>
                      {job.isUrgent && (
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                      )}
                      {job.type === "tender" && (
                        <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 text-xs">
                          Appel d&apos;offres
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Link href={`/clubs/${job.id}`} className="text-primary hover:underline font-medium text-sm">
                        {job.club.name}
                      </Link>
                      {job.club.verified && (
                        <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 shrink-0 ${savedJobs.includes(job.id) ? "text-primary" : "text-muted-foreground"}`}
                    onClick={() => toggleSave(job.id)}
                  >
                    <Bookmark className={`h-5 w-5 ${savedJobs.includes(job.id) ? "fill-primary" : ""}`} />
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    {job.sport}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    {job.level}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1">
                      <Euro className="h-4 w-4" />
                      {job.salary}
                    </span>
                  )}
                  {job.deadline && (
                    <span className="flex items-center gap-1 text-orange-600">
                      <Clock className="h-4 w-4" />
                      Limite: {job.deadline}
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {job.requirements.slice(0, 3).map((req, index) => (
                    <Badge key={index} variant="secondary" className="text-xs font-normal">
                      {req}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.applicants} candidatures
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.postedAt}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </Link>
                    <Button size="sm">
                      {job.type === "tender" ? "Soumettre" : "Postuler"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center pt-4">
        <Button variant="outline" className="gap-2 bg-transparent">
          Charger plus d&apos;offres
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
