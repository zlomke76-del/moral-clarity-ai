"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function WorkspaceMemoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterKind, setFilterKind] = useState<"all" | "fact" | "episode">("all");
  const [search, setSearch] = useState("");

  const [newKind, setNewKind] = useState<"fact" | "episode">("fact");
  const [newText, setNewText] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function loadMemories() {
    setLoading(true);

    const { data } = await supabase
      .from("memory_episode_chunks")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    loadMemories();
  }, []);

  async function addMemory() {
    if (!newText.trim()) return;

    await supabase.from("memory_episode_chunks").insert({
      memory_type: newKind,
      memory_text: newText.trim(),
    });

    setNewText("");
    loadMemories();
  }

  async function deleteMemory(id: string) {
    await supabase.from("memory_episode_chunks").delete().eq("id", id);
    loadMemories();
  }

  // Filter
  const filteredItems = items.filter((m: any) => {
    const kind =
      m.kind ||
      m.memory_type ||
      m.episodic_type ||
      "";

    const text = (
      (m.title ?? m.title_summary ?? "") +
      " " +
      (m.content ?? m.memory_text ?? "")
    )
      .toLowerCase();

    const matchesKind =
      filterKind === "all"
        ? true
        : kind.toLowerCase() === filterKind.toLowerCase();

    const matchesSearch = search.trim()
      ? text.includes(search.toLowerCase())
      : true;

    return matchesKind && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-1">Solace Memories</h1>
        <p className="text-slate-300 text-sm">
          Manage what Solace remembers about you.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
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
      </div>

      {/* Add Memory */}
      <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Add new memory</h2>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-40">
            <label className="text-xs text-slate-400 mb-1 block">Kind</label>
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
            <label className="text-xs text-slate-400 mb-1 block">
              What should Solace remember?
            </label>
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
            className="px-4 py-2 rounded bg-blue-500 text-sm text-white"
            onClick={addMemory}
          >
            Save memory
          </button>
        </div>
      </div>

      {/* Memory Table */}
      <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4">
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
                  <th className="text-left py-2 pr-4">Title / Summary</th>
                  <th className="text-left py-2 pr-4">Content</th>
                  <th className="text-left py-2 pr-4">Created</th>
                  <th className="text-left py-2 pr-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((m: any) => (
                  <tr key={m.id} className="border-b border-slate-800">
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
                        className="text-xs px-3 py-1 rounded bg-red-600 text-white"
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
      </div>
    </div>
  );
}






