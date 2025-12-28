"use client";

import { useEffect, useState } from "react";
import MemoryIndexPanel from "@/app/components/memory/MemoryIndexPanel";
import MemoryEditorPanel from "@/app/components/memory/MemoryEditorPanel";
import type { MemoryRecord } from "@/app/components/memory/types";

type Props = {
  workspaceId: string;
  initialItems: MemoryRecord[];
};

export default function MemoryWorkspaceClient({
  workspaceId,
  initialItems,
}: Props) {
  const [items, setItems] = useState<MemoryRecord[]>(initialItems);
  const [selected, setSelected] = useState<MemoryRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function loadMemories() {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/memory/workspace?workspaceId=${workspaceId}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          console.error("[MEMORY-UI] failed to load workspace memories", {
            status: res.status,
          });
          return;
        }

        const data = await res.json();

        if (!cancelled && Array.isArray(data.items)) {
          setItems(data.items);
        }
      } catch (err) {
        console.error("[MEMORY-UI] error loading workspace memories", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMemories();
    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  return (
    <div
      data-memory-grid
      className="flex-1 grid grid-cols-[420px_1fr] min-h-0"
    >
      <aside className="border-r border-neutral-800 overflow-y-auto">
        <MemoryIndexPanel
          items={items}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
        />
      </aside>

      <main className="overflow-hidden">
        {selected ? (
          <MemoryEditorPanel
            workspaceId={workspaceId}
            record={selected}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-neutral-500">
            {loading
              ? "Loading workspace memories…"
              : "Select a memory to view or edit"}
          </div>
        )}
      </main>
    </div>
  );
}
