"use client";

import { useState } from "react";

export type MemoryRecord = {
  id: string;
  content: string;
  memory_type: string;
  updated_at: string;
};

type Props = {
  workspaceId: string;
  selected?: MemoryRecord | null;
};

export default function MemoryEditorPanel({
  selected,
}: Props) {
  const [content, setContent] = useState(selected?.content ?? "");

  if (!selected) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-neutral-500">
        Select a memory to view or edit
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 p-6">
      <div className="text-xs text-neutral-500">
        {selected.memory_type} •{" "}
        {new Date(selected.updated_at).toLocaleString()}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 w-full rounded-md bg-neutral-950 border border-neutral-800 p-4 text-sm text-neutral-100 resize-none focus:outline-none focus:ring-1 focus:ring-neutral-700"
      />

      <div className="flex justify-end">
        <button
          disabled
          className="px-4 py-2 rounded-md text-sm bg-neutral-800 text-neutral-400 cursor-not-allowed"
        >
          Save (wired next)
        </button>
      </div>
    </div>
  );
}
