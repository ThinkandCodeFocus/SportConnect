"use client";

import { Club } from "@/lib/types/api";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Trophy, Calendar } from "lucide-react";

interface ClubCardProps {
  club: Club;
}

export function ClubCard({ club }: ClubCardProps) {
  const getClubTypeLabel = (type: string) => {
    switch (type) {
      case "PROFESSIONAL_CLUB": return "Club Professionnel";
      case "AMATEUR_CLUB": return "Club Amateur";
      case "ACADEMY": return "Académie";
      case "FEDERATION": return "Fédération";
      case "NATIONAL_TEAM": return "Équipe Nationale";
      default: return type;
    }
  };

  const getSportLabel = (sport: string) => {
    switch (sport) {
      case "FOOTBALL": return "Football";
      case "BASKETBALL": return "Basketball";
      case "VOLLEYBALL": return "Volleyball";
      case "HANDBALL": return "Handball";
      case "ATHLETICS": return "Athlétisme";
      case "SWIMMING": return "Natation";
      case "TENNIS": return "Tennis";
      case "MARTIAL_ARTS": return "Arts Martiaux";
      case "OTHER": return "Autre";
      default: return sport;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Link href={`/clubs/${club.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={club.logo || undefined} alt={club.name} />
              <AvatarFallback>{getInitials(club.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-1">{club.name}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {getClubTypeLabel(club.type)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getSportLabel(club.sport)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          {club.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {club.description}
            </p>
          )}

          <div className="space-y-2">
            {club.city && club.country && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{club.city}, {club.country}</span>
              </div>
            )}

            {club.foundedYear && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Fondé en {club.foundedYear}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{club.followersCount || 0} membres</span>
            </div>

            {club.openPositionsCount && club.openPositionsCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="h-4 w-4" />
                <span>{club.openPositionsCount} postes ouverts</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" variant="outline">
            Voir le profil
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
