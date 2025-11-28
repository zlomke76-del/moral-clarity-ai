"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  listUserMemories,
  createUserMemory,
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

  // Supabase browser client using public env vars
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

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
  // Create / Delete
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

  // ----------------------------------------------------
  // Render – NOTE: no min-h-screen and no vertical centering.
  // This content will sit at the very top of <main> right beside NeuralSidebar.
  // ----------------------------------------------------
  return (
    <div className="w-full flex flex-col gap-6 px-4 py-4 md:px-8 md:py-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-slate-50">
          Solace Memories
        </h1>
        {!userKey && (
          <p className="text-sm text-slate-400">
            You must be signed in to view and edit memory.
          </p>
        )}
      </header>

      {userKey && (
        <>
          {/* Filters / search row */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 md:p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium tracking-wide uppercase text-slate-400">
                  Filter
                </span>
                <select
                  className="bg-slate-950 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200"
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
              </div>

              <div className="flex-1 flex items-center gap-2">
                <input
                  className="flex-1 bg-slate-950 border border-slate-700 text-sm rounded px-3 py-1.5 text-slate-100"
                  placeholder="Search title, content, or summary…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="button"
                  onClick={refreshMemories}
                  className="text-xs md:text-sm border border-slate-600 rounded px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100"
                >
                  Refresh
                </button>
              </div>
            </div>
          </section>

          {/* Add new memory */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-medium text-slate-100">
                Add new memory
              </h2>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 uppercase tracking-wide">
                  Kind
                </span>
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
            </div>

            <textarea
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm text-slate-100"
              rows={3}
              placeholder="What should Solace remember?"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCreate}
                className="inline-flex items-center justify-center rounded bg-blue-500 hover:bg-blue-400 px-4 py-2 text-sm font-medium text-slate-950"
              >
                Save memory
              </button>
            </div>
          </section>
        </>
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
                  <th className="text-left py-2 pr-3 w-[8%]">Kind</th>
                  <th className="text-left py-2 pr-3 w-[24%]">
                    Title / Summary
                  </th>
                  <th className="text-left py-2 pr-3">Content</th>
                  <th className="text-left py-2 pr-3 w-[14%]">Created</th>
                  <th className="text-left py-2 w-[7%]">Actions</th>
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
                      {m.title || (
                        <span className="text-slate-500 italic">—</span>
                      )}
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


