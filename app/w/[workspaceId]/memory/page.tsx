"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type MemoryRow = {
  id: string;
  kind?: string | null;
  memory_type?: string | null;
  episodic_type?: string | null;
  title?: string | null;
  title_summary?: string | null;
  content?: string | null;
  memory_text?: string | null;
  created_at?: string | null;
};

export default function WorkspaceMemoryPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const [items, setItems] = useState<MemoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterKind, setFilterKind] = useState<"all" | "fact" | "episode">(
    "all"
  );
  const [search, setSearch] = useState("");

  const [newKind, setNewKind] = useState<"fact" | "episode">("fact");
  const [newText, setNewText] = useState("");

  // Single browser client instance
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  /* ----------------------------------------------------
     LOAD MEMORIES FROM memory_episode_chunks
  ---------------------------------------------------- */
  async function loadMemories() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("memory_episode_chunks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("loadMemories error:", error);
      setItems([]);
      setError(error.message ?? "Failed to load memories.");
    } else {
      setItems((data || []) as MemoryRow[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadMemories();
  }, [supabase]);

  /* ----------------------------------------------------
     ADD MEMORY
  ---------------------------------------------------- */
  async function addMemory() {
    if (!newText.trim()) return;

    const { error } = await supabase.from("memory_episode_chunks").insert({
      memory_type: newKind,
      memory_text: newText.trim(),
    });

    if (error) {
      console.error("addMemory error:", error);
      setError(error.message ?? "Failed to add memory.");
      return;
    }

    setNewText("");
    await loadMemories();
  }

  /* ----------------------------------------------------
     DELETE MEMORY
  ---------------------------------------------------- */
  async function deleteMemory(id: string) {
    const { error } = await supabase
      .from("memory_episode_chunks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("deleteMemory error:", error);
      setError(error.message ?? "Failed to delete memory.");
      return;
    }

    await loadMemories();
  }

  /* ----------------------------------------------------
     FILTERING
  ---------------------------------------------------- */
  const filteredItems = items.filter((m) => {
    const kind =
      (m.kind as string) ||
      (m.memory_type as string) ||
      (m.episodic_type as string) ||
      "";

    const text = (
      (m.title ?? m.title_summary ?? "") +
      " " +
      (m.content ?? m.memory_text ?? "")
    )
      .toString()
      .toLowerCase();

    const matchesKind =
      filterKind === "all"
        ? true
        : kind.toLowerCase() === filterKind.toLowerCase();

    const matchesSearch = !search.trim()
      ? true
      : text.includes(search.toLowerCase());

    return matchesKind && matchesSearch;
  });

  /* ----------------------------------------------------
     RENDER – this sits to the RIGHT of NeuralSidebar
     (sidebar comes from app/w/[workspaceId]/layout.tsx)
  ---------------------------------------------------- */
  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-10 space-y-8">
      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-semibold mb-1">Solace Memories</h1>
        <p className="text-sm text-slate-300">
          Manage what Solace remembers about you.
        </p>
      </header>

      {/* DEBUG LINE – helps confirm we’re actually fetching rows */}
      <div className="text-xs text-slate-400">
        Total rows: {items.length} | After filter: {filteredItems.length}
        {params?.workspaceId ? ` | workspaceId: ${params.workspaceId}` : null}
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-900/30 border border-red-700 rounded px-3 py-2">
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
            className="w-full lg:w-40 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
            value={filterKind}
            onChange={(e) => setFilterKind(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="fact">Facts</option>
            <option value="episode">Episodes</option>
          </select>

          <input
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
            placeholder="Search title, content, or summary…"
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
        <div className="text-base font-semibold">Add new memory</div>

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="w-full lg:w-40">
            <div className="text-xs font-semibold text-slate-400 mb-1">
              Kind
            </div>
            <select
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
              value={newKind}
              onChange={(e) => setNewKind(e.target.value as any)}
            >
              <option value="fact">Fact</option>
              <option value="episode">Episode</option>
            </select>
          </div>

          <div className="flex-1">
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

      {/* MEMORY TABLE */}
      <section className="bg-slate-900/70 border border-slate-700 rounded-lg p-4">
        {loading ? (
          <div className="text-slate-300 text-sm">Loading memories…</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-slate-300 text-sm">
            No memories stored yet (or none match your filters).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-300 border-b border-slate-700">
                <tr>
                  <th className="text-left py-2 pr-4">Kind</th>
                  <th className="text-left py-2 pr-4">Title / Summary</th>
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
                      {m.kind ?? m.memory_type ?? m.episodic_type ?? "—"}
                    </td>
                    <td className="py-2 pr-4 text-slate-100 max-w-xs">
                      {m.title ?? m.title_summary ?? "—"}
                    </td>
                    <td className="py-2 pr-4 text-slate-200 max-w-xl">
                      {m.content ?? m.memory_text ?? "—"}
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




