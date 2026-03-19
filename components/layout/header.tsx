"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  Building2,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Bookmark,
  FileText,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/network", icon: Users, label: "Réseau" },
  { href: "/jobs", icon: Briefcase, label: "Offres" },
  { href: "/messaging", icon: MessageSquare, label: "Messagerie", notifications: 3 },
  { href: "/notifications", icon: Bell, label: "Notifications", notifications: 12 },
  { href: "/clubs", icon: Building2, label: "Clubs" },
]

export function Header() {
  const { user, profile, isAuthenticated, logout, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U"
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
  }

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "Utilisateur"
    return `${user.firstName} ${user.lastName}`
  }

  // Get user role label
  const getRoleLabel = () => {
    if (!user) return ""
    const roleLabels: Record<string, string> = {
      PLAYER: "Joueur",
      COACH: "Entraîneur",
      AGENT: "Agent",
      SCOUT: "Recruteur",
      CLUB_ADMIN: "Admin Club",
      FAN: "Fan",
    }
    return roleLabels[user.role] || user.role
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo and Search */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-1 max-w-md">
            <Link href="/" className="flex items-center gap-1 sm:gap-2 shrink-0">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm sm:text-lg">SC</span>
              </div>
              <span className="hidden xl:block font-semibold text-foreground text-sm sm:text-base">GalsenFoot</span>
            </Link>
            <div className={`relative flex-1 transition-all ${searchFocused ? "lg:flex-none lg:w-80" : ""}`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-9 bg-secondary border-none h-8 sm:h-9 text-xs sm:text-sm"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          {/* Desktop Navigation - Only for authenticated users */}
          {isAuthenticated && (
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center px-4 py-2 text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.notifications && (
                    <Badge className="absolute -top-2 -right-2 h-4 min-w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
                      {item.notifications > 9 ? "9+" : item.notifications}
                    </Badge>
                  )}
                </div>
                <span className="text-xs mt-0.5">{item.label}</span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
              </Link>
            ))}
          </nav>
          )}

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden lg:flex items-center gap-1 px-2 h-auto py-1.5">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={profile?.profilePicture} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-xs font-medium text-foreground">Moi</span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="p-3 border-b border-border">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={profile?.profilePicture} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{getUserDisplayName()}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {profile?.position || getRoleLabel()}
                        </p>
                        {profile?.currentClub && (
                          <p className="text-xs text-muted-foreground">{profile.currentClub}</p>
                        )}
                      </div>
                    </div>
                    <Link href="/profile">
                      <Button variant="outline" className="w-full mt-3 h-8 text-sm border-primary text-primary hover:bg-primary/5 bg-transparent">
                        Voir le profil
                      </Button>
                    </Link>
                  </div>
                  <div className="p-1">
                    <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Compte</p>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Paramètres et confidentialité
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/saved" className="flex items-center gap-2">
                        <Bookmark className="h-4 w-4" />
                        Éléments enregistrés
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/applications" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Mes candidatures
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-1">
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Se connecter</Link>
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                  <Link href="/register">S'inscrire</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-2 border-t border-border">
            <div className="flex flex-col gap-1">
              {/* Nav Items */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors rounded-lg relative"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.notifications && (
                    <Badge className="h-5 min-w-5 px-1.5 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
                      {item.notifications > 9 ? "9+" : item.notifications}
                    </Badge>
                  )}
                </Link>
              ))}
              
              <div className="border-t border-border my-2" />
              
              {/* User Menu Items */}
              {isAuthenticated && user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Mon profil</span>
                  </Link>
                  <Link
                    href="/saved"
                    className="flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Bookmark className="h-5 w-5" />
                    <span>Enregistrés</span>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4 py-2">
                  <Button asChild className="w-full">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Se connecter
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      S'inscrire
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
