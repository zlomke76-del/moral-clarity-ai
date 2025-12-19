"use client";

import { useState } from "react";

import MemoryIndexPanel from "@/components/memory/MemoryIndexPanel";
import MemoryEditorPanel from "@/components/memory/MemoryEditorPanel";

export type MemoryRecord = {
  id: string;
  content: string;
  memory_type: string;
  updated_at: string;
};

type Props = {
  workspaceId: string;
  initialItems: MemoryRecord[];
};

export default function MemoryWorkspaceClient({
  workspaceId,
  initialItems,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      {/* LEFT: MEMORY INDEX */}
      <aside
        data-memory-index
        className="border-r border-neutral-800 overflow-y-auto"
      >
        <MemoryIndexPanel
          workspaceId={workspaceId}
          initialItems={initialItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </aside>

      {/* RIGHT: MEMORY EDITOR */}
      <main
        data-memory-editor
        className="overflow-hidden"
      >
        <MemoryEditorPanel
          workspaceId={workspaceId}
          memoryId={selectedId}
        />
      </main>
    </>
  );
}
