"use client";

export type MemoryRecord = {
  id: string;
  content: string;
  memory_type: string;
  updated_at: string;
};

type Props = {
  memory: MemoryRecord | null;
  onSave: (m: MemoryRecord) => void;
};

export default function MemoryEditorPanel({ memory, onSave }: Props) {
  if (!memory) {
    return (
      <div className="text-neutral-500 text-sm">
        Select a memory to edit
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <textarea
        className="flex-1 w-full resize-none bg-neutral-900 border border-neutral-700 rounded p-4 text-sm"
        value={memory.content}
        onChange={(e) =>
          (memory.content = e.target.value)
        }
      />

      <button
        onClick={() => onSave(memory)}
        className="self-end px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-sm"
      >
        Save
      </button>
    </div>
  );
}
