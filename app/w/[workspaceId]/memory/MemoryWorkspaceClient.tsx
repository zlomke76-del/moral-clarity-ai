"use client";

import { useState } from "react";

import MemoryIndexPanel from "@/app/components/memory/MemoryIndexPanel";
import MemoryEditorPanel, {
  MemoryRecord,
} from "@/app/components/memory/MemoryEditorPanel";

type Props = {
  workspaceId: string;
  initialItems: MemoryRecord[];
};

export default function MemoryWorkspaceClient({
  workspaceId,
  initialItems,
}: Props) {
  const [selected, setSelected] = useState<MemoryRecord | null>(null);

  return (
    <div
      data-memory-grid
      className="h-full grid grid-cols-[420px_1fr] min-h-0"
    >
      {/* LEFT: MEMORY INDEX */}
      <aside className="border-r border-neutral-800 overflow-y-auto">
        <MemoryIndexPanel
          workspaceId={workspaceId}
          initialItems={initialItems}
          onSelect={setSelected}
        />
      </aside>

      {/* RIGHT: MEMORY EDITOR */}
      <main className="overflow-hidden">
        <MemoryEditorPanel
          workspaceId={workspaceId}
          record={selected}
        />
      </main>
    </div>
  );
}
