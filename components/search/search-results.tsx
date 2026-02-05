"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
  Building2,
  Briefcase,
  MapPin,
  Filter,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const peopleResults = [
  {
    id: 1,
    name: "Antoine Griezmann",
    role: "Joueur Professionnel",
    company: "Atlético Madrid",
    location: "Madrid, Espagne",
    avatar: "/placeholder.svg?height=80&width=80",
    sport: "Football",
    connections: "3ème",
    mutualConnections: 45,
  },
  {
    id: 2,
    name: "Didier Deschamps",
    role: "Entraîneur National",
    company: "Équipe de France",
    location: "Paris, France",
    avatar: "/placeholder.svg?height=80&width=80",
    sport: "Football",
    connections: "2ème",
    mutualConnections: 128,
  },
  {
    id: 3,
    name: "Tony Parker",
    role: "Président / Ancien Joueur NBA",
    company: "ASVEL Lyon-Villeurbanne",
    location: "Lyon, France",
    avatar: "/placeholder.svg?height=80&width=80",
    sport: "Basketball",
    connections: "2ème",
    mutualConnections: 89,
  },
  {
    id: 4,
    name: "Zinedine Zidane",
    role: "Entraîneur",
    company: "Libre",
    location: "Madrid, Espagne",
    avatar: "/placeholder.svg?height=80&width=80",
    sport: "Football",
    connections: "3ème",
    mutualConnections: 67,
  },
  {
    id: 5,
    name: "Nathalie Simon",
    role: "Agent FIFA",
    company: "Elite Sports Agency",
    location: "Paris, France",
    avatar: "/placeholder.svg?height=80&width=80",
    sport: "Football",
    connections: "1er",
    mutualConnections: 156,
  },
];

const clubResults = [
  {
    id: 1,
    name: "Paris Saint-Germain",
    type: "Club Professionnel",
    location: "Paris, France",
    logo: "/placeholder.svg?height=80&width=80",
    sport: "Football",
    followers: "12.5M",
    employees: 450,
  },
  {
    id: 2,
    name: "Olympique de Marseille",
    type: "Club Professionnel",
    location: "Marseille, France",
    logo: "/placeholder.svg?height=80&width=80",
    sport: "Football",
    followers: "4.2M",
    employees: 320,
  },
  {
    id: 3,
    name: "ASVEL Lyon-Villeurbanne",
    type: "Club Professionnel",
    location: "Lyon, France",
    logo: "/placeholder.svg?height=80&width=80",
    sport: "Basketball",
    followers: "280K",
    employees: 85,
  },
  {
    id: 4,
    name: "Stade Français Paris",
    type: "Club Professionnel",
    location: "Paris, France",
    logo: "/placeholder.svg?height=80&width=80",
    sport: "Rugby",
    followers: "520K",
    employees: 120,
  },
];

const jobResults = [
  {
    id: 1,
    title: "Entraîneur Adjoint - Équipe Première",
    company: "FC Nantes",
    location: "Nantes, France",
    logo: "/placeholder.svg?height=60&width=60",
    type: "CDI",
    posted: "Il y a 2 jours",
    applicants: 45,
  },
  {
    id: 2,
    title: "Analyste Vidéo Performance",
    company: "Olympique Lyonnais",
    location: "Lyon, France",
    logo: "/placeholder.svg?height=60&width=60",
    type: "CDI",
    posted: "Il y a 1 semaine",
    applicants: 78,
  },
  {
    id: 3,
    title: "Scout International - Amérique du Sud",
    company: "AS Monaco",
    location: "Monaco (Remote)",
    logo: "/placeholder.svg?height=60&width=60",
    type: "CDI",
    posted: "Il y a 3 jours",
    applicants: 34,
  },
];

export function SearchResults() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Filters Sidebar */}
      <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">Filtres</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary lg:hidden" onClick={() => setShowFilters(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sport Filter */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Sport</h4>
              <div className="space-y-2">
                {["Football", "Basketball", "Handball", "Rugby", "Athlétisme", "Tennis"].map((sport) => (
                  <div key={sport} className="flex items-center space-x-2">
                    <Checkbox id={`sport-${sport}`} />
                    <label htmlFor={`sport-${sport}`} className="text-sm">
                      {sport}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Localisation</h4>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une région" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="france">France</SelectItem>
                  <SelectItem value="idf">Île-de-France</SelectItem>
                  <SelectItem value="paca">PACA</SelectItem>
                  <SelectItem value="aura">Auvergne-Rhône-Alpes</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="world">Monde</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role Filter */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Rôle / Fonction</h4>
              <div className="space-y-2">
                {["Joueur", "Entraîneur", "Agent", "Staff médical", "Management", "Scout", "Analyste"].map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox id={`role-${role}`} />
                    <label htmlFor={`role-${role}`} className="text-sm">
                      {role}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Connection Level */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Niveau de connexion</h4>
              <div className="space-y-2">
                {["1er niveau", "2ème niveau", "3ème niveau+"].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox id={`level-${level}`} />
                    <label htmlFor={`level-${level}`} className="text-sm">
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full">Appliquer les filtres</Button>
            <Button variant="outline" className="w-full bg-transparent">Réinitialiser</Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Results */}
      <div className="space-y-6 lg:col-span-3">
        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des personnes, clubs, offres..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button className="lg:hidden bg-transparent" variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtres
              </Button>
              <Button>Rechercher</Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Tabs */}
        <Tabs defaultValue="people" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">
              Tous
              <Badge variant="secondary" className="ml-2">
                {peopleResults.length + clubResults.length + jobResults.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="people">
              <Users className="mr-2 h-4 w-4" />
              Personnes
              <Badge variant="secondary" className="ml-2">
                {peopleResults.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="clubs">
              <Building2 className="mr-2 h-4 w-4" />
              Clubs
              <Badge variant="secondary" className="ml-2">
                {clubResults.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="mr-2 h-4 w-4" />
              Offres
              <Badge variant="secondary" className="ml-2">
                {jobResults.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-6">
            {/* People Preview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg">Personnes</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary">
                  Voir tout ({peopleResults.length})
                </Button>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {peopleResults.slice(0, 3).map((person) => (
                    <PersonResult key={person.id} person={person} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clubs Preview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg">Clubs & Organisations</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary">
                  Voir tout ({clubResults.length})
                </Button>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {clubResults.slice(0, 2).map((club) => (
                    <ClubResult key={club.id} club={club} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Jobs Preview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg">Offres d&apos;emploi</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary">
                  Voir tout ({jobResults.length})
                </Button>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {jobResults.slice(0, 2).map((job) => (
                    <JobResult key={job.id} job={job} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="people" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {peopleResults.length} résultats
                  </CardTitle>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Pertinence</SelectItem>
                      <SelectItem value="connections">Connexions</SelectItem>
                      <SelectItem value="recent">Récemment actif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {peopleResults.map((person) => (
                    <PersonResult key={person.id} person={person} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clubs" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {clubResults.length} résultats
                  </CardTitle>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Pertinence</SelectItem>
                      <SelectItem value="followers">Abonnés</SelectItem>
                      <SelectItem value="size">Taille</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {clubResults.map((club) => (
                    <ClubResult key={club.id} club={club} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {jobResults.length} résultats
                  </CardTitle>
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Plus récent</SelectItem>
                      <SelectItem value="relevance">Pertinence</SelectItem>
                      <SelectItem value="applicants">Candidatures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {jobResults.map((job) => (
                    <JobResult key={job.id} job={job} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PersonResult({ person }: { person: typeof peopleResults[0] }) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
          <AvatarFallback>
            {person.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold hover:text-primary hover:underline">
              {person.name}
            </h4>
            <Badge variant="outline" className="text-xs">
              {person.connections}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {person.role} chez {person.company}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{person.location}</span>
            <span>-</span>
            <Badge variant="secondary" className="text-xs">
              {person.sport}
            </Badge>
            <span>-</span>
            <span>{person.mutualConnections} relations en commun</span>
          </div>
        </div>
      </div>
      <Button variant="outline" size="sm">
        <UserPlus className="mr-2 h-4 w-4" />
        Se connecter
      </Button>
    </div>
  );
}

function ClubResult({ club }: { club: typeof clubResults[0] }) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 rounded-lg">
          <AvatarImage src={club.logo || "/placeholder.svg"} alt={club.name} />
          <AvatarFallback className="rounded-lg">{club.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold hover:text-primary hover:underline">
            {club.name}
          </h4>
          <p className="text-sm text-muted-foreground">{club.type}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{club.location}</span>
            <span>-</span>
            <Badge variant="secondary" className="text-xs">
              {club.sport}
            </Badge>
            <span>-</span>
            <span>{club.followers} abonnés</span>
            <span>-</span>
            <span>{club.employees} employés</span>
          </div>
        </div>
      </div>
      <Button variant="outline" size="sm">
        Suivre
      </Button>
    </div>
  );
}

function JobResult({ job }: { job: typeof jobResults[0] }) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 rounded-lg">
          <AvatarImage src={job.logo || "/placeholder.svg"} alt={job.company} />
          <AvatarFallback className="rounded-lg">{job.company[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-primary hover:underline">
            {job.title}
          </h4>
          <p className="text-sm text-muted-foreground">{job.company}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{job.location}</span>
            <span>-</span>
            <Badge variant="secondary" className="text-xs">
              {job.type}
            </Badge>
            <span>-</span>
            <span>{job.posted}</span>
            <span>-</span>
            <span>{job.applicants} candidatures</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Sauvegarder
        </Button>
        <Button size="sm">Postuler</Button>
      </div>
    </div>
  );
}
