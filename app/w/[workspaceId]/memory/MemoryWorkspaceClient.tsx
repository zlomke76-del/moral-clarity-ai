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
        setItems([]);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data.items)) {
        setItems(data.items);
        // Unselect if record no longer present
        if (selected && !data.items.find((x) => x.id === selected.id)) {
          setSelected(null);
        }
      } else {
        setError("Unexpected memory list format.");
        setItems([]);
      }
    } catch (err) {
      setError("An error occurred while loading memories.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, selected]);

  useEffect(() => {
    loadMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  function handleUpdate(updated: MemoryRecord) {
    setItems((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setSelected(updated);
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
          refetch={loadMemories}
        />
      </aside>
      <main className="overflow-hidden">
        {selected ? (
          <MemoryEditorPanel
            workspaceId={workspaceId}
            record={selected}
            onSave={async (newContent) => {
              // Try to parse string as JSON if original content was object
              let content: any = newContent;
              if (
                selected.content &&
                typeof selected.content === "object"
              ) {
                try {
                  content = JSON.parse(newContent);
                } catch {
                  // fallback: don't update if JSON invalid
                  // Optionally show error here
                  return;
                }
              }
              const res = await fetch(`/api/memory/${selected.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
                credentials: "include",
              });
              if (res.ok) {
                const updated = await res.json();
                handleUpdate(updated);
              } else {
                // Optionally: show error in editor or as notification
              }
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-neutral-500 px-4">
            {loading
              ? "Loading workspace memories..."
              : error
              ? error
              : "Select a memory to view or edit"}
          </div>
        )}
      </main>
    </div>
  );
}
