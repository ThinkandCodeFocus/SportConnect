"use client";

import { User, UserProfile } from "@/lib/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, ExternalLink } from "lucide-react";

interface ProfileSidebarProps {
  user: User;
  profile: UserProfile | null;
}

export function ProfileSidebar({ user, profile }: ProfileSidebarProps) {
  return (
    <aside className="lg:w-80 space-y-4">
      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations de contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {user.email && (
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <a 
                  href={`mailto:${user.email}`} 
                  className="text-sm text-primary hover:underline"
                >
                  {user.email}
                </a>
              </div>
            </div>
          )}
          
          {user.phone && (
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <a 
                  href={`tel:${user.phone}`} 
                  className="text-sm text-primary hover:underline"
                >
                  {user.phone}
                </a>
              </div>
            </div>
          )}

          {user.createdAt && (
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Membre depuis</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistiques du profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Type de compte</span>
              <Badge variant="secondary">{getRoleLabel(user.role)}</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Statut</span>
              <Badge variant={user.active ? "default" : "secondary"}>
                {user.active ? "Actif" : "Inactif"}
              </Badge>
            </div>

            {user.emailVerified !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Email vérifié</span>
                <Badge variant={user.emailVerified ? "default" : "outline"}>
                  {user.emailVerified ? "Oui" : "Non"}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href={`mailto:${user.email}`}>
              <Mail className="h-4 w-4 mr-2" />
              Envoyer un email
            </a>
          </Button>
          
          {user.phone && (
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={`tel:${user.phone}`}>
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}

function getRoleLabel(role: string): string {
  const roleLabels: Record<string, string> = {
    PLAYER: "Joueur",
    COACH: "Entraîneur",
    AGENT: "Agent",
    SCOUT: "Recruteur",
    CLUB_ADMIN: "Admin Club",
    FAN: "Fan",
  };
  return roleLabels[role] || role;
}
