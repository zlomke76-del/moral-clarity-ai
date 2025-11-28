"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import {
  listUserMemories,
  createUserMemory,
  updateUserMemory,
  deleteUserMemory,
  type UserMemoryRow,
} from "@/lib/mca-memory-client";

type KindFilter = "all" | "fact" | "episode" | "profile" | "note" | "preference";

export default function WorkspaceMemoryPage() {
  const [userKey, setUserKey] = useState<string | null>(null);
  const [memories, setMemories] = useState<UserMemoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [search, setSearch] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newKind, setNewKind] = useState<KindFilter>("fact");

  const supabase = useMemo(() => createClient(), []);

  // ----------------------------------------------------
  // Get current user email → user_key
  // ----------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("memory page: getUser error", error);
        return;
      }
      const email = data.user?.email ?? null;
      if (!cancelled) {
        setUserKey(email);
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  // ----------------------------------------------------
  // Load memories for this user
  // ----------------------------------------------------
  async function refreshMemories() {
    if (!userKey) return;

    setLoading(true);
    try {
      const rows = await listUserMemories(userKey, {
        kind: kindFilter === "all" ? undefined : kindFilter,
        search: search.trim() || undefined,
        limit: 200,
      });
      setMemories(rows);
    } catch (err) {
      console.error("memory page: listUserMemories error", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userKey) return;
    void refreshMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey, kindFilter, search]);

  // ----------------------------------------------------
  // Create / Update / Delete
  // ----------------------------------------------------
  async function handleCreate() {
    if (!userKey || !newContent.trim()) return;

    try {
      await createUserMemory({
        userKey,
        content: newContent.trim(),
        kind: newKind === "all" ? "fact" : newKind,
      });
      setNewContent("");
      await refreshMemories();
    } catch (err) {
      console.error("memory page: createUserMemory error", err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteUserMemory(id);
      await refreshMemories();
    } catch (err) {
      console.error("memory page: deleteUserMemory error", err);
    }
  }

  // (Optional) simple inline title editor in future – stub left here
  // async function handleUpdateTitle(id: string, title: string) { ... }

  // ----------------------------------------------------
  // Render
  // ----------------------------------------------------
  return (
    <div className="w-full min-h-screen px-10 py-10 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-semibold text-slate-50 mb-2">
          Solace Memories
        </h1>
        {!userKey && (
          <p className="text-sm text-slate-400">
            You must be signed in to view and edit memory.
          </p>
        )}
      </header>

      {/* Controls + New memory */}
      {userKey && (
        <section className="space-y-6">
          {/* Filters / search */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              className="bg-slate-900 border border-slate-700 text-sm rounded px-2 py-1 text-slate-200"
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value as KindFilter)}
            >
              <option value="all">All</option>
              <option value="fact">Facts</option>
              <option value="episode">Episodes</option>
              <option value="profile">Profile</option>
              <option value="note">Notes</option>
              <option value="preference">Preferences</option>
            </select>

            <input
              className="bg-slate-900 border border-slate-700 text-sm rounded px-3 py-1 text-slate-100 flex-1 min-w-[180px]"
              placeholder="Search title, content, or summary…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              type="button"
              onClick={refreshMemories}
              className="text-sm border border-slate-600 rounded px-3 py-1 bg-slate-800 hover:bg-slate-700"
            >
              Refresh
            </button>
          </div>

          {/* Add new memory */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-medium text-slate-100">
                Add new memory
              </h2>
              <select
                className="bg-slate-950 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200"
                value={newKind}
                onChange={(e) => setNewKind(e.target.value as KindFilter)}
              >
                <option value="fact">Fact</option>
                <option value="episode">Episode</option>
                <option value="profile">Profile</option>
                <option value="note">Note</option>
                <option value="preference">Preference</option>
              </select>
            </div>

            <textarea
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm text-slate-100"
              rows={3}
              placeholder="What should Solace remember?"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />

            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center justify-center rounded bg-blue-500 hover:bg-blue-400 px-4 py-2 text-sm font-medium text-slate-950"
            >
              Save memory
            </button>
          </div>
        </section>
      )}

      {/* Memory table */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-lg p-4">
        {loading ? (
          <div className="text-slate-400 text-sm">Loading memories…</div>
        ) : !userKey ? (
          <div className="text-slate-400 text-sm">
            Sign in to view your memories.
          </div>
        ) : memories.length === 0 ? (
          <div className="text-slate-400 text-sm">No memories stored yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-100 border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-300">
                  <th className="text-left py-2 pr-3 w-[10%]">Kind</th>
                  <th className="text-left py-2 pr-3 w-[30%]">Title / Summary</th>
                  <th className="text-left py-2 pr-3">Content</th>
                  <th className="text-left py-2 pr-3 w-[15%]">Created</th>
                  <th className="text-left py-2 w-[8%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memories.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-800 last:border-none align-top"
                  >
                    <td className="py-2 pr-3 text-blue-300 text-xs uppercase tracking-wide">
                      {m.kind ?? "fact"}
                    </td>
                    <td className="py-2 pr-3 text-slate-100">
                      {m.title || <span className="text-slate-500">—</span>}
                    </td>
                    <td className="py-2 pr-3 text-slate-200 whitespace-pre-wrap">
                      {m.content || m.episode_summary || ""}
                    </td>
                    <td className="py-2 pr-3 text-slate-400 text-xs">
                      {m.created_at
                        ? new Date(m.created_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id)}
                        className="border border-red-500/70 text-red-300 rounded px-2 py-1 hover:bg-red-500/10"
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



