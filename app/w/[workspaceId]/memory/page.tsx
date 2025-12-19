export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { createClientServer } from "@/lib/supabase/server";
import MemoryIndexPanel from "@/components/memory/MemoryIndexPanel";
import MemoryEditorPanel, {
  MemoryRecord,
} from "@/components/memory/MemoryEditorPanel";

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
    .eq("memory_type", "fact")
    .order("updated_at", { ascending: false })
    .limit(25);

  if (error) {
    console.error("[memory page] load error", error);
  }

  // Client state boundary
  // Selection + persistence handled client-side
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
          Long term factual memory only
        </p>
      </header>

      {/* CONTENT GRID */}
      <MemoryWorkspaceClient
        workspaceId={workspaceId}
        initialItems={Array.isArray(data) ? data : []}
      />
    </section>
  );
}

/* ---------------- CLIENT ORCHESTRATION ---------------- */

"use client";

import { useState } from "react";

function MemoryWorkspaceClient({
  workspaceId,
  initialItems,
}: {
  workspaceId: string;
  initialItems: MemoryRecord[];
}) {
  const [selected, setSelected] = useState<MemoryRecord | null>(null);

  async function handleSave(memory: MemoryRecord) {
    const supabase = await createClientServer();

    await supabase
      .from("memory.memories")
      .update({
        content: memory.content,
        memory_type: memory.memory_type,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memory.id);
  }

  return (
    <div
      data-memory-grid
      className="flex-1 grid grid-cols-[420px_1fr] min-h-0"
    >
      {/* LEFT: INDEX */}
      <aside
        data-memory-index
        className="border-r border-neutral-800 overflow-y-auto"
      >
        <MemoryIndexPanel
          workspaceId={workspaceId}
          initialItems={initialItems}
          onSelect={setSelected}
        />
      </aside>

      {/* RIGHT: EDITOR */}
      <main
        data-memory-editor
        className="overflow-hidden p-6"
      >
        <MemoryEditorPanel
          memory={selected}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}
