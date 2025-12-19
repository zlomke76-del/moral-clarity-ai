"use client";

import { useEffect, useState } from "react";

type MemoryItem = {
  id: string;
  content: string;
};

type Props = {
  memory?: MemoryItem | null;
  onSave?: (content: string) => void;
};

export default function MemoryEditorPanel({ memory, onSave }: Props) {
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(memory?.content ?? "");
  }, [memory?.id]);

  if (!memory) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-500">
        Select a memory to view or edit.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-neutral-800 px-6 py-4 text-sm font-medium">
        Memory Editor
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 w-full resize-none bg-neutral-950 p-6 text-sm outline-none"
        placeholder="Edit memory content..."
      />

      <div className="border-t border-neutral-800 px-6 py-4 flex justify-end">
        <button
          onClick={() => onSave?.(content)}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
}
