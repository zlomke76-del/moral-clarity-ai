export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { createClientServer } from "@/lib/supabase/server";
import MemoryWorkspaceClient from "./MemoryWorkspaceClient";

type Props = {
  params: {
    workspaceId: string;
  };
};

export default async function WorkspaceMemoryPage({ params }: Props) {
  const workspaceId = decodeURIComponent(params.workspaceId);
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from("memory.memories")
    .select("id, content, memory_type, updated_at")
    .eq("workspace_id", workspaceId)
    .order("updated_at", { ascending: false })
    .limit(25);

  if (error) {
    console.error("[memory page] load error", error);
  }

  return (
    <section
      data-layout-boundary="WorkspaceMemoryPage"
      className="w-full h-full flex flex-col"
    >
      {/* Header */}
      <header className="px-8 py-6 border-b border-neutral-800">
        <h1 className="text-2xl font-semibold tracking-tight">
          Workspace Memories
        </h1>
        <p className="text-sm text-neutral-400">
          Long-term factual memory only
        </p>
      </header>

      {/* Client Workspace */}
      <div className="flex-1 min-h-0">
        <MemoryWorkspaceClient
          workspaceId={workspaceId}
          initialItems={Array.isArray(data) ? data : []}
        />
      </div>
    </section>
  );
}
