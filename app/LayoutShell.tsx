"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  // ---------------------------------------
  // AUTH ROUTES → NO SIDEBAR, NO GRID
  // ---------------------------------------
  if (pathname.startsWith("/auth")) {
    return (
      <div className="flex flex-col w-full items-center pt-32">
        <div className="w-full max-w-2xl px-8">
          {children}
        </div>
      </div>
    );
  }

  // ---------------------------------------
  // WORKSPACE ROUTES → GRID (20% / 80%)
  // ---------------------------------------
  return (
    <div className="grid grid-cols-[20vw_1fr] min-h-screen relative z-10">
      
      {/* LEFT 20% — SIDEBAR */}
      <aside className="h-full">
        <NeuralSidebar />
      </aside>

      {/* RIGHT 80% — PAGE CONTENT */}
      <main className="h-full flex flex-col items-start justify-start px-12 py-16">
        {children}
      </main>
    </div>
  );
}
