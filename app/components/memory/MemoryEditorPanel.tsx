"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase/client";

type MemoryRecord = {
  id: string;
  content: string;
  memory_type: string;
  confidence: number;
  sensitivity: number;
  emotional_weight: number;
  updated_at: string;
};

type Props = {
  memoryId: string | null;
  workspaceId: string;
  onSaved?: () => void;
};

export default function MemoryEditorPanel({
  memoryId,
  workspaceId,
  onSaved,
}: Props) {
  const supabase = createClientBrowser();

  const [record, setRecord] = useState<MemoryRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memoryId) {
      setRecord(null);
      return;
    }

    loadMemory(memoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoryId]);

  async function loadMemory(id: string) {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("memory.memories")
      .select(
        `
        id,
        content,
        memory_type,
        confidence,
        sensitivity,
        emotional_weight,
        updated_at
      `
      )
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .single();

    if (error) {
      console.error("[MemoryEditorPanel] load error", error);
      setError("Failed to load memory.");
      setLoading(false);
      return;
    }

    setRecord(data as MemoryRecord);
    setLoading(false);
  }

  async function save() {
    if (!record) return;

    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("memory.memories")
      .update({
        content: record.content,
        memory_type: record.memory_type,
        confidence: record.confidence,
        sensitivity: record.sensitivity,
        emotional_weight: record.emotional_weight,
        updated_at: new Date().toISOString(),
      })
      .eq("id", record.id)
      .eq("workspace_id", workspaceId);

    if (error) {
      console.error("[MemoryEditorPanel] save error", error);
      setError("Save failed.");
      setSaving(false);
      return;
    }

    setSaving(false);
    onSaved?.();
  }

  async function remove() {
    if (!record) return;
    if (!confirm("Delete this memory?")) return;

    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("memory.memories")
      .delete()
      .eq("id", record.id)
      .eq("workspace_id", workspaceId);

    if (error) {
      console.error("[MemoryEditorPanel] delete error", error);
      setError("Delete failed.");
      setSaving(false);
      return;
    }

    setRecord(null);
    setSaving(false);
    onSaved?.();
  }

  return (
    <section
      data-layout-boundary="MemoryEditorPanel"
      className="flex-1 h-full bg-neutral-950/60 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <div className="border-b border-neutral-800 px-6 py-4">
        <h2 className="text-sm font-semibold text-neutral-200">
          Memory Editor
        </h2>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {!memoryId && (
          <div className="text-sm text-neutral-500">
            Select a memory to review or edit.
          </div>
        )}

        {loading && (
          <div className="text-sm text-neutral-500">Loading...</div>
        )}

        {record && (
          <>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">
                Type
              </label>
              <select
                className="w-full px-3 py-2 rounded-md bg-black/40 border border-neutral-700 text-sm"
                value={record.memory_type}
                onChange={(e) =>
                  setRecord({ ...record, memory_type: e.target.value })
                }
              >
                <option value="fact">Fact</option>
                <option value="identity">Identity</option>
                <option value="decision">Decision</option>
                <option value="insight">Insight</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1">
                Content
              </label>
              <textarea
                className="w-full h-48 px-3 py-2 rounded-md bg-black/40 border border-neutral-700 text-sm"
                value={record.content}
                onChange={(e) =>
                  setRecord({ ...record, content: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Confidence
                </label>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full px-2 py-1 rounded-md bg-black/40 border border-neutral-700 text-sm"
                  value={record.confidence}
                  onChange={(e) =>
                    setRecord({
                      ...record,
                      confidence: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Sensitivity
                </label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  className="w-full px-2 py-1 rounded-md bg-black/40 border border-neutral-700 text-sm"
                  value={record.sensitivity}
                  onChange={(e) =>
                    setRecord({
                      ...record,
                      sensitivity: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Emotional Weight
                </label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  className="w-full px-2 py-1 rounded-md bg-black/40 border border-neutral-700 text-sm"
                  value={record.emotional_weight}
                  onChange={(e) =>
                    setRecord({
                      ...record,
                      emotional_weight: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400">{error}</div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {record && (
        <div className="border-t border-neutral-800 px-6 py-4 flex items-center justify-between">
          <button
            onClick={remove}
            disabled={saving}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Delete
          </button>

          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </section>
  );
}
