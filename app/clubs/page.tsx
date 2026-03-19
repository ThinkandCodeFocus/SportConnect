"use client";

import { useState, useEffect } from "react";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import api from "@/lib/api/endpoints";
import { Club } from "@/lib/types/api";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { ClubsFilters } from "@/components/clubs/clubs-filters";
import { ClubCard } from "@/components/clubs/club-card";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ClubsPage() {
  const { isCheckingAuth, canAccess } = useProtectedRoute();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSport, setSelectedSport] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");

  useEffect(() => {
    if (!canAccess) return;
    loadClubs();
  }, [canAccess]);

  useEffect(() => {
    applyFilters();
  }, [clubs, searchQuery, selectedType, selectedSport, selectedCountry]);

  const loadClubs = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await api.club.getAll();
      setClubs(response.data);
    } catch (err: any) {
      console.error("Failed to load clubs:", err);
      setError(err.message || "Échec du chargement des clubs");
      setClubs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...clubs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(club =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(club => club.type === selectedType);
    }

    // Sport filter
    if (selectedSport !== "all") {
      filtered = filtered.filter(club => club.sport === selectedSport);
    }

    // Country filter
    if (selectedCountry !== "all") {
      filtered = filtered.filter(club => club.country === selectedCountry);
    }

    setFilteredClubs(filtered);
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Clubs & Organisations</h1>
          <p className="text-muted-foreground">
            Découvrez et rejoignez les clubs, académies et fédérations sportives
          </p>
        </div>

        {/* Filters */}
        <ClubsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedSport={selectedSport}
          onSportChange={setSelectedSport}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          clubs={clubs}
        />

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

        {/* Clubs Grid */}
        {!isLoading && filteredClubs.length === 0 && (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery || selectedType !== "all" || selectedSport !== "all" || selectedCountry !== "all"
                ? "Aucun club ne correspond à vos critères"
                : "Aucun club disponible"}
            </p>
          </div>
        )}

        {!isLoading && filteredClubs.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {filteredClubs.length} {filteredClubs.length === 1 ? "résultat" : "résultats"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
