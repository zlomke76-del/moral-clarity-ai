// app/components/WorkspaceMemoryPage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type MemoryRow = {
  id: string;
  user_key: string | null;
  title: string | null;
  content: string | null;
  kind: string | null;
  workspace_id: string | null;
  created_at: string | null;
};

type FilterKind = "all" | "fact" | "episode" | "profile" | "note" | "preference";
type NewKind = "fact" | "episode" | "profile" | "note" | "preference";

export default function WorkspaceMemoryPage() {
  const [items, setItems] = useState<MemoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterKind, setFilterKind] = useState<FilterKind>("all");
  const [search, setSearch] = useState("");

  const [newKind, setNewKind] = useState<NewKind>("fact");
  const [newText, setNewText] = useState("");
  const [newTitle, setNewTitle] = useState("");

  // Single Supabase browser client
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  /* -------------------------------------------------------
     LOAD MEMORIES FROM user_memories
     (RLS will scope to the authenticated user)
  -------------------------------------------------------- */
  async function loadMemories() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("user_memories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("loadMemories error:", error);
      setItems([]);
      setError(error.message ?? "Failed to load memories");
      setLoading(false);
      return;
    }

    setItems((data || []) as MemoryRow[]);
    setLoading(false);
  }

  useEffect(() => {
    loadMemories();
  }, [supabase]);

  /* -------------------------------------------------------
     CREATE MEMORY (user_memories)
  -------------------------------------------------------- */
  async function addMemory() {
    const text = newText.trim();
    const title = newTitle.trim();

    if (!text) return;

    const { error } = await supabase.from("user_memories").insert({
      content: text,
      title: title || null,
      kind: newKind,
      // user_key will be enforced / filled by RLS + database defaults
    });

    if (error) {
      console.error("addMemory error:", error);
      setError(error.message ?? "Failed to create memory");
      return;
    }

    setNewText("");
    setNewTitle("");
    await loadMemories();
  }

  /* -------------------------------------------------------
     DELETE MEMORY
  -------------------------------------------------------- */
  async function deleteMemory(id: string) {
    const { error } = await supabase
      .from("user_memories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("deleteMemory error:", error);
      setError(error.message ?? "Failed to delete memory");
      return;
    }

    await loadMemories();
  }

  /* -------------------------------------------------------
     FILTERING
  -------------------------------------------------------- */
  const filteredItems = items.filter((m) => {
    const kind = (m.kind ?? "").toLowerCase();
    const text = (
      (m.title ?? "") +
      " " +
      (m.content ?? "")
    )
      .toString()
      .toLowerCase();

    const matchesKind =
      filterKind === "all"
        ? true
        : kind === filterKind.toLowerCase();

    const matchesSearch = !search.trim()
      ? true
      : text.includes(search.toLowerCase());

    return matchesKind && matchesSearch;
  });

  /* -------------------------------------------------------
     RENDER
  -------------------------------------------------------- */
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
          Memory
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-50">
          Solace Memories
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Review, add, and prune what Solace remembers about you.
        </p>
      </header>

      {/* ERROR BANNER */}
      {error && (
        <div className="rounded-md border border-red-500 bg-red-900/30 px-4 py-2 text-sm text-red-100">
          {error}
        </div>
      )}

      {/* FILTER BAR */}
      <section className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Filter
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <select
            className="w-full lg:w-48 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
            value={filterKind}
            onChange={(e) => setFilterKind(e.target.value as FilterKind)}
          >
            <option value="all">All</option>
            <option value="fact">Facts</option>
            <option value="episode">Episodes</option>
            <option value="profile">Profile</option>
            <option value="note">Notes</option>
            <option value="preference">Preferences</option>
          </select>

          <input
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
            placeholder="Search title or content…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            type="button"
            className="px-4 py-2 rounded bg-slate-800 border border-slate-600 text-sm"
            onClick={loadMemories}
          >
            Refresh
          </button>
        </div>
      </section>

      {/* ADD NEW MEMORY */}
      <section className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
        <div className="text-base font-semibold text-slate-50">
          Add new memory
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="w-full lg:w-48">
              <div className="text-xs font-semibold text-slate-400 mb-1">
                Kind
              </div>
              <select
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
                value={newKind}
                onChange={(e) => setNewKind(e.target.value as NewKind)}
              >
                <option value="fact">Fact</option>
                <option value="episode">Episode</option>
                <option value="profile">Profile</option>
                <option value="note">Note</option>
                <option value="preference">Preference</option>
              </select>
            </div>

            <div className="flex-1">
              <div className="text-xs font-semibold text-slate-400 mb-1">
                Title (optional)
              </div>
              <input
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Short label for this memory"
              />
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-400 mb-1">
              What should Solace remember?
            </div>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm min-h-[80px]"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded bg-blue-500 text-sm font-medium text-white"
            onClick={addMemory}
          >
            Save memory
          </button>
        </div>
      </section>

      {/* MEMORY TABLE – AT THE TOP OF THE PAGE CONTENT */}
      <section className="bg-slate-900/70 border border-slate-700 rounded-lg p-4">
        {loading ? (
          <div className="text-slate-300 text-sm">Loading memories…</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-slate-300 text-sm">No memories stored yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-300 border-b border-slate-700">
                <tr>
                  <th className="text-left py-2 pr-4">Kind</th>
                  <th className="text-left py-2 pr-4">Title</th>
                  <th className="text-left py-2 pr-4">Content</th>
                  <th className="text-left py-2 pr-4">Created</th>
                  <th className="text-left py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-800 last:border-0"
                  >
                    <td className="py-2 pr-4 text-blue-300">
                      {m.kind ?? "—"}
                    </td>
                    <td className="py-2 pr-4 text-slate-100 max-w-xs">
                      {m.title ?? "—"}
                    </td>
                    <td className="py-2 pr-4 text-slate-200 max-w-xl">
                      {m.content ?? "—"}
                    </td>
                    <td className="py-2 pr-4 text-slate-400 whitespace-nowrap">
                      {m.created_at
                        ? new Date(m.created_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-2 pr-4">
                      <button
                        type="button"
                        className="text-xs px-3 py-1 rounded bg-red-600/80 text-white"
                        onClick={() => deleteMemory(m.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}






