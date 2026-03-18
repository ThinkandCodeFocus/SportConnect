"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Briefcase, Trophy, Building2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api/endpoints"
import { Club, JobPost } from "@/lib/types/api"

export function RightSidebar() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [jobs, setJobs] = useState<JobPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Fetch clubs
      const clubsResponse = await api.club.getAll()
      setClubs(clubsResponse.data.slice(0, 3))

      // Fetch recent jobs
      try {
        const jobsResponse = await api.job.getAll()
        setJobs(jobsResponse.data.slice(0, 2))
      } catch {
        // Si l'endpoint jobs n'existe pas, on laisse vide
        setJobs([])
      }
    } catch (error) {
      console.error("Failed to load sidebar data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
      {/* Featured Clubs */}
      <Card>
        <CardHeader className="pb-3 flex items-center justify-between flex-row">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Clubs à suivre
          </CardTitle>
          <Link href="/clubs" className="text-xs text-primary hover:underline">
            Voir tous
          </Link>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : clubs.length > 0 ? (
            <div className="space-y-3">
              {clubs.map((club) => (
                <Link
                  key={club.id}
                  href={`/clubs/${club.id}`}
                  className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{club.name}</p>
                    <p className="text-xs text-muted-foreground">{club.type}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">Aucun club trouvé</p>
          )}
          <Link href="/clubs">
            <Button variant="outline" className="w-full mt-3 h-8 text-xs">
              Découvrir plus de clubs
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Featured Job Offers */}
      {jobs.length > 0 && (
        <Card>
          <CardHeader className="pb-3 flex items-center justify-between flex-row">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Offres recommandées
            </CardTitle>
            <Link href="/jobs" className="text-xs text-primary hover:underline">
              Voir tous
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs`}
                  className="flex items-start gap-3 p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0 mt-1">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground line-clamp-1">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.salary || "Salaire à discuter"}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/jobs">
              <Button variant="outline" className="w-full mt-3 h-8 text-xs">
                Voir toutes les offres
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-700 text-white">
        <CardContent className="pt-6 text-center">
          <Trophy className="h-8 w-8 mx-auto mb-2 opacity-80" />
          <h3 className="font-semibold text-sm mb-1">Améliorez votre profil</h3>
          <p className="text-xs opacity-90 mb-4">
            Complétez vos informations pour être visible auprès des clubs et recruteurs
          </p>
          <Link href="/profile">
            <Button variant="secondary" size="sm" className="w-full h-8 text-xs">
              Aller au profil
            </Button>
          </Link>
        </CardContent>
      </Card>
    </aside>
  )
}

