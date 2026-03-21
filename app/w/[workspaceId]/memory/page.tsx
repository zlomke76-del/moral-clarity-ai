import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import MemoryWorkspaceClient from "./MemoryWorkspaceClient";
import RolodexWorkspaceClient from "./RolodexWorkspaceClient";

export const dynamic = "force-dynamic";

export default async function WorkspaceMemoryPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <section className="w-full h-full min-h-0 flex flex-col overflow-hidden px-8 py-6">
      {/* HEADER */}
      <header className="flex-shrink-0 border-b border-white/8 pb-5 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {/* BACK TO APP */}
          <Link
            href="/app"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-white/70 transition-all hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back</span>
          </Link>

          {/* TITLE BLOCK */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Workspace Memories
            </h1>
            <p className="text-sm text-white/45 mt-1">
              Long-term factual memory and human-managed relationships
            </p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        <MemoryWorkspaceClient
          workspaceId={workspaceId}
          initialItems={[]}
        />

        <RolodexWorkspaceClient workspaceId={workspaceId} />
      </div>
    </section>
  );
}
