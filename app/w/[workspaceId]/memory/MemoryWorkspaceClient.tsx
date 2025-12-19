"use client";

import { useState } from "react";

import MemoryIndexPanel from "@/app/components/memory/MemoryIndexPanel";
import MemoryEditorPanel, {
  MemoryRecord,
} from "@/app/components/memory/MemoryEditorPanel";

type Props = {
  workspaceId: string;
  initialItems?: MemoryRecord[];
};

export default function MemoryWorkspaceClient({
  workspaceId,
  initialItems = [],
}: Props) {
  const [selected, setSelected] = useState<MemoryRecord | null>(null);

  return (
    <div
      data-memory-grid
      className="h-full grid grid-cols-[420px_1fr] min-h-0"
    >
      <aside className="border-r border-neutral-800 overflow-y-auto">
        <MemoryIndexPanel
          workspaceId={workspaceId}
          initialItems={initialItems}
          onSelect={setSelected}
        />
      </aside>

      <main className="overflow-hidden">
        {selected ? (
          <MemoryEditorPanel record={selected} />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-neutral-500">
            Select a memory to view or edit
          </div>
        )}
      </main>
    </div>
  );
}
