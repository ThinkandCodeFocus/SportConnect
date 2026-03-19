"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";
import api from "@/lib/api/endpoints";
import { Notification } from "@/lib/types/api";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
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
  Loader2,
  AlertCircle,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationsPage() {
  useProtectedRoute(); // Redirect to login if not authenticated
  
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await api.notification.getByUser(user.id);
      setNotifications(response.data);
    } catch (err: any) {
      console.error("Failed to load notifications:", err);
      setError(err.message || "Échec du chargement des notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await api.notification.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (err: any) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    
    try {
      await Promise.all(
        unreadNotifications.map(n => api.notification.markAsRead(n.id))
      );
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err: any) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      await api.notification.delete(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (err: any) {
      console.error("Failed to delete notification:", err);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, any> = {
      LIKE: Heart,
      COMMENT: MessageSquare,
      SHARE: Share2,
      CONNECTION_REQUEST: UserPlus,
      CONNECTION_ACCEPTED: UserPlus,
      JOB_APPLICATION: Briefcase,
      JOB_MATCH: Briefcase,
      CLUB_INVITATION: Building2,
      ACHIEVEMENT: Trophy,
      MESSAGE: MessageSquare,
      SYSTEM: Bell,
    };
    return icons[type] || Bell;
  };

  const getNotificationIconColor = (type: string) => {
    const colors: Record<string, string> = {
      LIKE: "text-red-500",
      COMMENT: "text-blue-500",
      SHARE: "text-green-500",
      CONNECTION_REQUEST: "text-primary",
      CONNECTION_ACCEPTED: "text-primary",
      JOB_APPLICATION: "text-amber-500",
      JOB_MATCH: "text-amber-500",
      CLUB_INVITATION: "text-primary",
      ACHIEVEMENT: "text-yellow-500",
      MESSAGE: "text-blue-500",
      SYSTEM: "text-gray-500",
    };
    return colors[type] || "text-gray-500";
  };

  const getNotificationIconBg = (type: string) => {
    const backgrounds: Record<string, string> = {
      LIKE: "bg-red-50",
      COMMENT: "bg-blue-50",
      SHARE: "bg-green-50",
      CONNECTION_REQUEST: "bg-primary/10",
      CONNECTION_ACCEPTED: "bg-primary/10",
      JOB_APPLICATION: "bg-amber-50",
      JOB_MATCH: "bg-amber-50",
      CLUB_INVITATION: "bg-primary/10",
      ACHIEVEMENT: "bg-yellow-50",
      MESSAGE: "bg-blue-50",
      SYSTEM: "bg-gray-50",
    };
    return backgrounds[type] || "bg-gray-50";
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
                    {unreadCount} {unreadCount === 1 ? 'nouvelle' : 'nouvelles'}
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
            {error && (
              <Alert variant="destructive" className="m-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const iconColor = getNotificationIconColor(notification.type);
                  const iconBg = getNotificationIconBg(notification.type);

                  return (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 hover:bg-secondary/50 transition-colors cursor-pointer ${
                        !notification.isRead ? "bg-primary/5" : ""
                      }`}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                    >
                      <div className="relative">
                        {notification.sender ? (
                          <>
                            <Avatar className="h-12 w-12">
                              <AvatarImage 
                                src={notification.sender.profile?.photoUrl || undefined} 
                                alt={notification.sender.firstName}
                              />
                              <AvatarFallback>
                                {notification.sender.firstName[0]}{notification.sender.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${iconBg} flex items-center justify-center`}
                            >
                              <Icon className={`h-3 w-3 ${iconColor}`} />
                            </div>
                          </>
                        ) : (
                          <div
                            className={`h-12 w-12 rounded-full ${iconBg} flex items-center justify-center`}
                          >
                            <Icon className={`h-6 w-6 ${iconColor}`} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          {notification.sender && (
                            <Link
                              href={`/profile`}
                              className="font-semibold hover:text-primary hover:underline"
                            >
                              {notification.sender.firstName} {notification.sender.lastName}
                            </Link>
                          )}{" "}
                          <span className="text-muted-foreground">
                            {notification.content}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
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
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              Marquer comme {notification.isRead ? "non lu" : "lu"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              Supprimer
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
      </main>
    </div>
  );
}
