"use client";

import { Header } from "@/components/layout/header";
import { NetworkContent } from "@/components/network/network-content";
import { NetworkSidebar } from "@/components/network/network-sidebar";

export default function NetworkPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <NetworkContent />
          </div>
          <div className="hidden lg:block">
            <NetworkSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
