"use client"

import { useState } from "react"
import {
  Users,
  Trophy,
  TrendingUp,
  Settings,
  Plus,
  BarChart3,
  Calendar,
  MapPin,
  Edit,
  Briefcase,
  FileText,
  Bell,
  Shield,
  Target,
  Medal,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ClubPlayersManager } from "./club-players-manager"
import { ClubPerformance } from "./club-performance"
import { ClubComparison } from "./club-comparison"
import { ClubSettings } from "./club-settings"

interface ClubData {
  id: number
  name: string
  logo: string
  sport: string
  league: string
  location: string
  founded: string
  stadium: string
  capacity: number
  description: string
  website: string
  followers: number
  verified: boolean
}

const initialClubData: ClubData | null = {
  id: 1,
  name: "FC Lumière Lyon",
  logo: "FCL",
  sport: "Football",
  league: "National 2",
  location: "Lyon, France",
  founded: "2015",
  stadium: "Stade Municipal de Gerland",
  capacity: 5000,
  description: "Club de football ambitieux évoluant en National 2, avec un centre de formation prometteur.",
  website: "www.fclumiere.fr",
  followers: 12500,
  verified: true,
}

const clubStats = {
  players: 28,
  staff: 12,
  wins: 18,
  draws: 6,
  losses: 4,
  goalsFor: 52,
  goalsAgainst: 24,
  points: 60,
  position: 2,
  totalTeams: 18,
}

const recentMatches = [
  { id: 1, opponent: "AS Villefranche", result: "3-1", type: "Victoire", date: "28 Jan 2026" },
  { id: 2, opponent: "FC Annecy B", result: "2-2", type: "Nul", date: "21 Jan 2026" },
  { id: 3, opponent: "Olympique Valence", result: "4-0", type: "Victoire", date: "14 Jan 2026" },
  { id: 4, opponent: "US Bourgoin", result: "1-0", type: "Victoire", date: "7 Jan 2026" },
]

const upcomingMatches = [
  { id: 1, opponent: "Grenoble Foot B", date: "4 Fév 2026", time: "15:00", venue: "Domicile" },
  { id: 2, opponent: "FC Chambéry", date: "11 Fév 2026", time: "18:00", venue: "Extérieur" },
]

export function MyClubDashboard() {
  const [hasClub, setHasClub] = useState(true)
  const [clubData, setClubData] = useState<ClubData | null>(initialClubData)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [newClubData, setNewClubData] = useState({
    name: "",
    sport: "",
    league: "",
    location: "",
    description: "",
  })

  const handleCreateClub = () => {
    if (!newClubData.name || !newClubData.sport) return
    
    const newClub: ClubData = {
      id: Date.now(),
      name: newClubData.name,
      logo: newClubData.name.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase(),
      sport: newClubData.sport,
      league: newClubData.league || "Amateur",
      location: newClubData.location || "France",
      founded: new Date().getFullYear().toString(),
      stadium: "",
      capacity: 0,
      description: newClubData.description,
      website: "",
      followers: 0,
      verified: false,
    }
    
    setClubData(newClub)
    setHasClub(true)
    setShowCreateDialog(false)
    setNewClubData({ name: "", sport: "", league: "", location: "", description: "" })
  }

  if (!hasClub || !clubData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mon Club</h1>
          <p className="text-muted-foreground">Gérez votre club sportif</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Vous n'avez pas encore de club</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Créez votre club pour gérer vos joueurs, suivre vos performances et vous comparer aux autres équipes.
            </p>
            <Button size="lg" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Créer mon club
            </Button>
          </CardContent>
        </Card>

        {/* Create Club Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer votre club</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer votre club sportif.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="clubName">Nom du club *</Label>
                <Input
                  id="clubName"
                  placeholder="Ex: FC Lumière Lyon"
                  value={newClubData.name}
                  onChange={(e) => setNewClubData({ ...newClubData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sport">Sport *</Label>
                  <Select
                    value={newClubData.sport}
                    onValueChange={(value) => setNewClubData({ ...newClubData, sport: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Handball">Handball</SelectItem>
                      <SelectItem value="Rugby">Rugby</SelectItem>
                      <SelectItem value="Volleyball">Volleyball</SelectItem>
                      <SelectItem value="Athlétisme">Athlétisme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="league">Ligue/Division</Label>
                  <Input
                    id="league"
                    placeholder="Ex: National 2"
                    value={newClubData.league}
                    onChange={(e) => setNewClubData({ ...newClubData, league: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <Input
                  id="location"
                  placeholder="Ex: Lyon, France"
                  value={newClubData.location}
                  onChange={(e) => setNewClubData({ ...newClubData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre club..."
                  value={newClubData.description}
                  onChange={(e) => setNewClubData({ ...newClubData, description: e.target.value })}
                  className="min-h-20"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="bg-transparent">
                Annuler
              </Button>
              <Button onClick={handleCreateClub} disabled={!newClubData.name || !newClubData.sport}>
                Créer le club
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
            <span className="font-bold text-xl text-primary-foreground">{clubData.logo}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{clubData.name}</h1>
              {clubData.verified && (
                <Badge className="bg-primary/10 text-primary">Vérifié</Badge>
              )}
            </div>
            <p className="text-muted-foreground">{clubData.sport} • {clubData.league}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent" onClick={() => setActiveTab("settings")}>
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{clubStats.players}</p>
                <p className="text-sm text-muted-foreground">Joueurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{clubStats.wins}</p>
                <p className="text-sm text-muted-foreground">Victoires</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Medal className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{clubStats.position}e</p>
                <p className="text-sm text-muted-foreground">Classement</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{clubStats.points}</p>
                <p className="text-sm text-muted-foreground">Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start bg-card border border-border h-auto p-1 rounded-lg overflow-x-auto">
          <TabsTrigger value="overview" className="text-sm">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="players" className="text-sm">Effectif</TabsTrigger>
          <TabsTrigger value="performance" className="text-sm">Performances</TabsTrigger>
          <TabsTrigger value="comparison" className="text-sm">Comparaison</TabsTrigger>
          <TabsTrigger value="settings" className="text-sm">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Season Progress */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Progression de la saison</CardTitle>
                <CardDescription>Saison 2025-2026</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{clubStats.wins}</p>
                    <p className="text-sm text-muted-foreground">Victoires</p>
                  </div>
                  <div className="p-4 bg-yellow-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{clubStats.draws}</p>
                    <p className="text-sm text-muted-foreground">Nuls</p>
                  </div>
                  <div className="p-4 bg-red-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{clubStats.losses}</p>
                    <p className="text-sm text-muted-foreground">Défaites</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progression vers le titre</span>
                    <span className="font-medium text-foreground">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Buts marqués</p>
                    <p className="text-xl font-bold text-foreground">{clubStats.goalsFor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Buts encaissés</p>
                    <p className="text-xl font-bold text-foreground">{clubStats.goalsAgainst}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Différence de buts</p>
                    <p className="text-xl font-bold text-primary">+{clubStats.goalsFor - clubStats.goalsAgainst}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Matchs joués</p>
                    <p className="text-xl font-bold text-foreground">{clubStats.wins + clubStats.draws + clubStats.losses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* League Position */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Position au classement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-4xl font-bold text-primary">{clubStats.position}</span>
                  </div>
                  <p className="text-muted-foreground">sur {clubStats.totalTeams} équipes</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points</span>
                    <span className="font-medium text-foreground">{clubStats.points}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prochain objectif</span>
                    <span className="font-medium text-primary">1ère place</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points à rattraper</span>
                    <span className="font-medium text-foreground">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent and Upcoming Matches */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Derniers résultats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{match.opponent}</p>
                      <p className="text-xs text-muted-foreground">{match.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{match.result}</p>
                      <Badge
                        variant="secondary"
                        className={
                          match.type === "Victoire"
                            ? "bg-green-500/10 text-green-600"
                            : match.type === "Nul"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : "bg-red-500/10 text-red-600"
                        }
                      >
                        {match.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prochains matchs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{match.opponent}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {match.date} à {match.time}
                      </div>
                    </div>
                    <Badge variant="outline">{match.venue}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2 bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un match
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="players" className="mt-6">
          <ClubPlayersManager clubId={clubData.id} />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <ClubPerformance clubId={clubData.id} clubStats={clubStats} />
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <ClubComparison clubId={clubData.id} clubData={clubData} clubStats={clubStats} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <ClubSettings clubData={clubData} setClubData={setClubData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
