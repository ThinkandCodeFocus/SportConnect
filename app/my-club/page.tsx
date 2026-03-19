"use client"

import { Header } from "@/components/layout/header"
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute"
import { MyClubDashboard } from "@/components/my-club/my-club-dashboard"

export default function MyClubPage() {
  useProtectedRoute(); // Redirect to login if not authenticated
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <MyClubDashboard />
      </main>
    </div>
  )
}
