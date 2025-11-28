"use client";

import { useEffect, useState } from "react";
import {
  listUserMemories,
  updateUserMemory,
  deleteUserMemory,
  createUserMemory,
  type UserMemoryRow,
} from "@/lib/mca-memory-client";
import { useSupabaseSession } from "@/app/providers/supabase-session";

// UI options
const KIND_OPTIONS = [
  { value: "all", label: "All" },
  { value: "fact", label: "Facts" },
  { value: "episode", label: "Episodes" },
  { value: "profile", label: "Profile" },
  { value: "note", label: "Notes" },
  { value: "preference", label: "Preferences" },
];

export default function WorkspaceMemoryPage() {
  const { session, loading: sessionLoading } = useSupabaseSession();

  const [rows, setRows] = useState<UserMemoryRow[]>([]);
  const [kindFilter, setKindFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({
    title: "",
    content: "",
    kind: "fact",
  });

  // Creating state
  const [newContent, setNewContent] = useState("");
  const [newKind, setNewKind] = useState("fact");

  const userEmail = session?.user?.email ?? null;

  async function loadMemories() {
    if (!userEmail) return;

    setLoading(true);
    setError(null);

    try {
      const data = await listUserMemories(userEmail, {
        kind: kindFilter,
        search: search.trim() || undefined,
        limit: 100,
      });
      setRows(data);
    } catch (err: any) {
      console.error("loadMemories error:", err);
      setError("Failed to load memories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userEmail) loadMemories();
  }, [userEmail, kindFilter]);

  function beginEdit(row: UserMemoryRow) {
    setEditingId(row.id);
    setEditDraft({
      title: row.title ?? "",
      content: row.content ?? row.episode_summary ?? "",
      kind: row.kind ?? "fact",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({ title: "", content: "", kind: "fact" });
  }

  async function saveEdit(id: string) {
    try {
      await updateUserMemory(id, {
        title: editDraft.title || null,
        content: editDraft.content,
        kind: editDraft.kind,
      });
      cancelEdit();
      await loadMemories();
    } catch (err: any) {
      console.error("saveEdit error:", err);
      setError("Failed to update memory");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this memory?")) return;
    try {
      await deleteUserMemory(id);
      await loadMemories();
    } catch (err: any) {
      console.error("deleteMemory error:", err);
      setError("Failed to delete memory");
    }
  }

  async function handleCreate() {
    if (!newContent.trim() || !userEmail) return;

    try {
      await createUserMemory({
        userKey: userEmail,
        content: newContent.trim(),
        kind: newKind,
      });

      setNewContent("");
      setNewKind("fact");

      await loadMemories();
    } catch (err: any) {
      console.error("createMemory error:", err);
      setError("Failed to create memory");
    }
  }

  // Not signed in
  if (sessionLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 text-gray-300">
        Loading session…
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 text-gray-300">
        <h1 className="text-2xl font-semibold mb-2">Solace Memories</h1>
        <p>You must be signed in to view and edit memory.</p>
      </div>
    );
  }

  /* -------------------------------------------------------
     AUTHORIZED MEMORY VIEW
  -------------------------------------------------------- */

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-10 text-gray-200">
      <header>
        <h1 className="text-3xl font-semibold">Solace Memories</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage what Solace remembers about you.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value)}
          className="border border-gray-600 bg-gray-900 rounded-md px-3 py-1 text-sm"
        >
          {KIND_OPTIONS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          onKeyDown={(e) => e.key === "Enter" && loadMemories()}
          className="border border-gray-600 bg-gray-900 rounded-md px-3 py-1 text-sm flex-1 min-w-[180px]"
        />

        <button
          onClick={loadMemories}
          className="px-4 py-1 rounded-md bg-gray-800 border border-gray-600 text-sm"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="text-red-400 border border-red-700 bg-red-900/20 px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Add new memory */}
      <section className="border border-gray-700 rounded-xl p-5 bg-gray-900/40 space-y-4">
        <h2 className="text-lg font-semibold">Add new memory</h2>

        <div className="flex flex-col gap-2">
          <select
            value={newKind}
            onChange={(e) => setNewKind(e.target.value)}
            className="border border-gray-600 rounded-md bg-gray-800 px-2 py-1 text-sm w-fit"
          >
            <option value="fact">Fact</option>
            <option value="profile">Profile</option>
            <option value="preference">Preference</option>
            <option value="note">Note</option>
          </select>

          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="What should Solace remember?"
            className="border border-gray-600 rounded-md bg-gray-800 px-3 py-2 text-sm min-h-[80px]"
          />

          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              className="px-4 py-1 bg-blue-600 rounded-md text-white text-sm"
            >
              Save memory
            </button>
          </div>
        </div>
      </section>

      {/* Memory table */}
      <section className="border border-gray-700 rounded-xl overflow-hidden bg-gray-900/40">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">Title / Summary</th>
              <th className="px-3 py-2 text-left">Content</th>
              <th className="px-3 py-2 text-left">Kind</th>
              <th className="px-3 py-2 text-left">Created</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-gray-500 text-xs"
                >
                  No memories found.
                </td>
              </tr>
            )}

            {rows.map((row) => {
              const created = row.created_at
                ? new Date(row.created_at).toLocaleString()
                : "";

              const isEditing = editingId === row.id;

              if (isEditing) {
                return (
                  <tr key={row.id} className="border-t border-gray-700 bg-gray-800/40">
                    <td className="px-3 py-2">
                      <input
                        value={editDraft.title}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, title: e.target.value }))
                        }
                        className="w-full border border-gray-600 rounded-md bg-gray-900 px-2 py-1 text-xs"
                      />
                    </td>

                    <td className="px-3 py-2">
                      <textarea
                        value={editDraft.content}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, content: e.target.value }))
                        }
                        className="w-full border border-gray-600 rounded-md bg-gray-900 px-2 py-1 text-xs min-h-[70px]"
                      />
                    </td>

                    <td className="px-3 py-2">
                      <select
                        value={editDraft.kind}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, kind: e.target.value }))
                        }
                        className="border border-gray-600 rounded-md bg-gray-900 px-2 py-1 text-xs"
                      >
                        <option value="fact">fact</option>
                        <option value="episode">episode</option>
                        <option value="profile">profile</option>
                        <option value="preference">preference</option>
                        <option value="note">note</option>
                      </select>
                    </td>

                    <td className="px-3 py-2 text-xs text-gray-400">
                      {created}
                    </td>

                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        onClick={() => saveEdit(row.id)}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md"
                      >
                        Save
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="px-2 py-1 text-xs border border-gray-600 rounded-md"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={row.id} className="border-t border-gray-700">
                  <td className="px-3 py-2 text-xs font-medium">
                    {row.title ||
                      row.episode_summary ||
                      (row.content || "").slice(0, 60) ||
                      "—"}
                  </td>

                  <td className="px-3 py-2 text-xs text-gray-300 whitespace-pre-wrap">
                    {(row.content || row.episode_summary || "").slice(0, 180)}
                    {(row.content || row.episode_summary || "").length > 180
                      ? "…"
                      : ""}
                  </td>

                  <td className="px-3 py-2 text-xs">
                    <span className="border border-gray-600 rounded-full px-2 py-0.5">
                      {row.kind}
                    </span>
                  </td>

                  <td className="px-3 py-2 text-xs text-gray-400">{created}</td>

                  <td className="px-3 py-2 text-right space-x-2">
                    <button
                      onClick={() => beginEdit(row)}
                      className="px-2 py-1 text-xs border border-gray-600 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="px-2 py-1 text-xs border border-red-500 text-red-500 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}


