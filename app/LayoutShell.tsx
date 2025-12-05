"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // --- AUTH ROUTES GET SIMPLE FULL-WIDTH LAYOUT ----
  if (pathname.startsWith("/auth")) {
    return (
      <div className="flex flex-col items-center justify-start w-full pt-24">
        <div className="w-full max-w-2xl px-8">
          {children}
        </div>
      </div>
    );
  }

  // --- NORMAL APP ROUTES GET SIDEBAR + CONTENT GRID ----
  return (
    <div
      className="
        grid
        grid-cols-[20vw_1fr]
        min-h-screen
        relative
        z-10
      "
    >
      {/* Sidebar column */}
      <aside className="h-full">
        <NeuralSidebar />
      </aside>

      {/* Main content column */}
      <main className="h-full flex flex-col items-start justify-start">
        <div className="w-full max-w-4xl px-12 py-16">
          {children}
        </div>
      </main>
    </div>
  );
}

