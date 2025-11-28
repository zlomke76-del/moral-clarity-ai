// app/memories/MemoriesClient.tsx
"use client";

import { useEffect, useState } from "react";
import {
  listUserMemories,
  updateUserMemory,
  deleteUserMemory,
  createUserMemory,
  type UserMemoryRow,
} from "@/lib/mca-memory-client";

const KIND_OPTIONS = [
  { value: "all", label: "All" },
  { value: "fact", label: "Facts" },
  { value: "episode", label: "Episodes" },
  { value: "profile", label: "Profile" },
  { value: "note", label: "Notes" },
];

type Props = {
  userKey: string;
};

export default function MemoriesClient({ userKey }: Props) {
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<UserMemoryRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{
    title: string;
    content: string;
    kind: string;
  }>({ title: "", content: "", kind: "fact" });
  const [newContent, setNewContent] = useState("");
  const [newKind, setNewKind] = useState("fact");
  const [error, setError] = useState<string | null>(null);

  async function loadMemories() {
    if (!userKey) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await listUserMemories(userKey, {
        kind: kindFilter,
        search: search.trim() || undefined,
        limit: 100,
      });
      setRows(rows);
    } catch (err: any) {
      console.error("loadMemories error", err);
      setError(err?.message || "Failed to load memories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey, kindFilter]);

  function startEdit(row: UserMemoryRow) {
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
        title: editDraft.title,
        content: editDraft.content,
        kind: editDraft.kind,
      });
      await loadMemories();
      cancelEdit();
    } catch (err: any) {
      console.error("saveEdit error", err);
      setError(err?.message || "Failed to save memory");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this memory? This cannot be undone.")) return;
    try {
      await deleteUserMemory(id);
      await loadMemories();
    } catch (err: any) {
      console.error("delete error", err);
      setError(err?.message || "Failed to delete memory");
    }
  }

  async function handleCreate() {
    if (!newContent.trim() || !userKey) return;
    try {
      await createUserMemory({
        userKey,
        content: newContent.trim(),
        kind: newKind,
      });
      setNewContent("");
      setNewKind("fact");
      await loadMemories();
    } catch (err: any) {
      console.error("create error", err);
      setError(err?.message || "Failed to create memory");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Solace Memories</h1>
        <p className="text-sm text-gray-500">
          View and edit what Solace remembers about you. Changes here
          take effect immediately for future conversations.
        </p>
        <p className="text-xs text-gray-400">
          Scoped to your signed-in account. You can&apos;t see anyone else&apos;s memories.
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          {KIND_OPTIONS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search content / title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") loadMemories();
          }}
          className="border rounded-md px-3 py-1 text-sm flex-1 min-w-[180px]"
        />

        <button
          onClick={loadMemories}
          disabled={loading}
          className="border rounded-md px-3 py-1 text-sm disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 border border-red-200 rounded-md px-3 py-2 bg-red-50">
          {error}
        </div>
      )}

      {/* New memory form */}
      <section className="border rounded-xl p-4 space-y-3 bg-gray-50">
        <h2 className="text-sm font-semibold">Add new memory</h2>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2 items-center">
            <label className="text-xs text-gray-600">Kind</label>
            <select
              value={newKind}
              onChange={(e) => setNewKind(e.target.value)}
              className="border rounded-md px-2 py-1 text-xs"
            >
              <option value="fact">Fact</option>
              <option value="profile">Profile</option>
              <option value="preference">Preference</option>
              <option value="note">Note</option>
            </select>
          </div>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="What do you want Solace to remember?"
            className="border rounded-md px-3 py-2 text-sm min-h-[60px]"
          />
          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              disabled={!userKey}
              className="bg-black text-white text-sm px-3 py-1 rounded-md disabled:opacity-50"
            >
              Save memory
            </button>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="text-left px-3 py-2 w-[18%]">Title / Summary</th>
              <th className="text-left px-3 py-2 w-[40%]">Content</th>
              <th className="text-left px-3 py-2 w-[10%]">Kind</th>
              <th className="text-left px-3 py-2 w-[16%]">Created</th>
              <th className="text-right px-3 py-2 w-[16%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-xs text-gray-400"
                >
                  No memories found.
                </td>
              </tr>
            )}

            {rows.map((row) => {
              const isEditing = editingId === row.id;
              const created = row.created_at
                ? new Date(row.created_at).toLocaleString()
                : "";

              if (isEditing) {
                return (
                  <tr key={row.id} className="border-t align-top bg-yellow-50/40">
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={editDraft.title}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, title: e.target.value }))
                        }
                        className="border rounded-md px-2 py-1 text-xs w-full"
                        placeholder="Title (optional)"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <textarea
                        value={editDraft.content}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, content: e.target.value }))
                        }
                        className="border rounded-md px-2 py-1 text-xs w-full min-h-[70px]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={editDraft.kind}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, kind: e.target.value }))
                        }
                        className="border rounded-md px-2 py-1 text-xs"
                      >
                        <option value="fact">fact</option>
                        <option value="episode">episode</option>
                        <option value="profile">profile</option>
                        <option value="preference">preference</option>
                        <option value="note">note</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500">{created}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        onClick={() => saveEdit(row.id)}
                        className="text-xs px-2 py-1 rounded-md bg-black text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-xs px-2 py-1 rounded-md border"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              }

              const summary =
                row.title ||
                row.episode_summary ||
                (row.content || "").slice(0, 80);

              return (
                <tr key={row.id} className="border-t align-top">
                  <td className="px-3 py-2 text-xs font-medium">
                    {summary || <span className="text-gray-400">Untitled</span>}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-700 whitespace-pre-wrap">
                    {(row.content || row.episode_summary || "").slice(0, 220)}
                    {(row.content || row.episode_summary || "").length > 220
                      ? "…"
                      : ""}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5">
                      {row.kind || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">{created}</td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <button
                      onClick={() => startEdit(row)}
                      className="text-xs px-2 py-1 rounded-md border"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="text-xs px-2 py-1 rounded-md border border-red-400 text-red-600"
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
