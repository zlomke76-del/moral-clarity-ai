"use client";

import { useEffect, useState } from "react";

type RolodexRecord = {
  id: string;
  name: string;
  relationship_type: string | null;
  primary_email: string | null;
  primary_phone: string | null;
  birthday: string | null;
  notes: string | null;
  sensitivity_level: number | null;
  consent_level: number | null;
  workspace_id: string | null;
  created_at: string;
  updated_at: string;
};

type Props = {
  workspaceId: string;
};

export default function RolodexWorkspaceClient({ workspaceId }: Props) {
  const [items, setItems] = useState<RolodexRecord[]>([]);
  const [selected, setSelected] = useState<RolodexRecord | null>(null);
  const [draft, setDraft] = useState<Partial<RolodexRecord> | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------
     LOAD — WORKSPACE ROUTE (THIS WAS THE BUG)
  ------------------------------------------------------------ */
  async function load() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/rolodex/workspace?workspaceId=${workspaceId}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        setError("Failed to load contacts.");
        setItems([]);
        return;
      }

      const json = await res.json();
      setItems(Array.isArray(json.items) ? json.items : []);
    } catch {
      setError("Error loading contacts.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [workspaceId]);

  /* ------------------------------------------------------------
     CREATE / UPDATE
  ------------------------------------------------------------ */
  async function save() {
    if (!draft?.name?.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const isUpdate = !!selected?.id;
      const url = isUpdate
        ? `/api/rolodex/${selected!.id}`
        : `/api/rolodex`;

      const method = isUpdate ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          workspace_id: workspaceId,
        }),
      });

      if (!res.ok) {
        setError("Failed to save contact.");
        return;
      }

      await load();
      setDraft(null);
      setSelected(null);
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!selected) return;
    if (!confirm("Delete this contact?")) return;

    try {
      const res = await fetch(`/api/rolodex/${selected.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setError("Delete failed.");
        return;
      }

      await load();
      setSelected(null);
      setDraft(null);
    } catch {
      setError("Delete error.");
    }
  }

  /* ------------------------------------------------------------
     RENDER
  ------------------------------------------------------------ */
  return (
    <section className="w-full border-t border-neutral-800 mt-8 pt-6">
      <h2 className="text-xl font-semibold mb-4">Rolodex</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() =>
            setDraft({
              name: "",
              sensitivity_level: 2,
              consent_level: 1,
              workspace_id: workspaceId,
            })
          }
          className="px-3 py-2 rounded bg-neutral-800 text-sm"
        >
          + New
        </button>

        <button
          onClick={load}
          className="px-3 py-2 rounded bg-neutral-800 text-sm"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-neutral-500">Loading contacts…</div>
      ) : (
        <>
          <select
            value={selected?.id ?? ""}
            onChange={(e) =>
              setSelected(items.find((i) => i.id === e.target.value) || null)
            }
            className="bg-neutral-950 border border-neutral-800 rounded p-2 text-sm w-full mb-4"
          >
            <option value="">Select a contact…</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>

          {draft && (
            <div className="grid gap-3 bg-neutral-950 border border-neutral-800 rounded p-4">
              <input
                value={draft.name ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, name: e.target.value })
                }
                placeholder="Name"
                className="bg-neutral-900 border border-neutral-800 rounded p-2 text-sm"
              />

              <textarea
                value={draft.notes ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, notes: e.target.value })
                }
                placeholder="Notes"
                className="bg-neutral-900 border border-neutral-800 rounded p-2 text-sm"
              />

              <div className="flex justify-between items-center">
                <div className="text-xs text-red-400">{error}</div>
                <div className="flex gap-2">
                  {selected && (
                    <button
                      onClick={remove}
                      className="px-3 py-1.5 text-sm border border-red-600 text-red-400 rounded"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    onClick={save}
                    disabled={saving}
                    className="px-3 py-1.5 text-sm rounded bg-blue-600"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
