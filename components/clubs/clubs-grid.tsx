"use client"

import { useState, useEffect } from "react"
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
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import api from "@/lib/api/endpoints"
import { Club } from "@/lib/types/api"

const typeConfig = {
  club: { icon: Building2, label: "Club", color: "bg-primary/10 text-primary" },
  academy: { icon: GraduationCap, label: "Académie", color: "bg-yellow-500/10 text-yellow-600" },
  federation: { icon: Trophy, label: "Fédération", color: "bg-orange-500/10 text-orange-600" },
  sponsor: { icon: Briefcase, label: "Sponsor", color: "bg-blue-500/10 text-blue-600" },
}

export function ClubsGrid() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadClubs()
  }, [])

  const loadClubs = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await api.club.getAll()
      setClubs(response.data || [])
    } catch (err: any) {
      console.error("Failed to load clubs:", err)
      setError("Impossible de charger les clubs")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (clubs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun club trouvé</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{clubs.length}</span> organisations trouvées
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clubs.map((club) => {
          const TypeIcon = typeConfig[club.type as keyof typeof typeConfig]?.icon || Building2
          const clubConfig = typeConfig[club.type as keyof typeof typeConfig]
          
          return (
            <Card key={club.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-24">
                <Image
                  src={club.banner || "/placeholder.svg"}
                  alt={`${club.name} banner`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                {clubConfig && (
                  <Badge className={`absolute top-3 left-3 ${clubConfig.color} gap-1`}>
                    <TypeIcon className="h-3 w-3" />
                    {clubConfig.label}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4 pt-0 relative">
                <div className="absolute -top-8 left-4">
                  <div className="w-16 h-16 rounded-lg bg-card border-4 border-card shadow-md flex items-center justify-center">
                    <span className="font-bold text-lg text-foreground">{club.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                </div>
                <div className="pt-10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <Link href={`/clubs/${club.id}`} className="font-semibold text-foreground hover:text-primary hover:underline truncate">
                          {club.name}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{club.sport || "Sports"}</span>
                        {club.level && (
                          <>
                            <span>•</span>
                            <span>{club.level}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
                    {club.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {club.location}
                        {club.country && `, ${club.country}`}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <Button asChild size="sm">
                      <Link href={`/clubs/${club.id}`}>Voir le club</Link>
                    </Button>
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
