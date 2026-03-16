"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import {
  Bell,
  Heart,
  MessageSquare,
  UserPlus,
  Briefcase,
  Trophy,
  Building2,
  Check,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const notifications = [
  {
    id: 1,
    type: "like",
    icon: Heart,
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
    user: {
      name: "Pierre Dupont",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    content: "a aimé votre publication",
    time: "Il y a 5 min",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    icon: MessageSquare,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    user: {
      name: "Marie Dubois",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    },
    content: 'a commenté : "Excellent match, bravo pour la performance !"',
    time: "Il y a 15 min",
    read: false,
  },
  {
    id: 3,
    type: "connection",
    icon: UserPlus,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    user: {
      name: "Lucas Hernandez",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    content: "a accepté votre invitation",
    time: "Il y a 1h",
    read: false,
  },
  {
    id: 4,
    type: "job",
    icon: Briefcase,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    user: {
      name: "Paris Saint-Germain",
      avatar:
        "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&h=100&fit=crop&crop=face",
    },
    content:
      "recherche un Milieu de terrain - Cette offre correspond à votre profil",
    time: "Il y a 2h",
    read: true,
  },
  {
    id: 5,
    type: "achievement",
    icon: Trophy,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-50",
    user: null,
    content:
      "Félicitations ! Vous avez atteint 500 relations sur SportConnect",
    time: "Il y a 3h",
    read: true,
  },
  {
    id: 6,
    type: "club",
    icon: Building2,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    user: {
      name: "Olympique de Marseille",
      avatar:
        "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&h=100&fit=crop&crop=face",
    },
    content: "a publié une nouvelle offre d'emploi",
    time: "Il y a 5h",
    read: true,
  },
  {
    id: 7,
    type: "like",
    icon: Heart,
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
    user: {
      name: "Sophie Martin et 12 autres",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    content: "ont aimé votre publication",
    time: "Hier",
    read: true,
  },
  {
    id: 8,
    type: "connection",
    icon: UserPlus,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    user: {
      name: "Antoine Rousseau",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    content: "souhaite se connecter avec vous",
    time: "Hier",
    read: true,
    actionRequired: true,
  },
];

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setItems(items.map((item) => ({ ...item, read: true })));
  };

  const markAsRead = (id: number) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground">
                    {unreadCount} nouvelles
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Tout marquer comme lu
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {items.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 hover:bg-secondary/50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="relative">
                    {notification.user ? (
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={notification.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {notification.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div
                        className={`h-12 w-12 rounded-full ${notification.iconBg} flex items-center justify-center`}
                      >
                        <notification.icon
                          className={`h-6 w-6 ${notification.iconColor}`}
                        />
                      </div>
                    )}
                    {notification.user && (
                      <div
                        className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${notification.iconBg} flex items-center justify-center`}
                      >
                        <notification.icon
                          className={`h-3 w-3 ${notification.iconColor}`}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      {notification.user && (
                        <Link
                          href={`/profile/${notification.id}`}
                          className="font-semibold hover:text-primary hover:underline"
                        >
                          {notification.user.name}
                        </Link>
                      )}{" "}
                      <span className="text-muted-foreground">
                        {notification.content}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.time}
                    </p>
                    {notification.actionRequired && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="h-7 px-3">
                          Accepter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-3 bg-transparent"
                        >
                          Ignorer
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          Marquer comme {notification.read ? "non lu" : "lu"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Désactiver ce type de notification
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
