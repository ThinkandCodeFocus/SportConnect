"use client";

import { User, UserProfile } from "@/lib/types/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Building2, Mail, Phone, ExternalLink, Edit } from "lucide-react";
import { useState } from "react";
import { EditProfileDialog } from "./edit-profile-dialog";

interface ProfileHeaderProps {
  user: User;
  profile: UserProfile | null;
}

export function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getUserInitials = () => {
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  };

  const getRoleLabel = () => {
    const roleLabels: Record<string, string> = {
      PLAYER: "Joueur",
      COACH: "Entraîneur",
      AGENT: "Agent",
      SCOUT: "Recruteur",
      CLUB_ADMIN: "Admin Club",
      FAN: "Fan",
    };
    return roleLabels[user.role] || user.role;
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Cover Photo */}
        <div 
          className="h-48 bg-gradient-to-r from-primary to-primary/60"
          style={{
            backgroundImage: profile?.coverPhoto ? `url(${profile.coverPhoto})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 -mt-16 sm:-mt-12">
            {/* Avatar */}
            <Avatar className="h-32 w-32 border-4 border-card">
              <AvatarImage src={profile?.profilePicture} />
              <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
            </Avatar>

            {/* Name and Actions */}
            <div className="flex-1 pt-16 sm:pt-12">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-lg text-muted-foreground mt-1">
                    {profile?.position || getRoleLabel()}
                  </p>
                  {profile?.currentClub && (
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{profile.currentClub}</span>
                    </div>
                  )}
                </div>

                <Button onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le profil
                </Button>
              </div>

              {/* Info Tags */}
              <div className="flex flex-wrap gap-4 mt-4">
                {profile?.location && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}{profile.country && `, ${profile.country}`}</span>
                  </div>
                )}
                
                {user.email && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                )}

                {user.phone && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}

                {user.createdAt && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Membre depuis {new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</span>
                  </div>
                )}
              </div>

              {/* Skills/Languages */}
              {(profile?.skills || profile?.languages) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile?.skills?.map((skill, index) => (
                    <Badge key={`skill-${index}`} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  {profile?.languages?.map((lang, index) => (
                    <Badge key={`lang-${index}`} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditProfileDialog
        user={user}
        profile={profile}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
