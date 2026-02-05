"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ClubsFilters() {
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
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les sports</SelectItem>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="handball">Handball</SelectItem>
                <SelectItem value="rugby">Rugby</SelectItem>
                <SelectItem value="athletics">Athlétisme</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les pays</SelectItem>
                <SelectItem value="france">France</SelectItem>
                <SelectItem value="spain">Espagne</SelectItem>
                <SelectItem value="germany">Allemagne</SelectItem>
                <SelectItem value="italy">Italie</SelectItem>
                <SelectItem value="england">Angleterre</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="pro">Professionnel</SelectItem>
                <SelectItem value="semi-pro">Semi-professionnel</SelectItem>
                <SelectItem value="amateur">Amateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="academies">Académies</TabsTrigger>
            <TabsTrigger value="federations">Fédérations</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  )
}
