"use client";

import { useState } from "react";
import { createClientBrowser } from "@/lib/supabase/browser";

import MemoryIndexPanel from "../../../components/memory/MemoryIndexPanel";
import MemoryEditorPanel, {
  MemoryRecord,
} from "../../../components/memory/MemoryEditorPanel";

type Props = {
  workspaceId: string;
  initialItems: MemoryRecord[];
};

export default function MemoryWorkspaceClient({
  workspaceId,
  initialItems,
}: Props) {
  const supabase = createClientBrowser();
  const [selected, setSelected] = useState<MemoryRecord | null>(null);

  async function handleSave(updated: MemoryRecord) {
    await supabase
      .from("memory.memories")
      .update({ content: updated.content })
      .eq("id", updated.id);

    setSelected({ ...updated });
  }

  return (
    <section className="w-full h-full flex flex-col">
      <header className="px-8 py-6 border-b border-neutral-800">
        <h1 className="text-2xl font-semibold tracking-tight">
          Workspace Memories
        </h1>
        <p className="text-sm text-neutral-400">
          Long-term factual memory only
        </p>
      </header>

      <div className="flex-1 grid grid-cols-[420px_1fr] min-h-0">
        <aside className="border-r border-neutral-800 overflow-y-auto">
          <MemoryIndexPanel
            workspaceId={workspaceId}
            initialItems={initialItems}
            onSelect={setSelected}
          />
        </aside>

        <main className="overflow-hidden p-6">
          <MemoryEditorPanel
            memory={selected}
            onSave={handleSave}
          />
        </main>
      </div>
    </section>
  );
}
