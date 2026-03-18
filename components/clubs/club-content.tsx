"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Briefcase,
  Users,
  ChevronRight,
  Trophy,
  Calendar,
  MapPin,
  Clock,
  ThumbsUp,
  MessageCircle,
  Share2,
  Award,
  Globe,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const openPositions = [
  {
    id: 1,
    title: "Milieu défensif",
    level: "Ligue 1",
    salary: "Selon profil",
    postedAt: "Il y a 2j",
    applicants: 45,
  },
  {
    id: 2,
    title: "Ailier gauche",
    level: "Ligue 1",
    salary: "200k-350k€/an",
    postedAt: "Il y a 5j",
    applicants: 32,
  },
  {
    id: 3,
    title: "Préparateur physique",
    level: "Staff",
    salary: "80k-120k€/an",
    postedAt: "Il y a 1 sem",
    applicants: 28,
  },
]

const squad = [
  { id: 1, name: "Pierre Gastaldi", position: "Gardien", number: 1, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: 2, name: "Jean Barresi", position: "Défenseur", number: 4, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { id: 3, name: "Marc Verratti", position: "Milieu", number: 8, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: 4, name: "Lucas Sanchez", position: "Attaquant", number: 10, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
]

const staff = [
  { id: 1, name: "Roberto Martinez", role: "Entraîneur principal", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: 2, name: "Paul Clement", role: "Entraîneur adjoint", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { id: 3, name: "Marie Dupont", role: "Préparatrice physique", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
]

const trophies = [
  { id: 1, title: "Ligue 1", count: 10, lastWon: "2010" },
  { id: 2, title: "Coupe de France", count: 10, lastWon: "1989" },
  { id: 3, title: "Ligue des Champions", count: 1, lastWon: "1993" },
  { id: 4, title: "Trophée des Champions", count: 3, lastWon: "2011" },
]

const recentPosts = [
  {
    id: 1,
    content: "Victoire importante ce week-end face à Lyon ! 3-1, une équipe qui monte en puissance. Merci à nos supporters pour leur soutien incroyable au Vélodrome !",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
    likes: 12453,
    comments: 892,
    timeAgo: "Il y a 2h",
  },
  {
    id: 2,
    content: "Bienvenue à notre nouvelle recrue ! Nous sommes heureux d'annoncer la signature de Marco Verdi pour les 4 prochaines saisons.",
    likes: 8234,
    comments: 567,
    timeAgo: "Il y a 1j",
  },
]

export function ClubContent() {
  const [activeTab, setActiveTab] = useState("about")

  return (
    <div className="flex-1 space-y-4">
      {/* About Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">À propos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            L&apos;AS Dakar Sacré-Cœur est un club de football sénégalais fondé au début du 20e siècle, basé à Dakar. 
            C&apos;est l&apos;un des clubs les plus titrés et respectés du Sénégal, avec une riche histoire de victoires nationales.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Le club évolue en Division 1 et joue ses matchs à domicile au Stade Iba Mar Diop, 
            l&apos;une des plus belles enceintes du Sénégal avec une capacité de 15 000 places.
          </p>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-6">
              <TabsTrigger 
                value="about" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3"
              >
                Effectif
              </TabsTrigger>
              <TabsTrigger 
                value="jobs" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3"
              >
                Offres
              </TabsTrigger>
              <TabsTrigger 
                value="posts" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3"
              >
                Publications
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="pt-4">
            <TabsContent value="about" className="m-0 space-y-6">
              {/* Squad */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">Joueurs</h4>
                  <Link href="/clubs/1/squad" className="text-sm text-primary hover:underline flex items-center gap-1">
                    Voir tout <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {squad.map((player) => (
                    <Link key={player.id} href={`/profile/${player.id}`} className="p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-2">
                        <AvatarImage src={player.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{player.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm text-foreground truncate">{player.name}</p>
                      <p className="text-xs text-muted-foreground">{player.position} • #{player.number}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Staff */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">Staff technique</h4>
                  <Link href="/clubs/1/staff" className="text-sm text-primary hover:underline flex items-center gap-1">
                    Voir tout <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {staff.map((member) => (
                    <Link key={member.id} href={`/profile/${member.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="m-0 space-y-3">
              {openPositions.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="block p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{job.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">{job.level}</Badge>
                        <span>{job.salary}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">{job.postedAt}</p>
                      <p className="text-xs text-muted-foreground">{job.applicants} candidatures</p>
                    </div>
                  </div>
                </Link>
              ))}
              <Link href="/jobs?club=1" className="flex items-center justify-center gap-1 text-sm text-primary hover:underline pt-2">
                Voir toutes les offres <ChevronRight className="h-4 w-4" />
              </Link>
            </TabsContent>

            <TabsContent value="posts" className="m-0 space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <p className="text-foreground">{post.content}</p>
                  {post.image && (
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt="Post image"
                      width={600}
                      height={400}
                      className="w-full rounded-lg mt-3 object-cover"
                    />
                  )}
                  <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {post.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </span>
                    <span className="ml-auto">{post.timeAgo}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Trophies */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Palmarès
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {trophies.map((trophy) => (
              <div key={trophy.id} className="p-3 bg-secondary/50 rounded-lg text-center">
                <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="font-bold text-xl text-foreground">{trophy.count}</p>
                <p className="text-sm text-muted-foreground">{trophy.title}</p>
                <p className="text-xs text-muted-foreground mt-1">Dernier : {trophy.lastWon}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
