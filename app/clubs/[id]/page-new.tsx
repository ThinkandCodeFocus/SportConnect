"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api/endpoints";
import { Club, User } from "@/lib/types/api";
import { Header } from "@/components/layout/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MapPin, Calendar, Trophy, Users, Shield, ArrowLeft, Mail, Phone, Globe } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ClubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clubId = Number(params.id);

  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (clubId) {
      loadClub();
      loadMembers();
    }
  }, [clubId]);

  const loadClub = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await api.club.getById(clubId.toString());
      setClub(response.data);
    } catch (err: any) {
      console.error("Failed to load club:", err);
      setError(err.message || "Échec du chargement du club");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMembers = async () => {
    setIsLoadingMembers(true);
    
    try {
      const response = await api.club.getMembers(clubId.toString());
      setMembers(response.data);
    } catch (err: any) {
      console.error("Failed to load members:", err);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const getClubTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PROFESSIONAL_CLUB: "Club Professionnel",
      AMATEUR_CLUB: "Club Amateur",
      ACADEMY: "Académie",
      FEDERATION: "Fédération",
      NATIONAL_TEAM: "Équipe Nationale",
    };
    return labels[type] || type;
  };

  const getSportLabel = (sport: string) => {
    const labels: Record<string, string> = {
      FOOTBALL: "Football",
      BASKETBALL: "Basketball",
      VOLLEYBALL: "Volleyball",
      HANDBALL: "Handball",
      ATHLETICS: "Athlétisme",
      SWIMMING: "Natation",
      TENNIS: "Tennis",
      MARTIAL_ARTS: "Arts Martiaux",
      OTHER: "Autre",
    };
    return labels[sport] || sport;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Alert variant="destructive">
            <AlertDescription>{error || "Club introuvable"}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/clubs')} className="mt-4" variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux clubs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Back button */}
        <Button onClick={() => router.push('/clubs')} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux clubs
        </Button>

        {/* Club Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={club.logo || undefined} alt={club.name} />
                <AvatarFallback>{getInitials(club.name)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">{getClubTypeLabel(club.type)}</Badge>
                  <Badge variant="outline">{getSportLabel(club.sport)}</Badge>
                  {club.verified && (
                    <Badge className="bg-blue-500">
                      <Shield className="h-3 w-3 mr-1" />
                      Vérifié
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold mb-2">{club.name}</h1>
                
                {club.description && (
                  <p className="text-muted-foreground mb-4">{club.description}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {club.city && club.country && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{club.city}, {club.country}</span>
                    </div>
                  )}
                  {club.foundedYear && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Fondé en {club.foundedYear}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{club.followersCount || 0} membres</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button>Rejoindre le club</Button>
                  <Button variant="outline" className="ml-2">Suivre</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="about" className="space-y-4">
          <TabsList>
            <TabsTrigger value="about">À propos</TabsTrigger>
            <TabsTrigger value="members">Membres ({members.length})</TabsTrigger>
            <TabsTrigger value="achievements">Palmarès</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {club.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{club.description}</p>
                    </CardContent>
                  </Card>
                )}
                
                {club.openPositionsCount && club.openPositionsCount > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Postes ouverts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span>{club.openPositionsCount} postes disponibles</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {club.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={club.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Site web
                        </a>
                      </div>
                    )}
                    {club.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${club.email}`} className="text-primary hover:underline">
                          {club.email}
                        </a>
                      </div>
                    )}
                    {club.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{club.phone}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            {isLoadingMembers ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : members.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Aucun membre pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((member: any) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                        <Avatar>
                          <AvatarImage src={member.user?.profile?.photoUrl || undefined} alt={member.user?.firstName} />
                          <AvatarFallback>{member.user?.firstName?.[0]}{member.user?.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{member.user?.firstName} {member.user?.lastName}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            {club.openPositionsCount && club.openPositionsCount > 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <Trophy className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{club.openPositionsCount} postes ouverts</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune distinction pour le moment</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
