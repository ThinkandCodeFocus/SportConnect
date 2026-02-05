import { Header } from "@/components/layout/header"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { ProfileContent } from "@/components/profile/profile-content"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <ProfileHeader />
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <ProfileContent />
          <ProfileSidebar />
        </div>
      </main>
    </div>
  )
}
