"use client";

import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { SearchResults } from "@/components/search/search-results";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Suspense fallback={<div>Chargement...</div>}>
          <SearchResults />
        </Suspense>
      </main>
    </div>
  );
}
