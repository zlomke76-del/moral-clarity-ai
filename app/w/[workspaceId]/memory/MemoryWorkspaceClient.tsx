"use client";

/* ------------------------------------------------------------
   Workspace Memory Client
   View · Create · Edit · Delete
   Authoritative UI → API contract
------------------------------------------------------------ */

import { useEffect, useMemo, useState, useCallback } from "react";
import type { MemoryRecord } from "@/app/components/memory/types";
import { createBrowserClient } from "@supabase/ssr";

/* ------------------------------------------------------------
   Types
------------------------------------------------------------ */
type Props = {
  workspaceId: string;
  initialItems: MemoryRecord[];
};

type Mode = "view" | "edit" | "create";

/* ------------------------------------------------------------
   Component
------------------------------------------------------------ */
export default function MemoryWorkspaceClient({
  workspaceId,
  initialItems,
}: Props) {
  /* ----------------------------------------------------------
     Supabase (browser, cookie auth)
  ---------------------------------------------------------- */
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  /* ----------------------------------------------------------
     State
  ---------------------------------------------------------- */
  const [items, setItems] = useState<MemoryRecord[]>(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("view");
  const [draft, setDraft] = useState<string>("");

  const selected = useMemo(
    () => items.find((m) => m.id === selectedId) ?? null,
    [items, selectedId]
  );

  /* ----------------------------------------------------------
     Refresh workspace memories
  ---------------------------------------------------------- */
  const refresh = useCallback(async () => {
    const res = await fetch(
      `/api/memory/workspace?workspaceId=${workspaceId}`,
      { credentials: "include" }
    );

    if (!res.ok) {
      console.error("workspace.memory.refresh failed");
      return;
    }

    const json = await res.json();
    setItems(json.items ?? []);
  }, [workspaceId]);

  /* ----------------------------------------------------------
     Selection handlers
  ---------------------------------------------------------- */
  const selectMemory = useCallback((id: string) => {
    setSelectedId(id);
    setMode("view");
    setDraft("");
  }, []);

  /* ----------------------------------------------------------
     Create memory
  ---------------------------------------------------------- */
  const startCreate = useCallback(() => {
    setSelectedId(null);
    setDraft("");
    setMode("create");
  }, []);

  const saveCreate = useCallback(async () => {
    if (!draft.trim()) return;

    const res = await fetch("/api/memory", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace_id: workspaceId,
        memory_type: "fact",
        content: draft.trim(),
      }),
    });

    if (!res.ok) {
      console.error("create.memory failed");
      return;
    }

    setDraft("");
    setMode("view");
    await refresh();
  }, [draft, workspaceId, refresh]);

  /* ----------------------------------------------------------
     Edit memory
  ---------------------------------------------------------- */
  const startEdit = useCallback(() => {
    if (!selected) return;
    setDraft(selected.content ?? "");
    setMode("edit");
  }, [selected]);

  const saveEdit = useCallback(async () => {
    if (!selected || !selected.id) return;

    const res = await fetch(`/api/memory/${selected.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: draft }),
    });

    if (!res.ok) {
      console.error("update.memory failed");
      return;
    }

    setDraft("");
    setMode("view");
    await refresh();
  }, [selected, draft, refresh]);

  /* ----------------------------------------------------------
     Delete memory (HARD GUARDED)
  ---------------------------------------------------------- */
  const deleteSelected = useCallback(async () => {
    if (!selected || !selected.id) {
      console.error("delete.memory blocked — no id bound");
      return;
    }

    const confirmed = confirm(
      "Delete this memory permanently? This cannot be undone."
    );
    if (!confirmed) return;

    const res = await fetch(`/api/memory/${selected.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      console.error("delete.memory failed");
      return;
    }

    setSelectedId(null);
    setMode("view");
    await refresh();
  }, [selected, refresh]);

  /* ----------------------------------------------------------
     Render
  ---------------------------------------------------------- */
  return (
    <div className="flex h-full gap-6">
      {/* ------------------------------------------------------
          Sidebar
      ------------------------------------------------------ */}
      <aside className="w-64 border-r border-neutral-800 pr-4">
        <div className="mb-4 flex gap-2">
          <button
            onClick={startCreate}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
          >
            New
          </button>
          <button
            onClick={refresh}
            className="rounded border px-3 py-1 text-sm"
          >
            Refresh
          </button>
        </div>

        <ul className="space-y-1">
          {items.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => selectMemory(m.id)}
                className={`w-full rounded px-2 py-1 text-left text-sm ${
                  selectedId === m.id
                    ? "bg-neutral-800 text-white"
                    : "hover:bg-neutral-900"
                }`}
              >
                {(m.content ?? "").slice(0, 40)}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* ------------------------------------------------------
          Main panel
      ------------------------------------------------------ */}
      <main className="flex-1">
        {mode === "view" && selected && (
          <>
            <div className="mb-4 flex gap-2">
              <button
                onClick={startEdit}
                className="rounded border px-3 py-1 text-sm"
              >
                Edit
              </button>
              <button
                onClick={deleteSelected}
                className="rounded border border-red-600 px-3 py-1 text-sm text-red-600"
              >
                Delete
              </button>
            </div>

            <pre className="whitespace-pre-wrap rounded bg-neutral-900 p-4 text-sm">
              {selected.content ?? ""}
            </pre>
          </>
        )}

        {(mode === "edit" || mode === "create") && (
          <>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="mb-4 w-full rounded bg-neutral-900 p-3 text-sm"
              rows={8}
            />

            <div className="flex gap-2">
              <button
                onClick={mode === "edit" ? saveEdit : saveCreate}
                className="rounded bg-green-600 px-4 py-1 text-sm text-white"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setMode("view");
                  setDraft("");
                }}
                className="rounded border px-4 py-1 text-sm"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
