"use client";

import { useEffect, useState } from "react";

export type MemoryRecord = {
  id: string;
  content: string;
  memory_type: string;
  confidence?: number;
  sensitivity?: number;
  updated_at?: string;
};

type Props = {
  memory: MemoryRecord | null;
  onChange?: (updated: Partial<MemoryRecord>) => void;
  onSave?: () => void;
};

export default function MemoryEditorPanel({
  memory,
  onChange,
  onSave,
}: Props) {
  const [content, setContent] = useState("");
  const [memoryType, setMemoryType] = useState("fact");

  useEffect(() => {
    if (!memory) return;
    setContent(memory.content ?? "");
    setMemoryType(memory.memory_type ?? "fact");
  }, [memory]);

  if (!memory) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
        Select a memory to view or edit.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-200">
          Memory Editor
        </h2>

        {memory.updated_at && (
          <span className="text-xs text-neutral-500">
            Last updated {new Date(memory.updated_at).toLocaleString()}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs text-neutral-400">
          Memory type
        </label>
        <select
          className="w-full rounded-md border border-neutral-700 bg-black/40 px-3 py-2 text-sm"
          value={memoryType}
          onChange={(e) => {
            const value = e.target.value;
            setMemoryType(value);
            onChange?.({ memory_type: value });
          }}
        >
          <option value="fact">Fact</option>
          <option value="identity">Identity</option>
          <option value="insight">Insight</option>
          <option value="decision">Decision</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-neutral-400">
          Content
        </label>
        <textarea
          className="w-full min-h-[180px] rounded-md border border-neutral-700 bg-black/40 px-3 py-2 text-sm leading-relaxed"
          value={content}
          onChange={(e) => {
            const value = e.target.value;
            setContent(value);
            onChange?.({ content: value });
          }}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          className="rounded-md border border-neutral-700 px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-800"
          onClick={() => {
            setContent(memory.content ?? "");
            setMemoryType(memory.memory_type ?? "fact");
          }}
        >
          Reset
        </button>

        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}
