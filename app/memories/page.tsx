// app/memories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function MemoriesPage() {
  const supabase = createClientComponentClient();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
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

  async function bootstrapAuth() {
    const { data } = await supabase.auth.getSession();
    const email = data.session?.user?.email ?? null;
    setUserEmail(email);

    if (email) loadMemories(email);
  }

  useEffect(() => {
    bootstrapAuth();
  }, []);

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
        `title.ilike.%${search}%,content.ilike.%${search}%,episode_summary.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setRows(data || []);
    }

    setLoading(false);
  }

  async function saveNewMemory() {
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

  async function saveEdit(id: string) {
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
    loadMemories(userEmail!);
  }

  async function deleteMemory(id: string) {
    if (!confirm("Delete this memory permanently?")) return;

    const { error } = await supabase
      .from("user_memories")
      .delete()
      .eq("id", id);

    if (error) setError(error.message);

    loadMemories(userEmail!);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">

      <h1 className="text-2xl font-semibold">Solace Memories</h1>
      {!userEmail && (
        <p className="text-sm text-red-400">
          You must be signed in to view memories.
        </p>
      )}

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <select
          value={kindFilter}
          onChange={(e) => {
            setKindFilter(e.target.value);
            if (userEmail) loadMemories(userEmail);
          }}
          className="border px-2 py-1 rounded-md text-sm"
        >
          <option value="all">All</option>
          <option value="fact">Facts</option>
          <option value="episode">Episodes</option>
          <option value="profile">Profile</option>
          <option value="note">Notes</option>
        </select>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && userEmail && loadMemories(userEmail)}
          placeholder="Search…"
          className="border px-3 py-1 rounded-md text-sm flex-1"
        />

        <button
          onClick={() => userEmail && loadMemories(userEmail)}
          className="border px-3 py-1 rounded-md"
        >
          Refresh
        </button>
      </div>

      {/* New Memory */}
      <section className="border rounded-xl p-4 bg-gray-50 space-y-2">
        <h2 className="text-sm font-semibold">Add new memory</h2>

        <select
          value={newKind}
          onChange={(e) => setNewKind(e.target.value)}
          className="border px-2 py-1 rounded-md text-xs"
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
          onClick={saveNewMemory}
          className="bg-black text-white px-3 py-1 rounded-md text-sm"
        >
          Save
        </button>
      </section>

      {/* Results Table */}
      {loading && <p>Loading...</p>}
      {!loading && rows.length === 0 && (
        <p className="text-sm text-gray-500">No memories found.</p>
      )}

      {rows.length > 0 && (
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Summary</th>
              <th className="px-3 py-2 text-left">Content</th>
              <th className="px-3 py-2">Kind</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const editing = editingId === row.id;

              if (editing) {
                return (
                  <tr key={row.id} className="border-t bg-yellow-50/50">
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
                    <td className="px-3 py-2">
                      <select
                        className="border rounded-md px-2 py-1 text-xs"
                        value={editDraft.kind}
                        onChange={(e) =>
                          setEditDraft((d) => ({ ...d, kind: e.target.value }))
                        }
                      >
                        <option value="fact">fact</option>
                        <option value="profile">profile</option>
                        <option value="episode">episode</option>
                        <option value="note">note</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 flex gap-2">
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

              return (
                <tr key={row.id} className="border-t">
                  <td className="px-3 py-2 text-xs font-medium">
                    {row.title || row.episode_summary || row.content.slice(0, 60)}
                  </td>
                  <td className="px-3 py-2 text-xs whitespace-pre-wrap">
                    {row.content.slice(0, 150)}…
                  </td>
                  <td className="px-3 py-2 text-xs text-center">
                    {row.kind}
                  </td>
                  <td className="px-3 py-2 text-xs text-right space-x-2">
                    <button
                      className="border px-2 py-1 rounded-md"
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
                      className="border border-red-400 text-red-600 px-2 py-1 rounded-md"
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

