"use client";

import { Job } from "@/lib/types/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Building2, Users, Calendar, Briefcase, Shield } from "lucide-react";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PLAYER_RECRUITMENT: "Recrutement Joueur",
      STAFF_RECRUITMENT: "Recrutement Staff",
      TENDER: "Appel d'offres",
      PARTNERSHIP: "Partenariat",
    };
    return labels[type] || type;
  };

  const getJobTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      PLAYER_RECRUITMENT: "bg-blue-500",
      STAFF_RECRUITMENT: "bg-green-500",
      TENDER: "bg-purple-500",
      PARTNERSHIP: "bg-orange-500",
    };
    return colors[type] || "bg-gray-500";
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
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Club Logo */}
          {job.club && (
            <Link href={`/clubs/${job.club.id}`}>
              <Avatar className="h-16 w-16">
                <AvatarImage src={job.club.logo || undefined} alt={job.club.name} />
                <AvatarFallback>{getInitials(job.club.name)}</AvatarFallback>
              </Avatar>
            </Link>
          )}

          {/* Job Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getJobTypeColor(job.type)}>
                    {getJobTypeLabel(job.type)}
                  </Badge>
                  {job.status === 'OPEN' && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-1 line-clamp-1">
                  {job.title}
                </h3>
                
                {job.club && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Building2 className="h-4 w-4" />
                    <Link href={`/clubs/${job.club.id}`} className="hover:text-primary">
                      {job.club.name}
                    </Link>
                    {job.club.verified && (
                      <Shield className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                )}
              </div>

              <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                <div className="flex items-center gap-1 justify-end">
                  <Clock className="h-4 w-4" />
                  {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { 
                    addSuffix: true, 
                    locale: fr 
                  }) : 'Date inconnue'}
                </div>
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {job.description}
              </p>
            )}

            {/* Job Details */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              {job.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
              )}

              {job.type && (
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{getJobTypeLabel(job.type)}</span>
                </div>
              )}

              {job.deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date limite: {new Date(job.deadline).toLocaleDateString('fr-FR')}</span>
                </div>
              )}

              {job.status === 'OPEN' && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Offre active</span>
                </div>
              )}
            </div>

            {/* Requirements - Removed as not in API */}

            {/* Actions */}
            <div className="flex gap-2">
              <Button>
                Postuler
              </Button>
              <Button variant="outline">
                Voir les détails
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
