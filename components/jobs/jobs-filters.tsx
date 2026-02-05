"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const sports = [
  "Football",
  "Basketball",
  "Handball",
  "Rugby",
  "Athlétisme",
  "Tennis",
  "Natation",
  "Volleyball",
]

const positions = [
  "Gardien",
  "Défenseur",
  "Milieu de terrain",
  "Attaquant",
  "Entraîneur",
  "Préparateur physique",
  "Analyste",
  "Scout",
]

const levels = [
  "Amateur",
  "Semi-professionnel",
  "Professionnel",
  "Élite",
]

const countries = [
  "France",
  "Espagne",
  "Italie",
  "Allemagne",
  "Angleterre",
  "Portugal",
  "Belgique",
  "Pays-Bas",
]

export function JobsFilters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>(["Football", "Professionnel"])
  const [ageRange, setAgeRange] = useState([18, 35])

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  return (
    <Card>
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
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les sports</SelectItem>
                {sports.map((sport) => (
                  <SelectItem key={sport} value={sport.toLowerCase()}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level.toLowerCase()}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtres avancés</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtres avancés</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  {/* Sport Filter */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-foreground">Sport</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {sports.map((sport) => (
                        <div key={sport} className="flex items-center space-x-2">
                          <Checkbox id={sport} />
                          <Label htmlFor={sport} className="text-sm">{sport}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Position Filter */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-foreground">Poste</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {positions.map((position) => (
                        <div key={position} className="flex items-center space-x-2">
                          <Checkbox id={position} />
                          <Label htmlFor={position} className="text-sm">{position}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Level Filter */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-foreground">Niveau</h4>
                    <div className="space-y-2">
                      {levels.map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox id={level} />
                          <Label htmlFor={level} className="text-sm">{level}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Age Range */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-foreground">Tranche d&apos;âge</h4>
                    <div className="px-2">
                      <Slider
                        value={ageRange}
                        onValueChange={setAgeRange}
                        min={16}
                        max={45}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{ageRange[0]} ans</span>
                        <span>{ageRange[1]} ans</span>
                      </div>
                    </div>
                  </div>

                  {/* Country Filter */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-foreground">Pays</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {countries.map((country) => (
                        <div key={country} className="flex items-center space-x-2">
                          <Checkbox id={country} />
                          <Label htmlFor={country} className="text-sm">{country}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-foreground">Disponibilité</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="immediate" />
                        <Label htmlFor="immediate" className="text-sm">Immédiate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="end-season" />
                        <Label htmlFor="end-season" className="text-sm">Fin de saison</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="transfer" />
                        <Label htmlFor="transfer" className="text-sm">Mercato d&apos;été</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1 bg-transparent">Réinitialiser</Button>
                    <Button className="flex-1">Appliquer</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">Filtres actifs :</span>
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="gap-1 pr-1">
                {filter}
                <button
                  type="button"
                  onClick={() => removeFilter(filter)}
                  className="ml-1 rounded-full p-0.5 hover:bg-foreground/10"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={() => setActiveFilters([])}
            >
              Tout effacer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
