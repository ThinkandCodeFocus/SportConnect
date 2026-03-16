"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Pencil,
  Plus,
  ChevronRight,
  Calendar,
  Trophy,
  Award,
  Play,
  ExternalLink,
  GraduationCap,
  Medal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const careerHistory = [
  {
    id: 1,
    club: "Olympique de Marseille",
    logo: "OM",
    role: "Milieu offensif",
    period: "2024 - Présent",
    current: true,
    stats: { matches: 28, goals: 7, assists: 12 },
  },
  {
    id: 2,
    club: "OGC Nice",
    logo: "OGCN",
    role: "Milieu offensif",
    period: "2022 - 2024",
    current: false,
    stats: { matches: 64, goals: 15, assists: 23 },
  },
  {
    id: 3,
    club: "AS Monaco (U21)",
    logo: "ASM",
    role: "Milieu de terrain",
    period: "2019 - 2022",
    current: false,
    stats: { matches: 45, goals: 8, assists: 14 },
  },
]

const achievements = [
  { id: 1, title: "Meilleur passeur Ligue 1", year: "2024", icon: Trophy },
  { id: 2, title: "Équipe type de la saison", year: "2023", icon: Award },
  { id: 3, title: "Révélation de l'année", year: "2022", icon: Medal },
]

const seasonStats = [
  { label: "Matchs joués", value: "28" },
  { label: "Buts", value: "7" },
  { label: "Passes décisives", value: "12" },
  { label: "Minutes jouées", value: "2,340" },
  { label: "Note moyenne", value: "7.8" },
  { label: "Précision passes", value: "89%" },
]

const videos = [
  {
    id: 1,
    title: "Highlights vs PSG",
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop",
    duration: "3:45",
    views: "12K",
  },
  {
    id: 2,
    title: "Meilleurs moments 2024",
    thumbnail: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=250&fit=crop",
    duration: "8:22",
    views: "45K",
  },
  {
    id: 3,
    title: "But du mois - Janvier",
    thumbnail: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=250&fit=crop",
    duration: "1:15",
    views: "8.5K",
  },
]

const certifications = [
  { id: 1, title: "UEFA B License", issuer: "UEFA", year: "2023" },
  { id: 2, title: "Préparation mentale", issuer: "INSEP", year: "2022" },
]

export function ProfileContent() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex-1 space-y-4">
      {/* About Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">À propos</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Milieu offensif passionné avec plus de 5 ans d&apos;expérience au niveau professionnel. 
            Spécialisé dans la création de jeu et les passes décisives. 
            Ancien international U21, je cherche constamment à progresser et à apporter ma contribution à mon équipe.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Disponible pour des opportunités en Ligue 1 ou dans les championnats européens majeurs.
            Trilingue : Français, Anglais, Espagnol.
          </p>
        </CardContent>
      </Card>

      {/* Stats & Performance Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-6">
              <TabsTrigger 
                value="overview" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3"
              >
                Vue d&apos;ensemble
              </TabsTrigger>
              <TabsTrigger 
                value="stats" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3"
              >
                Statistiques
              </TabsTrigger>
              <TabsTrigger 
                value="videos" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3"
              >
                Vidéos
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="pt-4">
            <TabsContent value="overview" className="m-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {seasonStats.map((stat, index) => (
                  <div key={index} className="p-4 bg-secondary/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">Statistiques saison 2025-2026</p>
            </TabsContent>
            <TabsContent value="stats" className="m-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Statistiques par saison</h4>
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    Voir tout <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-medium text-muted-foreground">Saison</th>
                        <th className="text-center py-2 font-medium text-muted-foreground">MJ</th>
                        <th className="text-center py-2 font-medium text-muted-foreground">Buts</th>
                        <th className="text-center py-2 font-medium text-muted-foreground">PD</th>
                        <th className="text-center py-2 font-medium text-muted-foreground">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-3 text-foreground">2025-26</td>
                        <td className="text-center py-3">28</td>
                        <td className="text-center py-3">7</td>
                        <td className="text-center py-3">12</td>
                        <td className="text-center py-3 text-primary font-medium">7.8</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3 text-foreground">2024-25</td>
                        <td className="text-center py-3">34</td>
                        <td className="text-center py-3">9</td>
                        <td className="text-center py-3">15</td>
                        <td className="text-center py-3 text-primary font-medium">7.5</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-foreground">2023-24</td>
                        <td className="text-center py-3">30</td>
                        <td className="text-center py-3">6</td>
                        <td className="text-center py-3">8</td>
                        <td className="text-center py-3 text-primary font-medium">7.2</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="videos" className="m-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <Link key={video.id} href={`/videos/${video.id}`} className="group relative rounded-lg overflow-hidden">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      width={400}
                      height={250}
                      className="aspect-video object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-card/90 flex items-center justify-center">
                        <Play className="h-6 w-6 text-primary fill-primary ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-medium text-card truncate">{video.title}</p>
                      <div className="flex items-center gap-2 text-xs text-card/80">
                        <span>{video.duration}</span>
                        <span>•</span>
                        <span>{video.views} vues</span>
                      </div>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-foreground/70 text-card text-xs">
                      {video.duration}
                    </Badge>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Career History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Parcours sportif</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {careerHistory.map((club, index) => (
            <div key={club.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <span className="font-bold text-sm text-foreground">{club.logo}</span>
                </div>
                {index < careerHistory.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border mt-2" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{club.role}</h4>
                    <Link href={`/clubs/${club.id}`} className="text-primary hover:underline">
                      {club.club}
                    </Link>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {club.period}
                    </p>
                  </div>
                  {club.current && (
                    <Badge className="bg-primary/10 text-primary">Actuel</Badge>
                  )}
                </div>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">{club.stats.matches}</strong> matchs
                  </span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">{club.stats.goals}</strong> buts
                  </span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">{club.stats.assists}</strong> passes déc.
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Palmarès</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="p-4 bg-secondary/50 rounded-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                  <achievement.icon className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.year}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Certifications & Diplômes</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{cert.title}</p>
                <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.year}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
