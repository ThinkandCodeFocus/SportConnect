"use client";

import { useState, useEffect } from "react";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import api from "@/lib/api/endpoints";
import { Job } from "@/lib/types/api";
import { Header } from "@/components/layout/header";
import { JobCard } from "@/components/jobs/job-card";
import { Loader2, AlertCircle, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function JobsPage() {
  const { isCheckingAuth, canAccess } = useProtectedRoute();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSport, setSelectedSport] = useState<string>("all");

  useEffect(() => {
    if (!canAccess) return;
    loadJobs();
  }, [canAccess]);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchQuery, selectedType, selectedSport]);

  const loadJobs = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await api.job.getAll();
      setJobs(response.data);
    } catch (err: any) {
      console.error("Failed to load jobs:", err);
      setError(err.message || "Échec du chargement des offres");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.club?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    // Sport filter (using club's sport)
    if (selectedSport !== "all") {
      filtered = filtered.filter(job => job.club?.sport === selectedSport);
    }

    setFilteredJobs(filtered);
  };

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PLAYER_RECRUITMENT: "Recrutement Joueur",
      STAFF_RECRUITMENT: "Recrutement Staff",
      TENDER: "Appel d'offres",
      PARTNERSHIP: "Partenariat",
    };
    return labels[type] || type;
  };

  if (isCheckingAuth || !canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Offres de recrutement & Appels d'offres</h1>
          <p className="text-muted-foreground">
            Découvrez les opportunités qui correspondent à votre profil sportif
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher une offre, un club, un poste..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Type d'offre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="PLAYER_RECRUITMENT">Recrutement Joueur</SelectItem>
                    <SelectItem value="STAFF_RECRUITMENT">Recrutement Staff</SelectItem>
                    <SelectItem value="TENDER">Appel d'offres</SelectItem>
                    <SelectItem value="PARTNERSHIP">Partenariat</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les sports</SelectItem>
                    <SelectItem value="FOOTBALL">Football</SelectItem>
                    <SelectItem value="BASKETBALL">Basketball</SelectItem>
                    <SelectItem value="VOLLEYBALL">Volleyball</SelectItem>
                    <SelectItem value="HANDBALL">Handball</SelectItem>
                    <SelectItem value="ATHLETICS">Athlétisme</SelectItem>
                    <SelectItem value="TENNIS">Tennis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Jobs List */}
        {!isLoading && filteredJobs.length === 0 && (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery || selectedType !== "all" || selectedSport !== "all"
                ? "Aucune offre ne correspond à vos critères"
                : "Aucune offre disponible"}
            </p>
          </div>
        )}

        {!isLoading && filteredJobs.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {filteredJobs.length} {filteredJobs.length === 1 ? "offre trouvée" : "offres trouvées"}
            </p>
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
