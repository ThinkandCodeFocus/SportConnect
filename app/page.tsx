"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/layout/header"
import { LeftSidebar } from "@/components/feed/left-sidebar"
import { RightSidebar } from "@/components/feed/right-sidebar"
import { Feed } from "@/components/feed/feed"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, Trophy, Target, ArrowRight } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-green-600 to-green-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="bg-green-500/20 text-green-100 mb-4">🎯 Plateforme de football</Badge>
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                  Connectez-vous avec le Monde du Football
                </h1>
                <p className="text-lg text-green-100 mb-8">
                  Trouvez des opportunités, connectez avec des clubs et développez votre carrière sportive au Sénégal et en Afrique.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-green-600 hover:bg-green-50">
                      Créer un compte
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                      Se connecter
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-3xl blur-2xl" />
                <div className="relative bg-white/15 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white/90">
                      <Trophy className="h-6 w-6 text-yellow-300" />
                      <span>Découvrez les meilleures opportunités</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <Users className="h-6 w-6 text-blue-200" />
                      <span>Connectez-vous avec des recruteurs</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <Briefcase className="h-6 w-6 text-green-200" />
                      <span>Avancez dans votre carrière</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-card border-b border-border py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Rejoignez notre communauté
              </h2>
              <p className="text-muted-foreground text-lg">
                SportConnect connecte les talents et les opportunités au Sénégal
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                  <div className="text-muted-foreground">Joueurs inscrits</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
                  <div className="text-muted-foreground">Clubs partenaires</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
                  <div className="text-muted-foreground">Offres d'emploi</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Comment ça fonctionne</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: "Créez votre profil",
                  description: "Mettez en avant vos talents, statistiques et expérience.",
                },
                {
                  icon: Users,
                  title: "Connectez-vous",
                  description: "Réseau avec des clubs, agents et recruteurs.",
                },
                {
                  icon: Trophy,
                  title: "Décrochez des opportunités",
                  description: "Accédez aux meilleures offres et postulez directement.",
                },
              ].map((feature, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-green-600 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Prêt à progresser ?</h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de joueurs et professionnels du football qui utilisent SportConnect pour avancer dans leur carrière.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 font-semibold">
                Commencer maintenant
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm">
            <p>© 2026 SportConnect. Tous les droits réservés.</p>
          </div>
        </footer>
      </div>
    )
  }

  // Authenticated user view
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <LeftSidebar />
          </div>
          
          {/* Main Feed */}
          <Feed />
          
          {/* Right Sidebar - Hidden on mobile and tablet */}
          <div className="hidden xl:block">
            <RightSidebar />
          </div>
        </div>
      </main>
    </div>
  )
}
