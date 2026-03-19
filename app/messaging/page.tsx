"use client";

import { Header } from "@/components/layout/header"
import { MessagingLayout } from "@/components/messaging/messaging-layout"
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute"

export default function MessagingPage() {
  useProtectedRoute(); // Redirect to login if not authenticated
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <MessagingLayout />
      </main>
    </div>
  )
}
