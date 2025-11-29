"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type MemoryRow = {
  id: string;
  kind: string | null;
  title: string | null;
  content: string;
  created_at: string;
};

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function WorkspaceMemoryPage() {
  const [items, setItems] = useState<MemoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [kind, setKind] = useState<string>("fact");
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");

  // ----------------------------------------
  // LOAD MEMORIES
  // ----------------------------------------
  async function loadMemories() {
    setLoading(true);

    let query = supabase
      .from("user_memories")
      .select("id, kind, title, content, created_at")
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (!error && data) {
      setItems(data as any);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadMemories();
  }, []);

  // ----------------------------------------
  // ADD MEMORY
  // ----------------------------------------
  async function addMemory() {
    if (!text.trim()) return;

    const payload = {
      kind,
      content: text.trim(),
      title: text.trim().slice(0, 120),
    };

    const { error } = await supabase.from("user_memories").insert(payload as any);

    if (error) {
      console.error("Error inserting memory", error);
      return;
    }

    setText("");
    await loadMemories();
  }

  // ----------------------------------------
  // FILTERED VIEW (client-side search)
  // ----------------------------------------
  const filtered = items.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.content.toLowerCase().includes(q) ||
      (m.title ?? "").toLowerCase().includes(q) ||
      (m.kind ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="px-10 py-10 w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-semibold mb-6">Solace Memories</h1>

      {/* Filter row */}
      <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="text-sm font-medium text-slate-200">Filter</div>
          <select
            className="w-full md:w-40 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-100"
            value="all"
            onChange={() => {}}
          >
            <option value="all">All</option>
          </select>

          <input
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-100"
            placeholder="Search title, content, or summary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            type="button"
            className="px-3 py-1.5 rounded text-sm bg-slate-800 border border-slate-600 text-slate-100"
            onClick={loadMemories}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Add new memory */}
      <section className="bg-slate-900/60 border border-slate-700 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Add new memory</h2>

        <div className="mb-3">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Kind
          </label>
          <select
            className="w-full md:w-48 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-100"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="fact">Fact</option>
            <option value="episode">Episode</option>
            <option value="note">Note</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            What should Solace remember?
          </label>
          <textarea
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Short description of the fact or episode…"
          />
        </div>

        <button
          type="button"
          className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white"
          onClick={addMemory}
        >
          Save memory
        </button>
      </section>

      {/* Memory table */}
      <section className="bg-slate-900/60 border border-slate-700 rounded-lg p-4">
        {loading ? (
          <div className="text-slate-400 text-sm">Loading memories…</div>
        ) : filtered.length === 0 ? (
          <div className="text-slate-400 text-sm">No memories stored yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-300">
                  <th className="text-left py-2 pr-4">Kind</th>
                  <th className="text-left py-2 pr-4">Title</th>
                  <th className="text-left py-2 pr-4">Content</th>
                  <th className="text-left py-2 pr-4 whitespace-nowrap">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-800 last:border-0 align-top"
                  >
                    <td className="py-2 pr-4 text-blue-300">
                      {(m.kind ?? "").toLowerCase()}
                    </td>
                    <td className="py-2 pr-4 text-slate-100 max-w-xs">
                      {m.title || "—"}
                    </td>
                    <td className="py-2 pr-4 text-slate-200 max-w-xl">
                      {m.content}
                    </td>
                    <td className="py-2 pr-4 text-slate-400 whitespace-nowrap">
                      {new Date(m.created_at).toLocaleString()}
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


