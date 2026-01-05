"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import MemoryIndexPanel from "@/app/components/memory/MemoryIndexPanel";
import MemoryEditorPanel from "@/app/components/memory/MemoryEditorPanel";
import type { MemoryRecord } from "@/app/components/memory/types";
import { createBrowserClient } from "@supabase/ssr";

type Props = {
  workspaceId: string;
  initialItems: MemoryRecord[];
};

export default function MemoryWorkspaceClient({
  workspaceId,
  initialItems,
}: Props) {
  // SINGLETON instance, one per component instance
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [items, setItems] = useState<MemoryRecord[]>(initialItems);
  const [selected, setSelected] = useState<MemoryRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMemories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
        error: supabaseError,
      } = await supabase.auth.getSession();

      if (supabaseError || !session?.access_token) {
        setError("Not authenticated. Please log in.");
        setItems([]);
        setLoading(false);
        return;
      }

      const res = await fetch(
        `/api/memory/workspace?workspaceId=${workspaceId}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );

      if (!res.ok) {
        setError("Failed to load workspace memories.");
        setItems([]);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data.items)) {
        setItems(data.items);

        // If the selected item no longer exists, clear it
        if (
          selected &&
          !data.items.find((x: MemoryRecord) => x.id === selected.id)
        ) {
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
  }, [workspaceId, selected, supabase]);

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
              let content: any = newContent;

              if (selected.content && typeof selected.content === "object") {
                try {
                  content = JSON.parse(newContent);
                } catch {
                  return;
                }
              }

              const {
                data: { session },
              } = await supabase.auth.getSession();

              const access_token = session?.access_token;
              if (!access_token) return;

              const res = await fetch(`/api/memory/${selected.id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({ content }),
              });

              if (res.ok) {
                const updated = await res.json();
                handleUpdate(updated);
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
