import { Header } from "@/components/layout/header"
import { ClubHeader } from "@/components/clubs/club-header"
import { ClubContent } from "@/components/clubs/club-content"
import { ClubSidebar } from "@/components/clubs/club-sidebar"

export default function ClubDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <ClubHeader />
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <ClubContent />
          <ClubSidebar />
        </div>
      </main>
    </div>
  )
}
