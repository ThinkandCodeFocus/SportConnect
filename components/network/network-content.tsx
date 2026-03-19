"use client";

import { useState, useEffect, useMemo } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { Connection, User } from "@/lib/types/api";
import api from "@/lib/api/endpoints";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

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

export function NetworkContent() {
  const { user: currentUser } = useAuth();
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("suggestions");
  
  // Data states
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // UI states
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<User | null>(null);
  const [messageText, setMessageText] = useState("");
  const [isSubmitting,setIsSubmitting] = useState(false);

  // Load connections and pending requests
  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const [connectionsRes, pendingRes] = await Promise.all([
        api.connection.getByUser(currentUser.id),
        api.connection.getPending(currentUser.id),
      ]);
      
      setConnections(connectionsRes.data);
      setPendingRequests(pendingRes.data);
    } catch (err: any) {
      console.error("Failed to load network data:", err);
      setError(err.message || "Échec du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async (connectionId: string) => {
    try {
      await api.connection.accept(connectionId);
      // Refresh data
      await loadData();
    } catch (err: any) {
      console.error("Failed to accept invitation:", err);
      alert(err.message || "Échec de l'acceptation");
    }
  };

  const handleRejectInvitation = async (connectionId: string) => {
    try {
      await api.connection.reject(connectionId);
      setPendingRequests(pendingRequests.filter(c => c.id !== connectionId));
    } catch (err: any) {
      console.error("Failed to reject invitation:", err);
      alert(err.message || "Échec du rejet");
    }
  };

  const handleSendRequest = async (userId: string) => {
    if (!currentUser) return;
    
    try {
      await api.connection.send({ requesterId: currentUser.id, addresseeId: userId });
      alert("Demande de connexion envoyée");
    } catch (err: any) {
      console.error("Failed to send request:", err);
      alert(err.message || "Échec de l'envoi");
    }
  };

  const handleRemoveConnection = async (connectionId: string) => {
    try {
      await api.connection.cancel(connectionId);
      setConnections(connections.filter(c => c.id !== connectionId));
      setShowRemoveDialog(false);
      setSelectedPerson(null);
    } catch (err: any) {
      console.error("Failed to remove connection:", err);
      alert(err.message || "Échec de la suppression");
    }
  };

  const openMessageDialog = (person: User) => {
    setSelectedPerson(person);
    setShowMessageDialog(true);
  };

  const openRemoveDialog = (person: User) => {
    setSelectedPerson(person);
    setShowRemoveDialog(true);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedPerson || !currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      await api.message.send({
        senderId: currentUser.id,
        receiverId: selectedPerson.id,
        content: messageText.trim(),
      });
      
      setMessageText("");
      setShowMessageDialog(false);
      setSelectedPerson(null);
      alert("Message envoyé !");
    } catch (err: any) {
      console.error("Failed to send message:", err);
      alert(err.message || "Échec de l'envoi du message");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter logic
  const filteredConnections = useMemo(() => {
    return connections.filter(connection => {
      const user = connection.user || connection.requester;
      if (!user) return false;
      
      const matchesSearch = searchQuery === "" || 
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSport = selectedSports.length === 0 || 
        selectedSports.includes("Tous les sports");
      
      return matchesSearch && matchesSport;
    });
  }, [connections, searchQuery, selectedSports]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive text-center">{error}</p>
          <Button onClick={loadData} className="mt-4 mx-auto block">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

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
              <span className="font-semibold text-primary">{connections.length}</span>
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab("pending")}
              className="flex w-full items-center justify-between px-6 py-3 text-left hover:bg-muted/50"
            >
              <span className="text-muted-foreground">Invitations</span>
              <span className="font-semibold text-primary">{pendingRequests.length}</span>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-6 lg:col-span-3">
        {/* Pending Invitations */}
        {pendingRequests.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">
                Invitations ({pendingRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pendingRequests.map((request) => {
                  const requester = request.requester;
                  if (!requester) return null;
                  
                  return (
                    <div
                      key={request.id}
                      className="flex flex-col items-center rounded-lg border p-4 text-center"
                    >
                      <Avatar className="mb-3 h-16 w-16">
                        <AvatarImage src={requester.profile?.photoUrl} />
                        <AvatarFallback>
                          {requester.firstName[0]}{requester.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className="font-semibold">
                        {requester.firstName} {requester.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">{requester.role}</p>
                      <Badge variant="secondary" className="mt-2">{requester.role}</Badge>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 rounded-full p-0 bg-transparent"
                          onClick={() => handleRejectInvitation(request.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 w-8 rounded-full p-0"
                          onClick={() => handleAcceptInvitation(request.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connections List */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="connections">
                <Users className="mr-2 h-4 w-4" />
                Mes relations
              </TabsTrigger>
              <TabsTrigger value="pending">
                <UserPlus className="mr-2 h-4 w-4" />
                Invitations ({pendingRequests.length})
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
                          setSelectedSports(selectedSports.filter((s) => s !== sport));
                        }
                      }}
                    >
                      {sport}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

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
                    Aucune relation pour le moment.
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConnections.map((connection) => {
                      const user = connection.user || connection.requester;
                      if (!user) return null;
                      
                      return (
                        <div
                          key={connection.id}
                          className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.profile?.photoUrl} />
                              <AvatarFallback>
                                {user.firstName[0]}{user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <Link
                                href={`/profile/${user.id}`}
                                className="font-semibold hover:text-primary hover:underline"
                              >
                                {user.firstName} {user.lastName}
                              </Link>
                              <p className="text-sm text-muted-foreground">{user.role}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {connection.createdAt && (
                                  <span>
                                    Connecté {formatDistanceToNow(new Date(connection.createdAt), {
                                      addSuffix: true,
                                      locale: fr,
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                              onClick={() => openMessageDialog(user)}
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
                                <DropdownMenuItem onClick={() => openMessageDialog(user)}>
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Envoyer un message
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleRemoveConnection(connection.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <UserMinus className="h-4 w-4 mr-2" />
                                  Supprimer la relation
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Invitations en attente ({pendingRequests.length})
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Demandes de connexion reçues
                </p>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Aucune invitation en attente.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pendingRequests.map((request) => {
                      const requester = request.requester;
                      if (!requester) return null;
                      
                      return (
                        <div
                          key={request.id}
                          className="flex flex-col items-center rounded-lg border p-4 text-center"
                        >
                          <Avatar className="mb-3 h-16 w-16">
                            <AvatarImage src={requester.profile?.photoUrl} />
                            <AvatarFallback>
                              {requester.firstName[0]}{requester.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <h4 className="font-semibold">
                            {requester.firstName} {requester.lastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">{requester.role}</p>
                          <Badge variant="secondary" className="mt-2">{requester.role}</Badge>
                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent"
                              onClick={() => handleRejectInvitation(request.id)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Refuser
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptInvitation(request.id)}
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Accepter
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                  Message à {selectedPerson.firstName} {selectedPerson.lastName}
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
              <Button
                variant="outline"
                onClick={() => setShowMessageDialog(false)}
                className="bg-transparent"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  "Envoyer"
                )}
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
                  Êtes-vous sûr de vouloir supprimer {selectedPerson.firstName}{" "}
                  {selectedPerson.lastName} de vos relations ? Cette personne ne sera pas
                  notifiée.
                </DialogDescription>
              )}
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRemoveDialog(false)}
                className="bg-transparent"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  selectedPerson && handleRemoveConnection(selectedPerson.id)
                }
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
