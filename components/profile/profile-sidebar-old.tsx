"use client"

import Link from "next/link"
import {
  Languages,
  Shield,
  Star,
  UserPlus,
  ExternalLink,
  MapPin,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const recommendations = [
  {
    id: 1,
    name: "Jean-Pierre Martinez",
    role: "Entraîneur - OGC Nice",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    text: "Un joueur d'exception avec une vision de jeu remarquable. Karim a été un élément clé de notre dispositif.",
    date: "Janvier 2024",
  },
  {
    id: 2,
    name: "Marc Dubois",
    role: "Directeur sportif - AS Monaco",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    text: "Professionnel exemplaire, toujours à l'écoute et en progression constante.",
    date: "Août 2022",
  },
]

const skills = [
  { name: "Vision de jeu", level: 92 },
  { name: "Passes longues", level: 88 },
  { name: "Dribbles", level: 85 },
  { name: "Tirs", level: 78 },
  { name: "Endurance", level: 82 },
]

const languages = [
  { name: "Français", level: "Natif" },
  { name: "Anglais", level: "Courant" },
  { name: "Espagnol", level: "Intermédiaire" },
]

const similarProfiles = [
  {
    id: 1,
    name: "Antoine Dupont",
    role: "Milieu offensif • PSG",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    mutualConnections: 24,
  },
  {
    id: 2,
    name: "Lucas Bernard",
    role: "Milieu de terrain • Lyon",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    mutualConnections: 18,
  },
  {
    id: 3,
    name: "Hugo Martin",
    role: "Meneur de jeu • Lille",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    mutualConnections: 12,
  },
]

export function ProfileSidebar() {
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-4">
      {/* Profile Strength */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Complétude du profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Niveau avancé</span>
              <span className="font-semibold text-primary">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Ajoutez une vidéo de présentation pour atteindre 100%
          </p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Compétences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {skills.map((skill, index) => (
            <div key={index}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">{skill.name}</span>
                <span className="font-medium text-foreground">{skill.level}</span>
              </div>
              <Progress value={skill.level} className="h-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Languages className="h-4 w-4 text-primary" />
            Langues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{lang.name}</span>
                <Badge variant="secondary" className="text-xs">{lang.level}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recommandations</CardTitle>
            <Badge variant="secondary">2</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={rec.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{rec.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${rec.id}`} className="font-medium text-sm text-foreground hover:underline hover:text-primary">
                    {rec.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{rec.role}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 italic">&ldquo;{rec.text}&rdquo;</p>
              <p className="text-xs text-muted-foreground mt-1">{rec.date}</p>
            </div>
          ))}
          <Link href="/profile/recommendations" className="text-sm text-primary hover:underline flex items-center gap-1">
            Voir toutes les recommandations
            <ExternalLink className="h-3 w-3" />
          </Link>
        </CardContent>
      </Card>

      {/* Similar Profiles */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Profils similaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {similarProfiles.map((profile) => (
            <div key={profile.id} className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                <AvatarFallback>{profile.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${profile.id}`} className="font-medium text-sm text-foreground hover:underline hover:text-primary block truncate">
                  {profile.name}
                </Link>
                <p className="text-xs text-muted-foreground truncate">{profile.role}</p>
                <p className="text-xs text-muted-foreground">{profile.mutualConnections} connexions en commun</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 shrink-0 bg-transparent">
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Marseille, France
          </div>
          <p className="text-xs text-muted-foreground">
            Coordonnées visibles uniquement pour les connexions
          </p>
        </CardContent>
      </Card>
    </aside>
  )
}
