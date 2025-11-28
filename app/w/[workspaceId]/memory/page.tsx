"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { usePathname, useRouter } from "next/navigation";

type MemoryItem = {
  id: string;
  memory_type: string;
  memory_text: string;
  created_at: string;
};

export default function WorkspaceMemoryPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const [items, setItems] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMemory, setNewMemory] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // -----------------------------
  // LOAD MEMORIES
  // -----------------------------
  async function loadMemories() {
    setLoading(true);

    const { data, error } = await supabase
      .from("memory_episode_chunks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setItems(data as any);
    setLoading(false);
  }

  useEffect(() => {
    loadMemories();
  }, []);

  // -----------------------------
  // ADD MEMORY
  // -----------------------------
  async function addMemory() {
    if (!newMemory.trim()) return;

    await supabase.from("memory_episode_chunks").insert({
      memory_type: "fact",
      memory_text: newMemory.trim(),
    });

    setNewMemory("");
    loadMemories();
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Main container with spacing so it's not hidden behind sidebar */}
      <div className="pl-[22rem] pr-8 pt-10 pb-20">
        <h1 className="text-3xl font-semibold mb-6">Solace Memories</h1>

        {/* Add Memory */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 mb-10">
          <h2 classOthers="text-xl mb-3">Add new memory</h2>

          <textarea
            className="w-full bg-slate-900 border border-slate-700 rounded p-3 mb-3 text-gray-200"
            rows={3}
            placeholder="What should Solace remember?"
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
          />

          <button
            className="bg-blue-500 px-4 py-2 rounded text-white"
            onClick={addMemory}
          >
            Save memory
          </button>
        </div>

        {/* Memory Table */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
          {loading ? (
            <div className="text-gray-400">Loading memories…</div>
          ) : items.length === 0 ? (
            <div className="text-gray-400">No memories stored yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-300 border-b border-slate-600">
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Content</th>
                  <th className="text-left py-2">Created</th>
                </tr>
              </thead>

              <tbody>
                {items.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-700/60 last:border-none"
                  >
                    <td className="py-2 text-blue-300">{m.memory_type}</td>
                    <td className="py-2 text-gray-200">{m.memory_text}</td>
                    <td className="py-2 text-gray-400">
                      {new Date(m.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Solace Dock fixed bottom */}
      <div className="fixed bottom-4 right-4 w-[600px] max-w-full">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="text-gray-300 mb-2">Solace</div>
          <textarea
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-gray-200"
            placeholder="Ask Solace…"
          />
        </div>
      </div>
    </div>
  );
}
