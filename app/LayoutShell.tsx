// app/LayoutShell.tsx
"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/components/NeuralSidebar";
import SolaceDock from "@/components/SolaceDock";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // AUTH PAGES → Sidebar YES, Solace NO
  const isAuth = pathname.startsWith("/auth");

  return (
    <div className="relative z-10 min-h-screen flex">

      {/* Sidebar ALWAYS visible */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex justify-center items-start py-20">
        {children}
      </main>

      {/* Solace appears everywhere EXCEPT auth */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}
