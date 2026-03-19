"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/header";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileContent } from "@/components/profile/profile-content";
import { Loader2 } from "lucide-react";
import { useProtectedRoute } from "@/lib/hooks/useProtectedRoute";

export default function ProfilePage() {
  useProtectedRoute(); // Redirect to login if not authenticated
  
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <ProfileHeader user={user} profile={profile} />
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <ProfileContent user={user} profile={profile} />
          <ProfileSidebar user={user} profile={profile} />
        </div>
      </main>
    </div>
  );
}
