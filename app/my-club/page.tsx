"use client"

import { Header } from "@/components/layout/header"
import { MyClubDashboard } from "@/components/my-club/my-club-dashboard"

export default function MyClubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <MyClubDashboard />
      </main>
    </div>
  )
}
