"use client";

import { useState, useEffect } from "react";
import { User, UserProfile } from "@/lib/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Award, Trophy, GraduationCap } from "lucide-react";

interface ProfileContentProps {
  user: User;
  profile: UserProfile | null;
}

export function ProfileContent({ user, profile }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex-1 space-y-4">
      {/* About Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">À propos</CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.bio ? (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {profile.bio}
            </p>
          ) : (
            <p className="text-muted-foreground italic">
              Aucune bio pour le moment. Cliquez sur "Modifier le profil" pour ajouter une description.
            </p>
          )}

          {profile?.experience && (
            <div className="mt-4 p-3 bg-secondary rounded-lg">
              <p className="text-sm font-medium">Expérience</p>
              <p className="text-sm text-muted-foreground mt-1">{profile.experience}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs Section */}
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
                value="skills" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3"
              >
                Compétences
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3"
              >
                Réalisations
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <CardContent className="pt-4">
            <TabsContent value="overview" className="m-0">
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Rôle</p>
                    <p className="text-lg font-semibold mt-1">
                      {profile?.position || getRoleLabel(user.role)}
                    </p>
                  </div>
                  
                  {profile?.currentClub && (
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">Club</p>
                      <p className="text-lg font-semibold mt-1">{profile.currentClub}</p>
                    </div>
                  )}
                  
                  {profile?.location && (
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">Localisation</p>
                      <p className="text-lg font-semibold mt-1">
                        {profile.location}
                        {profile.country && `, ${profile.country}`}
                      </p>
                    </div>
                  )}
                </div>

                {profile?.languages && profile.languages.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Langues</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages.map((lang, index) => (
                        <Badge key={index} variant="outline">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="skills" className="m-0">
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Aucune compétence ajoutée. Modifiez votre profil pour ajouter vos compétences.
                </p>
              )}
            </TabsContent>

            <TabsContent value="achievements" className="m-0">
              {profile?.achievements && profile.achievements.length > 0 ? (
                <div className="space-y-3">
                  {profile.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                      <Trophy className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">{achievement}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Aucune réalisation ajoutée. Modifiez votre profil pour ajouter vos accomplissements.
                </p>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
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
