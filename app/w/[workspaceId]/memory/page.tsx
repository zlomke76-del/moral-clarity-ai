// app/w/[workspaceId]/memory/page.tsx

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/supabase";

type MemoryItem = {
  id: string;
  memory_type: string;
  memory: string;
  created_at: string;
};

export default function MemoryPage() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const workspaceId = parts[1]; // /w/[workspaceId]/memory

  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMemory, setNewMemory] = useState("");
  const [memoryType, setMemoryType] = useState<"fact" | "episode">("fact");

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    loadMemories();
  }, []);

  async function loadMemories() {
    setLoading(true);

    const {
      data,
      error
    } = await supabase
      .from("user_memories")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMemories(data as MemoryItem[]);
    }

    setLoading(false);
  }

  async function addMemory() {
    if (!newMemory.trim()) return;

    await supabase.from("user_memories").insert({
      memory: newMemory,
      memory_type: memoryType,
    });

    setNewMemory("");
    loadMemories();
  }

  async function deleteMemory(id: string) {
    await supabase.from("user_memories").delete().eq("id", id);
    loadMemories();
  }

  return (
    <div className="w-full min-h-screen pt-10 pb-20 px-6 md:px-10 lg:px-14 text-gray-100">
      
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Solace Memories</h1>
      <p className="text-gray-300 mb-10">
        Manage what Solace remembers about you.
      </p>

      {/* Add New Memory */}
      <div className="bg-slate-900/60 border border-slate-700/60 p-6 rounded-xl shadow-xl mb-12">
        <h2 className="text-xl font-semibold mb-4">Add new memory</h2>

        <div className="flex flex-col gap-4">
          <select
            className="bg-slate-800 border border-slate-600 p-3 rounded-lg"
            value={memoryType}
            onChange={(e) =>
              setMemoryType(e.target.value as "fact" | "episode")
            }
          >
            <option value="fact">Fact</option>
            <option value="episode">Episode</option>
          </select>

          <textarea
            className="bg-slate-800 border border-slate-600 p-3 rounded-lg min-h-[90px]"
            placeholder="What should Solace remember?"
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
          />

          <button
            onClick={addMemory}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md w-fit"
          >
            Save memory
          </button>
        </div>
      </div>

      {/* Memories List */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-gray-300">
              <th className="py-3 px-2">Title / Summary</th>
              <th className="py-3 px-2">Content</th>
              <th className="py-3 px-2">Kind</th>
              <th className="py-3 px-2">Created</th>
              <th className="py-3 px-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : memories.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  No memories yet.
                </td>
              </tr>
            ) : (
              memories.map((m) => (
                <tr key={m.id} className="border-b border-slate-800">
                  <td className="py-4 px-2 font-medium text-gray-200">
                    {m.memory.substring(0, 40)}...
                  </td>
                  <td className="py-4 px-2 text-gray-300">
                    {m.memory}
                  </td>
                  <td className="py-4 px-2">
                    <span className="px-2 py-1 rounded bg-slate-700/50 text-sm">
                      {m.memory_type}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-gray-400">
                    {new Date(m.created_at).toLocaleString()}
                  </td>
                  <td className="py-4 px-2">
                    <button
                      onClick={() => deleteMemory(m.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

