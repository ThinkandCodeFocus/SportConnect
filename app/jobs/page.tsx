import { Header } from "@/components/layout/header"
import { JobsFilters } from "@/components/jobs/jobs-filters"
import { JobsList } from "@/components/jobs/jobs-list"
import { JobsSidebar } from "@/components/jobs/jobs-sidebar"

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Offres de recrutement</h1>
          <p className="text-muted-foreground mt-1">
            Découvrez les opportunités qui correspondent à votre profil sportif
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <JobsFilters />
            <JobsList />
          </div>
          <JobsSidebar />
        </div>
      </main>
    </div>
  )
}
