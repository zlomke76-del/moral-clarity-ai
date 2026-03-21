// app/w/[workspaceId]/layout.tsx
// SERVER LAYOUT — TOOL / WORKSPACE ROOT

import { ReactNode } from "react";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export const dynamic = "force-dynamic";

export default function WorkspaceIdLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid h-screen min-h-0 w-screen grid-cols-[260px_minmax(0,1fr)] overflow-hidden">
      <aside className="h-full overflow-y-auto border-r border-white/8 bg-neutral-950/70 backdrop-blur-xl">
        <NeuralSidebar />
      </aside>

      <main className="flex h-full min-h-0 flex-col overflow-hidden bg-transparent">
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden px-6 py-6">
          <div className="h-full min-h-0 w-full overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(9,14,24,0.94)_0%,rgba(5,8,16,0.98)_100%)] shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
