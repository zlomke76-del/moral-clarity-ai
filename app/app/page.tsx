"use client";

import FeatureGrid from "@/app/components/FeatureGrid";
import FloatingChat from "@/app/components/FloatingChat";

export default function AppHome() {
  // If you have auth context, pass userId/userName. Optional.
  return (
    <main className="min-h-screen">
      <FeatureGrid />
      <FloatingChat userId={null} userName={null} />
    </main>
  );
}
