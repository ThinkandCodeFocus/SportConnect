"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Camera,
  MapPin,
  Award,
  Users,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Share2,
  UserPlus,
  Check,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ProfileHeader() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <Card className="overflow-hidden">
      {/* Banner */}
      <div className="relative h-32 sm:h-48 lg:h-56 bg-gradient-to-r from-primary/80 via-primary to-primary/60">
        <Image
          src="https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1200&h=400&fit=crop"
          alt="Profile banner"
          fill
          className="object-cover mix-blend-overlay opacity-50"
        />
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 gap-2 opacity-90 hover:opacity-100"
        >
          <Camera className="h-4 w-4" />
          <span className="hidden sm:inline">Modifier la bannière</span>
        </Button>
      </div>

      <CardContent className="relative pt-0 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 sm:-top-20 left-4 sm:left-6">
          <div className="relative">
            <Avatar className="h-28 w-28 sm:h-36 sm:w-36 border-4 border-card shadow-lg">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" />
              <AvatarFallback className="text-3xl">KM</AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Actions - Desktop */}
        <div className="flex justify-end pt-2 gap-2">
          <Button variant="outline" size="sm" className="gap-2 hidden sm:flex bg-transparent">
            <Share2 className="h-4 w-4" />
            Partager
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Message</span>
          </Button>
          <Button
            size="sm"
            className="gap-2"
            variant={isConnected ? "secondary" : "default"}
            onClick={() => setIsConnected(!isConnected)}
          >
            {isConnected ? (
              <>
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">Connecté</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Se connecter</span>
              </>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Modifier le profil
              </DropdownMenuItem>
              <DropdownMenuItem>Enregistrer en PDF</DropdownMenuItem>
              <DropdownMenuItem>Copier le lien</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Bloquer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Profile Info */}
        <div className="mt-12 sm:mt-16">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Karim Mbappé</h1>
                <Award className="h-6 w-6 text-primary fill-primary" />
              </div>
              <p className="text-lg text-muted-foreground mt-1">Milieu offensif | Ligue 1</p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Marseille, France
                </span>
                <Link href="/clubs/om" className="text-primary hover:underline font-medium">
                  Olympique de Marseille
                </Link>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Football</Badge>
                <Badge variant="secondary">Semi-professionnel</Badge>
                <Badge variant="outline">Milieu de terrain</Badge>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-border">
            <Link href="/profile/connections" className="text-center hover:bg-secondary px-3 py-2 rounded-lg transition-colors">
              <p className="text-xl font-bold text-foreground">847</p>
              <p className="text-sm text-muted-foreground">connexions</p>
            </Link>
            <div className="text-center px-3 py-2">
              <p className="text-xl font-bold text-foreground">234</p>
              <p className="text-sm text-muted-foreground">vues du profil</p>
            </div>
            <div className="text-center px-3 py-2">
              <p className="text-xl font-bold text-foreground">56</p>
              <p className="text-sm text-muted-foreground">publications</p>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <Avatar key={i} className="h-8 w-8 border-2 border-card">
                    <AvatarImage src={`https://images.unsplash.com/photo-${1500000000000 + i * 7000000}?w=50&h=50&fit=crop&crop=face`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                <Users className="h-4 w-4 inline mr-1" />
                12 connexions en commun
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
