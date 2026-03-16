"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Club } from "@/lib/types/api";

interface ClubsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedSport: string;
  onSportChange: (sport: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  clubs: Club[];
}

export function ClubsFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedSport,
  onSportChange,
  selectedCountry,
  onCountryChange,
  clubs,
}: ClubsFiltersProps) {
  // Extract unique sports and countries from clubs
  const uniqueSports = Array.from(new Set(clubs.map(club => club.sport)));
  const uniqueCountries = Array.from(new Set(clubs.map(club => club.country).filter(Boolean)));

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

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un club, une académie, une fédération..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={selectedSport} onValueChange={onSportChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les sports</SelectItem>
                {uniqueSports.map(sport => (
                  <SelectItem key={sport} value={sport}>
                    {getSportLabel(sport)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCountry} onValueChange={onCountryChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les pays</SelectItem>
                {uniqueCountries.map(country => (
                  <SelectItem key={country} value={country!}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs value={selectedType} onValueChange={onTypeChange} className="mt-4">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="PROFESSIONAL_CLUB">Clubs Pro</TabsTrigger>
            <TabsTrigger value="AMATEUR_CLUB">Clubs Amateur</TabsTrigger>
            <TabsTrigger value="ACADEMY">Académies</TabsTrigger>
            <TabsTrigger value="FEDERATION">Fédérations</TabsTrigger>
            <TabsTrigger value="NATIONAL_TEAM">Équipes Nationales</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
}
