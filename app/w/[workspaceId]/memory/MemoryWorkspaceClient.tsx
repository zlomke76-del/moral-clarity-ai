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
  /* ------------------------------------------------------------
     Supabase (singleton per component)
  ------------------------------------------------------------ */
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  /* ------------------------------------------------------------
     State
  ------------------------------------------------------------ */
  const [items, setItems] = useState<MemoryRecord[]>(initialItems);
  const [selected, setSelected] = useState<MemoryRecord | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  /* ------------------------------------------------------------
     Load memories (authoritative fetch)
  ------------------------------------------------------------ */
  const loadMemories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      if (authError || !session?.access_token) {
        setError("Not authenticated. Please log in.");
        setItems([]);
        return;
      }

      const res = await fetch(
        `/api/memory/workspace?workspaceId=${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!res.ok) {
        setError("Failed to load workspace memories.");
        setItems([]);
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data.items)) {
        setError("Unexpected memory list format.");
        setItems([]);
        return;
      }

      setItems(data.items);

      // Clear selection if it no longer exists
      if (
        selected &&
        !data.items.find((m: MemoryRecord) => m.id === selected.id)
      ) {
        setSelected(null);
      }
    } catch {
      setError("An error occurred while loading memories.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, supabase]); // intentionally NOT dependent on `selected`

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  /* ------------------------------------------------------------
     Local update helper
  ------------------------------------------------------------ */
  function applyUpdate(updated: MemoryRecord) {
    setItems((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setSelected(updated);
  }

  /* ------------------------------------------------------------
     Save handler (explicit, guarded, visible)
  ------------------------------------------------------------ */
  async function handleSave(newContent: string) {
    if (!selected) return;

    setSaving(true);
    setSaveError(null);

    let content: any = newContent;

    // Preserve structured content if applicable
    if (typeof selected.content === "object") {
      try {
        content = JSON.parse(newContent);
      } catch {
        setSaveError("Invalid JSON format.");
        setSaving(false);
        return;
      }
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const accessToken = session?.access_token;
    if (!accessToken) {
      setSaveError("Authentication expired.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/memory/${selected.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        setSaveError("Failed to save changes.");
        return;
      }

      const updated = await res.json();
      applyUpdate(updated);
    } catch {
      setSaveError("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  }

  /* ------------------------------------------------------------
     Render
  ------------------------------------------------------------ */
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
            saving={saving}
            error={saveError}
            onSave={handleSave}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-neutral-500 px-4">
            {loading
              ? "Loading workspace memories…"
              : error
              ? error
              : "Select a memory to view or edit"}
          </div>
        )}
      </main>
    </div>
  );
}
