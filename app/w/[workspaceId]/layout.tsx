// app/w/[workspaceId]/memory/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type MemoryRow = {
  id: string;
  title: string;
  content: string;
  kind: string;
  created_at: string;
};

export default function MemoryPage() {
  const supabase = createClientComponentClient();
  const [memories, setMemories] = useState<MemoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState("fact");
  const [content, setContent] = useState("");

  async function loadMemories() {
    setLoading(true);

    const { data, error } = await supabase
      .from("memory_episodes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setMemories(data);
    setLoading(false);
  }

  async function addMemory() {
    if (!content.trim()) return;

    await supabase.from("memory_episodes").insert({
      episodic_type: kind,
      episode_summary: content,
    });

    setContent("");
    await loadMemories();
  }

  async function deleteMemory(id: string) {
    await supabase.from("memory_episodes").delete().eq("id", id);
    await loadMemories();
  }

  useEffect(() => {
    loadMemories();
  }, []);

  return (
    <div className="w-full flex justify-center">
      {/* MAIN PANEL */}
      <div
        className="
          w-full max-w-6xl
          bg-[rgba(15,23,42,0.88)]
          border border-[rgba(148,163,184,0.25)]
          rounded-xl backdrop-blur-xl
          shadow-2xl
          p-10 mt-10 mb-20
        "
      >
        {/* HEADER */}
        <h1 className="text-3xl font-semibold mb-6 text-white">
          Solace Memories
        </h1>

        {/* ADD NEW MEMORY SECTION */}
        <div className="mb-10 space-y-4">
          <h2 className="text-xl font-semibold text-white">Add new memory</h2>

          <select
            className="bg-[#0f1623] border border-[rgba(148,163,184,0.3)] rounded-md px-3 py-2 text-white"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="fact">Fact</option>
            <option value="episode">Episode</option>
          </select>

          <textarea
            className="w-full bg-[#0f1623] border border-[rgba(148,163,184,0.3)] rounded-md px-3 py-2 text-white"
            placeholder="What should Solace remember?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            onClick={addMemory}
            className="
              px-4 py-2 rounded-md bg-blue-600
              hover:bg-blue-500 transition
            "
          >
            Save memory
          </button>
        </div>

        {/* MEMORY LIST */}
        <h2 className="text-xl font-semibold text-white mb-4">Existing Memories</h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : memories.length === 0 ? (
          <p className="text-gray-400">No memories saved yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-300 border-b border-[rgba(148,163,184,0.2)]">
                  <th className="py-3 px-2">Title / Summary</th>
                  <th className="py-3 px-2">Content</th>
                  <th className="py-3 px-2">Kind</th>
                  <th className="py-3 px-2">Created</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {memories.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-[rgba(148,163,184,0.1)] text-gray-200"
                  >
                    <td className="py-3 px-2 max-w-[200px] truncate">
                      {m.title || m.episode_summary?.slice(0, 50)}
                    </td>
                    <td className="py-3 px-2 max-w-[400px] truncate">
                      {m.content || m.episode_summary}
                    </td>
                    <td className="py-3 px-2 capitalize">{m.kind}</td>
                    <td className="py-3 px-2">
                      {new Date(m.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-2 flex gap-2">
                      <button
                        onClick={() => deleteMemory(m.id)}
                        className="px-3 py-1 rounded bg-red-500 hover:bg-red-400"
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
