"use client";

import { useState } from "react";
import { createClientBrowser } from "@/lib/supabase/browser";

import MemoryIndexPanel from "@/components/memory/MemoryIndexPanel";
import MemoryEditorPanel, {
  MemoryRecord,
} from "@/components/memory/MemoryEditorPanel";

type Props = {
  workspaceId: string;
  initialItems: MemoryRecord[];
};

export default function MemoryWorkspaceClient({
  workspaceId,
  initialItems,
}: Props) {
  const [selected, setSelected] = useState<MemoryRecord | null>(null);

  async function handleSave(memory: MemoryRecord) {
    const supabase = createClientBrowser();

    await supabase
      .from("memory.memories")
      .update({
        content: memory.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memory.id);
  }

  return (
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
  );
}
