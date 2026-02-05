"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  UserPlus,
  Users,
  Check,
  X,
  MapPin,
  Building2,
  Filter,
  ChevronDown,
  MessageCircle,
  MoreHorizontal,
  UserMinus,
  Bell,
  BellOff,
  UserCheck,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const pendingInvitations = [
  {
    id: 1,
    name: "Sophie Martin",
    role: "Agent FIFA",
    company: "SportAgency Pro",
    location: "Paris, France",
    avatar: "/placeholder.svg?height=80&width=80",
    mutualConnections: 12,
    sport: "Football",
  },
  {
    id: 2,
    name: "Thomas Dubois",
    role: "Directeur Sportif",
    company: "RC Lens",
    location: "Lens, France",
    avatar: "/placeholder.svg?height=80&width=80",
    mutualConnections: 8,
    sport: "Football",
  },
  {
    id: 3,
    name: "Emma Leroy",
    role: "Entraîneur National",
    company: "Fédération Française de Basketball",
    location: "Paris, France",
    avatar: "/placeholder.svg?height=80&width=80",
    mutualConnections: 5,
    sport: "Basketball",
  },
];

const suggestions = [
  {
    id: 1,
    name: "Lucas Bernard",
    role: "Joueur Professionnel",
    company: "AS Monaco",
    location: "Monaco",
    avatar: "/placeholder.svg?height=80&width=80",
    mutualConnections: 24,
    sport: "Football",
    reason: "Travaille chez AS Monaco",
  },
  {
    id: 2,
    name: "Marie Petit",
    role: "Préparatrice Physique",
    company: "INSEP",
    location: "Paris, France",
    avatar: "/placeholder.svg?height=80&width=80",
    mutualConnections: 15,
    sport: "Athlétisme",
    reason: "12 relations en commun",
  },
  {
    id: 3,
    name: "Antoine Moreau",
    role: "Scout International",
    company: "Olympique Lyonnais",
    location: "Lyon, France",
    avatar: "/placeholder.svg?height=80&width=80",
    mutualConnections: 18,
    sport: "Football",
    reason: "A consulté votre profil",
  },
  {
    id: 4,
    name: "Clara Rousseau",
    role: "Analyste Vidéo",
    company: "Paris Saint-Germain",
    location: "Paris, France",
    avatar: "/placeholder.svg?height=80&width=80",
    mutualConnections: 9,
    sport: "Football",
    reason: "Même école que vous",
  },
  {
    id: 5,
    name: "Hugo Lefebvre",
    role: "Kinésithérapeute du Sport",
    company: "Centre Médical du Sport",
    location: "Marseille, France",
    avatar: "/placeholder.svg?height=80&width=80",
    mutualConnections: 7,
    sport: "Multi-sports",
    reason: "Basé dans votre région",
  },
  {
    id: 6,
    name: "Camille Girard",
    role: "Responsable Communication",
    company: "LOSC Lille",
    location: "Lille, France",
    avatar: "/placeholder.svg?height=80&width=80",
    mutualConnections: 11,
    sport: "Football",
    reason: "5 relations en commun",
  },
];

const myConnections = [
  {
    id: 1,
    name: "Pierre Dupont",
    role: "Entraîneur Principal",
    company: "FC Nantes",
    location: "Nantes, France",
    avatar: "/placeholder.svg?height=80&width=80",
    connectedSince: "Mars 2024",
    sport: "Football",
  },
  {
    id: 2,
    name: "Julie Robert",
    role: "Agent Sportif",
    company: "Elite Sport Management",
    location: "Paris, France",
    avatar: "/placeholder.svg?height=80&width=80",
    connectedSince: "Janvier 2024",
    sport: "Football",
  },
  {
    id: 3,
    name: "Marc Durand",
    role: "Directeur Technique",
    company: "Fédération Française de Handball",
    location: "Paris, France",
    avatar: "/placeholder.svg?height=80&width=80",
    connectedSince: "Décembre 2023",
    sport: "Handball",
  },
  {
    id: 4,
    name: "Isabelle Fontaine",
    role: "Médecin du Sport",
    company: "Centre National du Rugby",
    location: "Marcoussis, France",
    avatar: "/placeholder.svg?height=80&width=80",
    connectedSince: "Novembre 2023",
    sport: "Rugby",
  },
  {
    id: 5,
    name: "François Martin",
    role: "Recruteur",
    company: "Olympique de Marseille",
    location: "Marseille, France",
    avatar: "/placeholder.svg?height=80&width=80",
    connectedSince: "Octobre 2023",
    sport: "Football",
  },
  {
    id: 6,
    name: "Nathalie Blanc",
    role: "Nutritionniste Sportive",
    company: "Performance Nutrition",
    location: "Lyon, France",
    avatar: "/placeholder.svg?height=80&width=80",
    connectedSince: "Septembre 2023",
    sport: "Multi-sports",
  },
];

const sportFilters = [
  "Tous les sports",
  "Football",
  "Basketball",
  "Handball",
  "Rugby",
  "Athlétisme",
  "Tennis",
  "Natation",
];

const roleFilters = [
  "Tous les rôles",
  "Joueur",
  "Entraîneur",
  "Agent",
  "Staff Médical",
  "Management",
  "Scout",
  "Analyste",
];

interface Connection {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  avatar: string;
  connectedSince: string;
  sport: string;
  isNotificationsOn?: boolean;
}

export function NetworkContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [pendingList, setPendingList] = useState(pendingInvitations);
  const [suggestionsList, setSuggestionsList] = useState(suggestions);
  const [connectionsList, setConnectionsList] = useState<Connection[]>(
    myConnections.map(c => ({ ...c, isNotificationsOn: true }))
  );
  const [activeTab, setActiveTab] = useState("suggestions");
  
  // Connection request states
  const [pendingRequests, setPendingRequests] = useState<number[]>([]);
  const [sentRequests, setSentRequests] = useState<number[]>([]);
  
  // Dialog states
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Connection | null>(null);
  const [messageText, setMessageText] = useState("");
  
  // Accepted invitations tracking
  const [acceptedInvitations, setAcceptedInvitations] = useState<typeof pendingInvitations>([]);

  // Stats
  const [stats, setStats] = useState({
    relations: 1248,
    contacts: 342,
    following: 89,
    pages: 56,
    groups: 12,
    events: 8,
    hashtags: 24,
  });

  const handleAcceptInvitation = (id: number) => {
    const invitation = pendingList.find(inv => inv.id === id);
    if (invitation) {
      // Add to connections
      const newConnection: Connection = {
        id: Date.now(),
        name: invitation.name,
        role: invitation.role,
        company: invitation.company,
        location: invitation.location,
        avatar: invitation.avatar,
        connectedSince: "Maintenant",
        sport: invitation.sport,
        isNotificationsOn: true,
      };
      setConnectionsList([newConnection, ...connectionsList]);
      setAcceptedInvitations([...acceptedInvitations, invitation]);
      setStats({ ...stats, relations: stats.relations + 1 });
    }
    setPendingList(pendingList.filter((inv) => inv.id !== id));
  };

  const handleRejectInvitation = (id: number) => {
    setPendingList(pendingList.filter((inv) => inv.id !== id));
  };

  const handleConnect = (id: number) => {
    setPendingRequests([...pendingRequests, id]);
    // Simulate sending request
    setTimeout(() => {
      setPendingRequests(pendingRequests.filter(reqId => reqId !== id));
      setSentRequests([...sentRequests, id]);
    }, 1000);
  };

  const handleCancelRequest = (id: number) => {
    setSentRequests(sentRequests.filter(reqId => reqId !== id));
  };

  const handleDismiss = (id: number) => {
    setSuggestionsList(suggestionsList.filter((s) => s.id !== id));
  };

  const handleRemoveConnection = (id: number) => {
    setConnectionsList(connectionsList.filter(c => c.id !== id));
    setStats({ ...stats, relations: stats.relations - 1 });
    setShowRemoveDialog(false);
    setSelectedPerson(null);
  };

  const handleToggleNotifications = (id: number) => {
    setConnectionsList(connectionsList.map(c => 
      c.id === id ? { ...c, isNotificationsOn: !c.isNotificationsOn } : c
    ));
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedPerson) return;
    // In a real app, this would send the message
    setMessageText("");
    setShowMessageDialog(false);
    setSelectedPerson(null);
  };

  const openMessageDialog = (person: Connection) => {
    setSelectedPerson(person);
    setShowMessageDialog(true);
  };

  const openRemoveDialog = (person: Connection) => {
    setSelectedPerson(person);
    setShowRemoveDialog(true);
  };

  // Filter logic
  const filteredSuggestions = useMemo(() => {
    return suggestionsList.filter(s => {
      const matchesSearch = searchQuery === "" || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSport = selectedSports.length === 0 || 
        selectedSports.includes("Tous les sports") ||
        selectedSports.includes(s.sport);
      return matchesSearch && matchesSport;
    });
  }, [suggestionsList, searchQuery, selectedSports]);

  const filteredConnections = useMemo(() => {
    return connectionsList.filter(c => {
      const matchesSearch = searchQuery === "" || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSport = selectedSports.length === 0 || 
        selectedSports.includes("Tous les sports") ||
        selectedSports.includes(c.sport);
      return matchesSearch && matchesSport;
    });
  }, [connectionsList, searchQuery, selectedSports]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Left Sidebar - Stats */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Gérer mon réseau</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 p-0">
            <button 
              type="button"
              onClick={() => setActiveTab("connections")}
              className="flex w-full items-center justify-between px-6 py-3 text-left hover:bg-muted/50"
            >
              <span className="text-muted-foreground">Relations</span>
              <span className="font-semibold text-primary">{stats.relations.toLocaleString()}</span>
            </button>
            <button 
              type="button"
              className="flex w-full items-center justify-between px-6 py-3 text-left hover:bg-muted/50"
            >
              <span className="text-muted-foreground">Contacts</span>
              <span className="font-semibold text-primary">{stats.contacts}</span>
            </button>
            <button 
              type="button"
              className="flex w-full items-center justify-between px-6 py-3 text-left hover:bg-muted/50"
            >
              <span className="text-muted-foreground">Personnes suivies</span>
              <span className="font-semibold text-primary">{stats.following}</span>
            </button>
            <button 
              type="button"
              className="flex w-full items-center justify-between px-6 py-3 text-left hover:bg-muted/50"
            >
              <span className="text-muted-foreground">Pages suivies</span>
              <span className="font-semibold text-primary">{stats.pages}</span>
            </button>
            <button 
              type="button"
              className="flex w-full items-center justify-between px-6 py-3 text-left hover:bg-muted/50"
            >
              <span className="text-muted-foreground">Groupes</span>
              <span className="font-semibold text-primary">{stats.groups}</span>
            </button>
            <button 
              type="button"
              className="flex w-full items-center justify-between px-6 py-3 text-left hover:bg-muted/50"
            >
              <span className="text-muted-foreground">Événements</span>
              <span className="font-semibold text-primary">{stats.events}</span>
            </button>
            <button 
              type="button"
              className="flex w-full items-center justify-between px-6 py-3 text-left hover:bg-muted/50"
            >
              <span className="text-muted-foreground">Hashtags</span>
              <span className="font-semibold text-primary">{stats.hashtags}</span>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-6 lg:col-span-3">
        {/* Pending Invitations */}
        {pendingList.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">
                Invitations ({pendingList.length})
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                Tout voir
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pendingList.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex flex-col items-center rounded-lg border p-4 text-center"
                  >
                    <Avatar className="mb-3 h-16 w-16">
                      <AvatarImage
                        src={invitation.avatar || "/placeholder.svg"}
                        alt={invitation.name}
                      />
                      <AvatarFallback>
                        {invitation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-semibold">{invitation.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {invitation.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invitation.company}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {invitation.sport}
                    </Badge>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {invitation.mutualConnections} relations en commun
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 rounded-full p-0 bg-transparent"
                        onClick={() => handleRejectInvitation(invitation.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() => handleAcceptInvitation(invitation.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Suggestions and Connections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="suggestions">
                <UserPlus className="mr-2 h-4 w-4" />
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="connections">
                <Users className="mr-2 h-4 w-4" />
                Mes relations
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Sport
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {sportFilters.map((sport) => (
                    <DropdownMenuCheckboxItem
                      key={sport}
                      checked={selectedSports.includes(sport)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSports([...selectedSports, sport]);
                        } else {
                          setSelectedSports(
                            selectedSports.filter((s) => s !== sport)
                          );
                        }
                      }}
                    >
                      {sport}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Rôle
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {roleFilters.map((role) => (
                    <DropdownMenuCheckboxItem
                      key={role}
                      checked={selectedRoles.includes(role)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRoles([...selectedRoles, role]);
                        } else {
                          setSelectedRoles(
                            selectedRoles.filter((r) => r !== role)
                          );
                        }
                      }}
                    >
                      {role}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="suggestions">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Personnes que vous pourriez connaître
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Basé sur votre profil, vos relations et vos activités
                </p>
              </CardHeader>
              <CardContent>
                {filteredSuggestions.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Aucune suggestion ne correspond à votre recherche.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredSuggestions.map((suggestion) => {
                      const isPending = pendingRequests.includes(suggestion.id);
                      const isSent = sentRequests.includes(suggestion.id);
                      
                      return (
                        <div
                          key={suggestion.id}
                          className="relative flex flex-col rounded-lg border p-4"
                        >
                          {!isSent && (
                            <button
                              type="button"
                              className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                              onClick={() => handleDismiss(suggestion.id)}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          <div className="mb-3 flex items-start gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={suggestion.avatar || "/placeholder.svg"}
                                alt={suggestion.name}
                              />
                              <AvatarFallback>
                                {suggestion.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <h4 className="truncate font-semibold">
                                {suggestion.name}
                              </h4>
                              <p className="truncate text-sm text-muted-foreground">
                                {suggestion.role}
                              </p>
                            </div>
                          </div>
                          <div className="mb-3 space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              <span className="truncate">{suggestion.company}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{suggestion.location}</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="mb-2 w-fit text-xs">
                            {suggestion.sport}
                          </Badge>
                          <p className="mb-3 text-xs text-muted-foreground">
                            {suggestion.mutualConnections} relations en commun -{" "}
                            {suggestion.reason}
                          </p>
                          {isSent ? (
                            <div className="mt-auto space-y-2">
                              <div className="flex items-center justify-center gap-2 text-sm text-primary">
                                <UserCheck className="h-4 w-4" />
                                Invitation envoyée
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-muted-foreground"
                                onClick={() => handleCancelRequest(suggestion.id)}
                              >
                                Annuler
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-auto w-full bg-transparent"
                              onClick={() => handleConnect(suggestion.id)}
                              disabled={isPending}
                            >
                              {isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Envoi...
                                </>
                              ) : (
                                <>
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Se connecter
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mt-6 text-center">
                  <Button variant="outline" className="bg-transparent">Voir plus de suggestions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-lg">
                    Mes relations ({filteredConnections.length})
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Triées par activité récente
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {filteredConnections.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Aucune relation ne correspond à votre recherche.
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConnections.map((connection) => (
                      <div
                        key={connection.id}
                        className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={connection.avatar || "/placeholder.svg"}
                              alt={connection.name}
                            />
                            <AvatarFallback>
                              {connection.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link href={`/profile/${connection.id}`} className="font-semibold hover:text-primary hover:underline">
                              {connection.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {connection.role} chez {connection.company}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{connection.location}</span>
                              <span>-</span>
                              <Badge variant="secondary" className="text-xs">
                                {connection.sport}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="hidden sm:inline text-xs text-muted-foreground">
                            Connecté depuis {connection.connectedSince}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-transparent"
                            onClick={() => openMessageDialog(connection)}
                          >
                            <MessageCircle className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Message</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openMessageDialog(connection)}>
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Envoyer un message
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleNotifications(connection.id)}>
                                {connection.isNotificationsOn ? (
                                  <>
                                    <BellOff className="h-4 w-4 mr-2" />
                                    Désactiver les notifications
                                  </>
                                ) : (
                                  <>
                                    <Bell className="h-4 w-4 mr-2" />
                                    Activer les notifications
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => openRemoveDialog(connection)}
                                className="text-destructive focus:text-destructive"
                              >
                                <UserMinus className="h-4 w-4 mr-2" />
                                Supprimer la relation
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6 text-center">
                  <Button variant="outline" className="bg-transparent">
                    Voir toutes mes relations ({stats.relations.toLocaleString()})
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Message Dialog */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Envoyer un message</DialogTitle>
              {selectedPerson && (
                <DialogDescription>
                  Message à {selectedPerson.name}
                </DialogDescription>
              )}
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Écrivez votre message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="min-h-32"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMessageDialog(false)} className="bg-transparent">
                Annuler
              </Button>
              <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                Envoyer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove Connection Dialog */}
        <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer cette relation ?</DialogTitle>
              {selectedPerson && (
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer {selectedPerson.name} de vos relations ? 
                  Cette personne ne sera pas notifiée.
                </DialogDescription>
              )}
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRemoveDialog(false)} className="bg-transparent">
                Annuler
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedPerson && handleRemoveConnection(selectedPerson.id)}
              >
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
