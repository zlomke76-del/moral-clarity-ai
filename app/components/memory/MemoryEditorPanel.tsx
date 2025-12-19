"use client";

import { useEffect, useState } from "react";

export type MemoryRecord = {
  id: string;
  memory_type: string;
  content: string;
  created_at?: string;
  updated_at?: string;
};

type Props = {
  memory: MemoryRecord | null;
  onChange?: (updated: MemoryRecord) => void;
  onSave?: (memory: MemoryRecord) => void;
};

export default function MemoryEditorPanel({
  memory,
  onChange,
  onSave,
}: Props) {
  const [draft, setDraft] = useState<MemoryRecord | null>(memory);

  useEffect(() => {
    setDraft(memory);
  }, [memory?.id]);

  if (!draft) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
        Select a memory to review or edit.
      </div>
    );
  }

  function update<K extends keyof MemoryRecord>(
    key: K,
    value: MemoryRecord[K]
  ) {
    const next = { ...draft, [key]: value };
    setDraft(next);
    onChange?.(next);
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-200">
          Memory Editor
        </h2>

        <span className="text-xs text-neutral-500 capitalize">
          {draft.memory_type}
        </span>
      </div>

      <div className="space-y-3">
        <label className="block text-xs text-neutral-400">
          Type
        </label>
        <select
          value={draft.memory_type}
          onChange={(e) =>
            update("memory_type", e.target.value)
          }
          className="w-full rounded-md bg-black/40 border border-neutral-700 px-3 py-2 text-sm text-neutral-200"
        >
          <option value="fact">Fact</option>
          <option value="identity">Identity</option>
          <option value="insight">Insight</option>
          <option value="decision">Decision</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-xs text-neutral-400">
          Content
        </label>
        <textarea
          value={draft.content}
          onChange={(e) =>
            update("content", e.target.value)
          }
          className="w-full min-h-[160px] rounded-md bg-black/40 border border-neutral-700 px-3 py-2 text-sm text-neutral-200"
          placeholder="Edit memory content..."
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-neutral-500">
          {draft.updated_at
            ? `Last updated ${new Date(
                draft.updated_at
              ).toLocaleString()}`
            : "Unsaved memory"}
        </div>

        <button
          type="button"
          onClick={() => onSave?.(draft)}
          className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500"
        >
          Save
        </button>
      </div>
    </div>
  );
}
