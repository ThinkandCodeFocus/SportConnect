import { Header } from "@/components/layout/header"
import { MessagingLayout } from "@/components/messaging/messaging-layout"

export default function MessagingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <MessagingLayout />
      </main>
    </div>
  )
}
