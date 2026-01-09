"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

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
  updated_at: string;
};

type Props = {
  workspaceId: string;
};

export default function RolodexWorkspaceClient({ workspaceId }: Props) {
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [items, setItems] = useState<RolodexRecord[]>([]);
  const [selected, setSelected] = useState<RolodexRecord | null>(null);
  const [draft, setDraft] = useState<Partial<RolodexRecord>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    const res = await fetch(
      `/api/rolodex/workspace?workspaceId=${workspaceId}`,
      {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }
    );

    if (!res.ok) {
      setError("Failed to load Rolodex.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [workspaceId]);

  function startNew() {
    setSelected(null);
    setDraft({
      name: "",
      relationship_type: "",
      primary_email: "",
      primary_phone: "",
      birthday: "",
      notes: "",
      sensitivity_level: 2,
      consent_level: 1,
    });
  }

  function select(item: RolodexRecord) {
    setSelected(item);
    setDraft(item);
  }

  async function save() {
    setSaving(true);
    setError(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setError("Authentication expired.");
      setSaving(false);
      return;
    }

    const method = selected ? "PATCH" : "POST";
    const url = selected
      ? `/api/rolodex/${selected.id}`
      : `/api/rolodex`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ ...draft, workspace_id: workspaceId }),
    });

    if (!res.ok) {
      setError("Failed to save entry.");
      setSaving(false);
      return;
    }

    await load();
    setSaving(false);
  }

  async function remove() {
    if (!selected) return;
    if (!confirm("Delete this contact permanently?")) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) return;

    await fetch(`/api/rolodex/${selected.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    setSelected(null);
    setDraft({});
    load();
  }

  return (
    <section className="w-full border-t border-neutral-800 mt-8 pt-6">
      <h2 className="text-xl font-semibold mb-4">Rolodex</h2>

      {loading ? (
        <div className="text-sm text-neutral-500">Loading contacts…</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <select
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded p-2 text-sm"
              value={selected?.id ?? ""}
              onChange={(e) =>
                select(items.find((i) => i.id === e.target.value)!)
              }
            >
              <option value="">Select a contact…</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>

            <button
              onClick={startNew}
              className="px-3 py-2 rounded bg-neutral-800 text-sm"
            >
              + New
            </button>
          </div>

          {(selected || draft.name !== undefined) && (
            <div className="grid grid-cols-1 gap-3 bg-neutral-950 border border-neutral-800 rounded p-4">
              <input
                placeholder="Name"
                value={draft.name ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, name: e.target.value })
                }
                className="bg-neutral-900 border border-neutral-800 rounded p-2 text-sm"
              />

              <input
                placeholder="Relationship"
                value={draft.relationship_type ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    relationship_type: e.target.value,
                  })
                }
                className="bg-neutral-900 border border-neutral-800 rounded p-2 text-sm"
              />

              <input
                placeholder="Email"
                value={draft.primary_email ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    primary_email: e.target.value,
                  })
                }
                className="bg-neutral-900 border border-neutral-800 rounded p-2 text-sm"
              />

              <input
                placeholder="Phone"
                value={draft.primary_phone ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    primary_phone: e.target.value,
                  })
                }
                className="bg-neutral-900 border border-neutral-800 rounded p-2 text-sm"
              />

              <textarea
                placeholder="Notes"
                value={draft.notes ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, notes: e.target.value })
                }
                className="bg-neutral-900 border border-neutral-800 rounded p-2 text-sm"
              />

              <div className="flex justify-between">
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
                    className="px-3 py-1.5 text-sm rounded bg-blue-600 disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
