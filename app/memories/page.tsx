// app/memories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "../providers/supabase-provider";

type MemoryRow = {
  id: string;
  user_key: string;
  title: string | null;
  content: string | null;
  kind: string | null;
  episode_summary?: string | null;
  created_at: string | null;
};

const KIND_OPTIONS = [
  { value: "all", label: "All" },
  { value: "fact", label: "Facts" },
  { value: "episode", label: "Episodes" },
  { value: "profile", label: "Profile" },
  { value: "note", label: "Notes" },
];

export default function MemoriesPage() {
  const supabase = useSupabase();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rows, setRows] = useState<MemoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [kindFilter, setKindFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({
    title: "",
    content: "",
    kind: "fact",
  });

  const [newContent, setNewContent] = useState("");
  const [newKind, setNewKind] = useState("fact");
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------
  // Bootstrap current user
  // ---------------------------------------------------------
  useEffect(() => {
    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user?.email ?? null;

      setUserEmail(email);
      if (email) loadMemories(email);
    };

    bootstrap();
  }, []);

  // ---------------------------------------------------------
  // Load memories for this user
  // ---------------------------------------------------------
  async function loadMemories(email: string) {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("user_memories")
      .select("*")
      .eq("user_key", email)
      .order("created_at", { ascending: false });

    if (kindFilter !== "all") query = query.eq("kind", kindFilter);
    if (search.trim()) {
      query = query.or(
        `content.ilike.%${search}%,title.ilike.%${search}%,episode_summary.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) setError(error.message);
    else setRows(data ?? []);

    setLoading(false);
  }

  // ---------------------------------------------------------
  // Create memory
  // ---------------------------------------------------------
  async function createMemory() {
    if (!userEmail || !newContent.trim()) return;

    const { error } = await supabase.from("user_memories").insert({
      user_key: userEmail,
      content: newContent.trim(),
      kind: newKind,
    });

    if (error) setError(error.message);

    setNewContent("");
    setNewKind("fact");
    loadMemories(userEmail);
  }

  // ---------------------------------------------------------
  // Save edits
  // ---------------------------------------------------------
  async function saveEdit(id: string) {
    if (!userEmail) return;

    const { error } = await supabase
      .from("user_memories")
      .update({
        title: editDraft.title,
        content: editDraft.content,
        kind: editDraft.kind,
      })
      .eq("id", id);

    if (error) setError(error.message);

    setEditingId(null);
    loadMemories(userEmail);
  }

  // ---------------------------------------------------------
  // Delete
  // ---------------------------------------------------------
  async function deleteMemory(id: string) {
    if (!userEmail) return;
    if (!confirm("Delete this memory? This cannot be undone.")) return;

    const { error } = await supabase
      .from("user_memories")
      .delete()
      .eq("id", id);

    if (error) setError(error.message);

    loadMemories(userEmail);
  }

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Solace Memories</h1>

      {!userEmail && (
        <p className="text-sm text-red-500">
          You must be signed in to view memories.
        </p>
      )}

      {/* Controls */}
      <div className="flex gap-3 items-center">
        <select
          value={kindFilter}
          onChange={(e) => {
            setKindFilter(e.target.value);
            if (userEmail) loadMemories(userEmail);
          }}
          className="border rounded-md px-2 py-1 text-sm"
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
          onKeyDown={(e) => e.key === "Enter" && userEmail && loadMemories(userEmail)}
          placeholder="Search…"
          className="border rounded-md px-3 py-1 flex-1 text-sm"
        />

        <button
          onClick={() => userEmail && loadMemories(userEmail)}
          className="border rounded-md px-3 py-1 text-sm"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 border border-red-200 rounded-md px-3 py-2 bg-red-50">
          {error}
        </p>
      )}

      {/* Create */}
      <section className="border rounded-xl p-4 bg-gray-50 space-y-2">
        <h2 className="text-sm font-semibold">Add new memory</h2>

        <select
          value={newKind}
          onChange={(e) => setNewKind(e.target.value)}
          className="border rounded-md px-2 py-1 text-xs"
        >
          <option value="fact">Fact</option>
          <option value="profile">Profile</option>
          <option value="episode">Episode</option>
          <option value="note">Note</option>
        </select>

        <textarea
          className="border rounded-md px-3 py-2 text-sm min-h-[60px]"
          placeholder="What should Solace remember?"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />

        <button
          onClick={createMemory}
          className="bg-black text-white px-3 py-1 rounded-md text-sm"
        >
          Save
        </button>
      </section>

      {/* Table */}
      {loading && <p>Loading…</p>}
      {!loading && rows.length === 0 && (
        <p className="text-sm text-gray-500">No memories found.</p>
      )}

      {rows.length > 0 && (
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Summary</th>
              <th className="px-3 py-2 text-left">Content</th>
              <th className="px-3 py-2 text-center">Kind</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const isEditing = editingId === row.id;
              const created = row.created_at
                ? new Date(row.created_at).toLocaleString()
                : "";

              if (isEditing) {
                return (
                  <tr key={row.id} className="border-t bg-yellow-50">
                    <td className="px-3 py-2">
                      <input
                        className="border rounded-md px-2 py-1 text-xs w-full"
                        value={editDraft.title}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, title: e.target.value }))
                        }
                      />
                    </td>

                    <td className="px-3 py-2">
                      <textarea
                        className="border rounded-md px-2 py-1 text-xs w-full"
                        value={editDraft.content}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, content: e.target.value }))
                        }
                      />
                    </td>

                    <td className="px-3 py-2 text-center">
                      <select
                        className="border rounded-md px-2 py-1 text-xs"
                        value={editDraft.kind}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, kind: e.target.value }))
                        }
                      >
                        <option value="fact">fact</option>
                        <option value="episode">episode</option>
                        <option value="profile">profile</option>
                        <option value="note">note</option>
                      </select>
                    </td>

                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        className="text-xs bg-black text-white px-2 py-1 rounded-md"
                        onClick={() => saveEdit(row.id)}
                      >
                        Save
                      </button>
                      <button
                        className="text-xs border px-2 py-1 rounded-md"
                        onClick={() => setEditingId(null)}
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
                (row.content ?? "").slice(0, 80);

              return (
                <tr key={row.id} className="border-t">
                  <td className="px-3 py-2 text-xs font-medium">{summary}</td>

                  <td className="px-3 py-2 text-xs whitespace-pre-wrap">
                    {(row.content ?? "").slice(0, 200)}
                    {(row.content ?? "").length > 200 ? "…" : ""}
                  </td>

                  <td className="px-3 py-2 text-xs text-center">
                    {row.kind}
                  </td>

                  <td className="px-3 py-2 text-right space-x-2">
                    <button
                      className="text-xs border px-2 py-1 rounded-md"
                      onClick={() => {
                        setEditingId(row.id);
                        setEditDraft({
                          title: row.title ?? "",
                          content: row.content ?? "",
                          kind: row.kind ?? "fact",
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs border border-red-400 text-red-600 px-2 py-1 rounded-md"
                      onClick={() => deleteMemory(row.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
