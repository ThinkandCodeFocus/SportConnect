"use client";

import Link from "next/link";
import { Users, UserPlus, Building2, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Relations", value: 847, href: "/network/connections" },
  { label: "Contacts", value: 234, href: "/network/contacts" },
  { label: "Abonnés", value: 1205, href: "/network/followers" },
  { label: "Abonnements", value: 156, href: "/network/following" },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Salon du Football Professionnel",
    date: "15 Fév 2026",
    attendees: 234,
  },
  {
    id: 2,
    title: "Conférence Sport Business",
    date: "22 Fév 2026",
    attendees: 89,
  },
  {
    id: 3,
    title: "Networking Agents Sportifs",
    date: "1 Mar 2026",
    attendees: 56,
  },
];

const groups = [
  { name: "Entraîneurs Ligue 1", members: 1234 },
  { name: "Agents FIFA France", members: 456 },
  { name: "Préparateurs Physiques Pro", members: 789 },
];

export function NetworkSidebar() {
  return (
    <div className="space-y-4 sticky top-20">
      {/* Network Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Gérer mon réseau</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="flex items-center justify-between p-2 rounded hover:bg-secondary transition-colors"
            >
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <span className="font-semibold text-foreground">{stat.value}</span>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <UserPlus className="h-4 w-4 mr-2" />
            Inviter des contacts
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Users className="h-4 w-4 mr-2" />
            Trouver des anciens
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Building2 className="h-4 w-4 mr-2" />
            Suivre des clubs
          </Button>
        </CardContent>
      </Card>

      {/* Events */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Événements à venir</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary h-auto p-0">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block p-2 rounded hover:bg-secondary transition-colors"
            >
              <p className="text-sm font-medium text-foreground line-clamp-1">
                {event.title}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {event.date}
                <span className="text-muted-foreground">
                  {event.attendees} participants
                </span>
              </div>
            </Link>
          ))}
          <Button variant="ghost" className="w-full text-primary text-sm h-8">
            Voir tous les événements
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Groups */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Mes groupes</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary h-auto p-0">
              Voir tout
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {groups.map((group) => (
            <Link
              key={group.name}
              href={`/groups/${encodeURIComponent(group.name)}`}
              className="flex items-center justify-between p-2 rounded hover:bg-secondary transition-colors"
            >
              <span className="text-sm text-foreground">{group.name}</span>
              <span className="text-xs text-muted-foreground">
                {group.members.toLocaleString()}
              </span>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="text-xs text-muted-foreground space-y-2 px-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Link href="/about" className="hover:text-primary hover:underline">
            À propos
          </Link>
          <Link href="/accessibility" className="hover:text-primary hover:underline">
            Accessibilité
          </Link>
          <Link href="/help" className="hover:text-primary hover:underline">
            Aide
          </Link>
        </div>
        <p className="text-muted-foreground">GalsenFoot Corporation 2026</p>
      </div>
    </div>
  );
}
