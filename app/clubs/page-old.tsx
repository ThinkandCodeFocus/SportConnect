import { Header } from "@/components/layout/header"
import { ClubsGrid } from "@/components/clubs/clubs-grid"
import { ClubsFilters } from "@/components/clubs/clubs-filters"

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Clubs & Organisations</h1>
          <p className="text-muted-foreground mt-1">
            Découvrez les clubs, académies et fédérations du monde sportif
          </p>
        </div>
        <ClubsFilters />
        <ClubsGrid />
      </main>
    </div>
  )
}
