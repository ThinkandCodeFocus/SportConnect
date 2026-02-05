"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  Users,
  BadgeCheck,
  Bell,
  Share2,
  ExternalLink,
  Trophy,
  Calendar,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function ClubHeader() {
  const [isFollowing, setIsFollowing] = useState(false)
  const [notificationsOn, setNotificationsOn] = useState(false)

  return (
    <Card className="overflow-hidden">
      {/* Banner */}
      <div className="relative h-40 sm:h-52 lg:h-64">
        <Image
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&h=400&fit=crop"
          alt="Club banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
      </div>

      <CardContent className="relative pt-0 pb-6">
        {/* Logo */}
        <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-card border-4 border-card shadow-lg flex items-center justify-center">
            <span className="font-bold text-3xl sm:text-4xl text-foreground">OM</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-2 gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={notificationsOn ? "text-primary" : "text-muted-foreground"}
            onClick={() => setNotificationsOn(!notificationsOn)}
          >
            <Bell className={`h-5 w-5 ${notificationsOn ? "fill-primary" : ""}`} />
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Partager</span>
          </Button>
          <Button
            size="sm"
            variant={isFollowing ? "secondary" : "default"}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? "Suivi" : "Suivre"}
          </Button>
        </div>

        {/* Club Info */}
        <div className="mt-10 sm:mt-14">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Olympique de Marseille</h1>
                <BadgeCheck className="h-6 w-6 text-primary fill-primary/20" />
              </div>
              <p className="text-muted-foreground mt-1">Club de football professionnel</p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Marseille, France
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  Ligue 1
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Fondé en 1899
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Football</Badge>
                <Badge variant="secondary">Professionnel</Badge>
                <Badge variant="outline">Ligue 1</Badge>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-border">
            <div className="text-center px-3 py-2">
              <p className="text-xl font-bold text-foreground">1.8M</p>
              <p className="text-sm text-muted-foreground">abonnés</p>
            </div>
            <div className="text-center px-3 py-2">
              <p className="text-xl font-bold text-foreground">620</p>
              <p className="text-sm text-muted-foreground">employés</p>
            </div>
            <div className="text-center px-3 py-2">
              <p className="text-xl font-bold text-foreground">29</p>
              <p className="text-sm text-muted-foreground">trophées</p>
            </div>
            <div className="text-center px-3 py-2">
              <p className="text-xl font-bold text-primary">8</p>
              <p className="text-sm text-muted-foreground">offres ouvertes</p>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Link href="https://om.fr" target="_blank" className="flex items-center gap-1 text-sm text-primary hover:underline">
                <Globe className="h-4 w-4" />
                om.fr
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
