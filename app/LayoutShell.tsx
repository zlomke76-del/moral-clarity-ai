"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  // Fix: pathname may be null → provide empty string as fallback
  const pathname = usePathname() ?? "";
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    return (
      <div className="flex h-screen w-screen overflow-hidden">
        <aside>
          <NeuralSidebar />
        </aside>

        <main className="flex-1 flex items-center justify-center p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <aside>
        <NeuralSidebar />
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mc-content">{children}</div>
      </main>
    </div>
  );
}
