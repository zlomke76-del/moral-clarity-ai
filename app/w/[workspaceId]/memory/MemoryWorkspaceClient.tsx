// app/w/[workspaceId]/memory/MemoryWorkspaceClient.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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

  const [selectedId, setSelectedId] = useState<string>("");
  const selected = useMemo(
    () => items.find((m) => m.id === selectedId) ?? null,
    [items, selectedId]
  );

  const [draft, setDraft] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  /* ------------------------------------------------------------
     Load memories (facts only, scoped server-side)
  ------------------------------------------------------------ */
  const loadMemories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("Not authenticated.");
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
        setError("Unexpected memory format.");
        setItems([]);
        return;
      }

      setItems(data.items);
    } catch {
      setError("An error occurred while loading memories.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, supabase]);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  /* ------------------------------------------------------------
     Selection
  ------------------------------------------------------------ */
  function handleSelect(id: string) {
    setSelectedId(id);
    setIsEditing(false);
    setSaveError(null);

    const record = items.find((m) => m.id === id);
    if (!record) {
      setDraft("");
      return;
    }

    setDraft(
      typeof record.content === "string"
        ? record.content
        : JSON.stringify(record.content, null, 2)
    );
  }

  /* ------------------------------------------------------------
     Save (explicit + guarded)
  ------------------------------------------------------------ */
  async function handleSave() {
    if (!selected) return;

    setSaving(true);
    setSaveError(null);

    let content: any = draft;

    if (typeof selected.content === "object") {
      try {
        content = JSON.parse(draft);
      } catch {
        setSaveError("Invalid JSON format.");
        setSaving(false);
        return;
      }
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setSaveError("Authentication expired.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/memory/${selected.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        setSaveError("Failed to save memory.");
        return;
      }

      const updated = await res.json();

      setItems((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
      );
      setIsEditing(false);
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
    <div className="flex-1 flex flex-col min-h-0 p-6">
      {/* Memory selector */}
      <div className="flex-shrink-0 pb-4">
        <select
          value={selectedId}
          onChange={(e) => handleSelect(e.target.value)}
          disabled={loading}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-2 text-sm disabled:opacity-50"
        >
          <option value="">Select a memory to edit…</option>
          {items.map((m) => (
            <option key={m.id} value={m.id}>
              {new Date(m.updated_at).toLocaleDateString()} —{" "}
              {typeof m.content === "string"
                ? m.content.slice(0, 60)
                : "[Structured memory]"}
            </option>
          ))}
        </select>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="h-full flex items-center justify-center text-sm text-neutral-500">
            Loading memories…
          </div>
        ) : !selected ? (
          <div className="h-full flex items-center justify-center text-sm text-neutral-500">
            Select a memory to edit
          </div>
        ) : (
          <div className="h-full min-h-0 flex flex-col rounded-lg bg-neutral-950 border border-neutral-800 shadow-xl">
            <div className="px-4 py-3 border-b border-neutral-800 text-sm text-neutral-400">
              Editing memory
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                disabled={!isEditing}
                className="w-full h-full resize-none bg-neutral-950
                           border border-neutral-800 rounded-md
                           p-3 text-sm leading-relaxed"
              />
            </div>

            <div className="px-4 py-3 border-t border-neutral-800 flex justify-between items-center">
              <div className="text-xs text-red-400">{saveError}</div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 text-sm rounded bg-neutral-800 hover:bg-neutral-700"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelect(selected.id)}
                    className="px-3 py-1.5 text-sm rounded border border-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-3 py-1.5 text-sm rounded bg-blue-600 disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
