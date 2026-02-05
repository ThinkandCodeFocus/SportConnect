import { Header } from "@/components/layout/header"
import { LeftSidebar } from "@/components/feed/left-sidebar"
import { RightSidebar } from "@/components/feed/right-sidebar"
import { Feed } from "@/components/feed/feed"

export default function HomePage() {
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
