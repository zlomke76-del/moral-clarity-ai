"use client";

import { useEffect, useState, useCallback } from "react";
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
  const [error, setError] = useState<string | null>(null);

  const loadMemories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/memory/workspace?workspaceId=${workspaceId}`,
        { credentials: "include" }
      );

      if (!res.ok) {
        setError("Failed to load workspace memories.");
        return;
      }

      const data = await res.json();

      if (Array.isArray(data.items)) {
        setItems(data.items);
        // If selected no longer exists (e.g., after delete), clear it
        if (!data.items.find((item: MemoryRecord) => item.id === selected?.id)) {
          setSelected(null);
        }
      } else {
        setError("Unexpected response format.");
      }
    } catch (err) {
      setError("An error occurred while loading memories.");
    } finally {
      setLoading(false);
    }
  }, [workspaceId, selected?.id]);

  useEffect(() => {
    loadMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  // (Optional) Allow panels to trigger a refresh as needed
  function handleRefresh() {
    loadMemories();
  }

  // (Optional) Sync changes from editor panel back into list UI
  function handleUpdate(updated: MemoryRecord) {
    setItems(items => items.map(item => (item.id === updated.id ? updated : item)));
    setSelected(updated);
  }
  function handleDelete(deletedId: string) {
    setItems(items => items.filter(item => item.id !== deletedId));
    if (selected?.id === deletedId) setSelected(null);
  }

  return (
    <div data-memory-grid className="flex-1 grid grid-cols-[420px_1fr] min-h-0">
      <aside className="border-r border-neutral-800 overflow-y-auto">
        <MemoryIndexPanel
          items={items}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
          loading={loading}
          error={error}
          refetch={handleRefresh}
        />
      </aside>
      <main className="overflow-hidden">
        {selected ? (
          <MemoryEditorPanel
            workspaceId={workspaceId}
            record={selected}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-neutral-500 px-4">
            {loading ? "Loading workspace memories..."
            : error  ? error
            : "Select a memory to view or edit"}
          </div>
        )}
      </main>
    </div>
  );
}
