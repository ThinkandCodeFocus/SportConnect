"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Trophy,
  Target,
  Activity,
  Download,
  Upload,
  Filter,
  UserPlus,
  Eye,
  X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface Player {
  id: number
  name: string
  avatar: string
  position: string
  number: number
  age: number
  nationality: string
  joinDate: string
  contractEnd: string
  status: "active" | "injured" | "suspended" | "loaned"
  stats: {
    matches: number
    goals: number
    assists: number
    yellowCards: number
    redCards: number
    rating: number
  }
  email: string
  phone: string
}

interface StaffMember {
  id: number
  name: string
  avatar: string
  role: string
  joinDate: string
  email: string
  phone: string
}

const initialPlayers: Player[] = [
  {
    id: 1,
    name: "Pierre Gastaldi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    position: "Gardien",
    number: 1,
    age: 28,
    nationality: "France",
    joinDate: "2022-07-01",
    contractEnd: "2026-06-30",
    status: "active",
    stats: { matches: 24, goals: 0, assists: 0, yellowCards: 2, redCards: 0, rating: 7.2 },
    email: "p.gastaldi@fclumiere.fr",
    phone: "+33 6 12 34 56 78",
  },
  {
    id: 2,
    name: "Jean Barresi",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    position: "Défenseur central",
    number: 4,
    age: 26,
    nationality: "France",
    joinDate: "2021-07-01",
    contractEnd: "2025-06-30",
    status: "active",
    stats: { matches: 26, goals: 3, assists: 1, yellowCards: 5, redCards: 1, rating: 7.0 },
    email: "j.barresi@fclumiere.fr",
    phone: "+33 6 23 45 67 89",
  },
  {
    id: 3,
    name: "Marc Verratti",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    position: "Milieu central",
    number: 8,
    age: 24,
    nationality: "Italie",
    joinDate: "2023-01-15",
    contractEnd: "2027-06-30",
    status: "active",
    stats: { matches: 25, goals: 5, assists: 12, yellowCards: 3, redCards: 0, rating: 7.8 },
    email: "m.verratti@fclumiere.fr",
    phone: "+33 6 34 56 78 90",
  },
  {
    id: 4,
    name: "Lucas Sanchez",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
    position: "Attaquant",
    number: 10,
    age: 22,
    nationality: "Espagne",
    joinDate: "2024-07-01",
    contractEnd: "2028-06-30",
    status: "active",
    stats: { matches: 26, goals: 18, assists: 6, yellowCards: 2, redCards: 0, rating: 8.1 },
    email: "l.sanchez@fclumiere.fr",
    phone: "+33 6 45 67 89 01",
  },
  {
    id: 5,
    name: "Thomas Mendy",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    position: "Ailier droit",
    number: 7,
    age: 23,
    nationality: "France",
    joinDate: "2023-07-01",
    contractEnd: "2026-06-30",
    status: "injured",
    stats: { matches: 20, goals: 8, assists: 10, yellowCards: 1, redCards: 0, rating: 7.5 },
    email: "t.mendy@fclumiere.fr",
    phone: "+33 6 56 78 90 12",
  },
  {
    id: 6,
    name: "Antoine Dubois",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
    position: "Latéral gauche",
    number: 3,
    age: 25,
    nationality: "France",
    joinDate: "2022-01-01",
    contractEnd: "2025-06-30",
    status: "active",
    stats: { matches: 24, goals: 1, assists: 7, yellowCards: 4, redCards: 0, rating: 7.1 },
    email: "a.dubois@fclumiere.fr",
    phone: "+33 6 67 89 01 23",
  },
]

const initialStaff: StaffMember[] = [
  {
    id: 1,
    name: "Roberto Martinez",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    role: "Entraîneur principal",
    joinDate: "2021-07-01",
    email: "r.martinez@fclumiere.fr",
    phone: "+33 6 78 90 12 34",
  },
  {
    id: 2,
    name: "Paul Clement",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    role: "Entraîneur adjoint",
    joinDate: "2022-07-01",
    email: "p.clement@fclumiere.fr",
    phone: "+33 6 89 01 23 45",
  },
  {
    id: 3,
    name: "Marie Dupont",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    role: "Préparatrice physique",
    joinDate: "2023-01-01",
    email: "m.dupont@fclumiere.fr",
    phone: "+33 6 90 12 34 56",
  },
  {
    id: 4,
    name: "Dr. François Blanc",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    role: "Médecin du club",
    joinDate: "2020-07-01",
    email: "f.blanc@fclumiere.fr",
    phone: "+33 6 01 23 45 67",
  },
]

const positions = [
  "Gardien",
  "Défenseur central",
  "Latéral droit",
  "Latéral gauche",
  "Milieu défensif",
  "Milieu central",
  "Milieu offensif",
  "Ailier droit",
  "Ailier gauche",
  "Attaquant",
]

const staffRoles = [
  "Entraîneur principal",
  "Entraîneur adjoint",
  "Entraîneur des gardiens",
  "Préparateur physique",
  "Analyste vidéo",
  "Médecin",
  "Kinésithérapeute",
  "Directeur sportif",
]

interface ClubPlayersManagerProps {
  clubId: number
}

export function ClubPlayersManager({ clubId }: ClubPlayersManagerProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [searchQuery, setSearchQuery] = useState("")
  const [positionFilter, setPositionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("players")
  
  // Dialog states
  const [showAddPlayerDialog, setShowAddPlayerDialog] = useState(false)
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false)
  const [showPlayerDetailsDialog, setShowPlayerDetailsDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  
  // New player form
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    position: "",
    number: "",
    age: "",
    nationality: "",
    contractEnd: "",
    email: "",
    phone: "",
  })
  
  // New staff form
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
  })

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPosition = positionFilter === "all" || player.position === positionFilter
    const matchesStatus = statusFilter === "all" || player.status === statusFilter
    return matchesSearch && matchesPosition && matchesStatus
  })

  const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddPlayer = () => {
    if (!newPlayer.name || !newPlayer.position || !newPlayer.number) return

    const player: Player = {
      id: Date.now(),
      name: newPlayer.name,
      avatar: "",
      position: newPlayer.position,
      number: parseInt(newPlayer.number),
      age: parseInt(newPlayer.age) || 0,
      nationality: newPlayer.nationality || "France",
      joinDate: new Date().toISOString().split("T")[0],
      contractEnd: newPlayer.contractEnd || "",
      status: "active",
      stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, rating: 0 },
      email: newPlayer.email,
      phone: newPlayer.phone,
    }

    setPlayers([...players, player])
    setShowAddPlayerDialog(false)
    setNewPlayer({ name: "", position: "", number: "", age: "", nationality: "", contractEnd: "", email: "", phone: "" })
  }

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.role) return

    const member: StaffMember = {
      id: Date.now(),
      name: newStaff.name,
      avatar: "",
      role: newStaff.role,
      joinDate: new Date().toISOString().split("T")[0],
      email: newStaff.email,
      phone: newStaff.phone,
    }

    setStaff([...staff, member])
    setShowAddStaffDialog(false)
    setNewStaff({ name: "", role: "", email: "", phone: "" })
  }

  const handleDeletePlayer = () => {
    if (!selectedPlayer) return
    setPlayers(players.filter((p) => p.id !== selectedPlayer.id))
    setShowDeleteDialog(false)
    setSelectedPlayer(null)
  }

  const handleUpdatePlayerStatus = (playerId: number, status: Player["status"]) => {
    setPlayers(players.map((p) => (p.id === playerId ? { ...p, status } : p)))
  }

  const getStatusColor = (status: Player["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600"
      case "injured":
        return "bg-red-500/10 text-red-600"
      case "suspended":
        return "bg-yellow-500/10 text-yellow-600"
      case "loaned":
        return "bg-blue-500/10 text-blue-600"
      default:
        return ""
    }
  }

  const getStatusLabel = (status: Player["status"]) => {
    switch (status) {
      case "active":
        return "Actif"
      case "injured":
        return "Blessé"
      case "suspended":
        return "Suspendu"
      case "loaned":
        return "Prêté"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Gestion de l'effectif</h2>
          <p className="text-muted-foreground">Gérez vos joueurs et votre staff technique</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="players">Joueurs ({players.length})</TabsTrigger>
          <TabsTrigger value="staff">Staff ({staff.length})</TabsTrigger>
        </TabsList>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === "players" ? "Rechercher un joueur..." : "Rechercher un membre du staff..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {activeTab === "players" && (
            <>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes positions</SelectItem>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="injured">Blessé</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                  <SelectItem value="loaned">Prêté</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          <Button onClick={() => activeTab === "players" ? setShowAddPlayerDialog(true) : setShowAddStaffDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>

        {/* Players Tab */}
        <TabsContent value="players" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredPlayers.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Aucun joueur trouvé.
                  </div>
                ) : (
                  filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={player.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{player.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                            {player.number}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{player.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{player.position}</span>
                            <span>•</span>
                            <span>{player.age} ans</span>
                            <span>•</span>
                            <span>{player.nationality}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-medium text-foreground">{player.stats.matches}</p>
                            <p className="text-xs text-muted-foreground">Matchs</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-foreground">{player.stats.goals}</p>
                            <p className="text-xs text-muted-foreground">Buts</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-foreground">{player.stats.assists}</p>
                            <p className="text-xs text-muted-foreground">Assists</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-primary">{player.stats.rating.toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">Note</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className={getStatusColor(player.status)}>
                          {getStatusLabel(player.status)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedPlayer(player); setShowPlayerDetailsDialog(true); }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdatePlayerStatus(player.id, "active")}>
                              Marquer actif
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdatePlayerStatus(player.id, "injured")}>
                              Marquer blessé
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdatePlayerStatus(player.id, "suspended")}>
                              Marquer suspendu
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => { setSelectedPlayer(player); setShowDeleteDialog(true); }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredStaff.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Aucun membre du staff trouvé.
                  </div>
                ) : (
                  filteredStaff.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{member.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {member.email}
                          </span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Envoyer un email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Player Dialog */}
      <Dialog open={showAddPlayerDialog} onOpenChange={setShowAddPlayerDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un joueur</DialogTitle>
            <DialogDescription>Enregistrez un nouveau joueur dans votre effectif</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="playerName">Nom complet *</Label>
                <Input
                  id="playerName"
                  placeholder="Ex: Jean Dupont"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Select
                  value={newPlayer.position}
                  onValueChange={(value) => setNewPlayer({ ...newPlayer, position: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Numéro *</Label>
                <Input
                  id="number"
                  type="number"
                  placeholder="Ex: 10"
                  value={newPlayer.number}
                  onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ex: 25"
                  value={newPlayer.age}
                  onChange={(e) => setNewPlayer({ ...newPlayer, age: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationalité</Label>
                <Input
                  id="nationality"
                  placeholder="Ex: France"
                  value={newPlayer.nationality}
                  onChange={(e) => setNewPlayer({ ...newPlayer, nationality: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractEnd">Fin de contrat</Label>
                <Input
                  id="contractEnd"
                  type="date"
                  value={newPlayer.contractEnd}
                  onChange={(e) => setNewPlayer({ ...newPlayer, contractEnd: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="playerEmail">Email</Label>
                <Input
                  id="playerEmail"
                  type="email"
                  placeholder="email@example.com"
                  value={newPlayer.email}
                  onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="playerPhone">Téléphone</Label>
                <Input
                  id="playerPhone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={newPlayer.phone}
                  onChange={(e) => setNewPlayer({ ...newPlayer, phone: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPlayerDialog(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button onClick={handleAddPlayer} disabled={!newPlayer.name || !newPlayer.position || !newPlayer.number}>
              Ajouter le joueur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Staff Dialog */}
      <Dialog open={showAddStaffDialog} onOpenChange={setShowAddStaffDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un membre du staff</DialogTitle>
            <DialogDescription>Enregistrez un nouveau membre du staff technique</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="staffName">Nom complet *</Label>
              <Input
                id="staffName"
                placeholder="Ex: Paul Martin"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staffRole">Rôle *</Label>
              <Select
                value={newStaff.role}
                onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {staffRoles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="staffEmail">Email</Label>
              <Input
                id="staffEmail"
                type="email"
                placeholder="email@example.com"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staffPhone">Téléphone</Label>
              <Input
                id="staffPhone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStaffDialog(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button onClick={handleAddStaff} disabled={!newStaff.name || !newStaff.role}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Player Details Dialog */}
      <Dialog open={showPlayerDetailsDialog} onOpenChange={setShowPlayerDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails du joueur</DialogTitle>
          </DialogHeader>
          {selectedPlayer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedPlayer.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xl">{selectedPlayer.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedPlayer.name}</h3>
                  <p className="text-muted-foreground">{selectedPlayer.position} • #{selectedPlayer.number}</p>
                  <Badge variant="secondary" className={getStatusColor(selectedPlayer.status)}>
                    {getStatusLabel(selectedPlayer.status)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Âge</p>
                  <p className="font-medium text-foreground">{selectedPlayer.age} ans</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nationalité</p>
                  <p className="font-medium text-foreground">{selectedPlayer.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Arrivée au club</p>
                  <p className="font-medium text-foreground">{new Date(selectedPlayer.joinDate).toLocaleDateString("fr-FR")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fin de contrat</p>
                  <p className="font-medium text-foreground">{new Date(selectedPlayer.contractEnd).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-3">Statistiques de la saison</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-secondary/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-foreground">{selectedPlayer.stats.matches}</p>
                    <p className="text-xs text-muted-foreground">Matchs</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-foreground">{selectedPlayer.stats.goals}</p>
                    <p className="text-xs text-muted-foreground">Buts</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-foreground">{selectedPlayer.stats.assists}</p>
                    <p className="text-xs text-muted-foreground">Passes D.</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-600">{selectedPlayer.stats.yellowCards}</p>
                    <p className="text-xs text-muted-foreground">Cartons J.</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-600">{selectedPlayer.stats.redCards}</p>
                    <p className="text-xs text-muted-foreground">Cartons R.</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{selectedPlayer.stats.rating.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Note moy.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Contact</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {selectedPlayer.email}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {selectedPlayer.phone}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce joueur ?</DialogTitle>
            <DialogDescription>
              {selectedPlayer && (
                <>Êtes-vous sûr de vouloir supprimer {selectedPlayer.name} de votre effectif ? Cette action est irréversible.</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeletePlayer}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
