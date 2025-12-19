"use client";

export type MemoryRecord = {
  id: string;
  content: string;
  memory_type: string;
  updated_at: string;
};

type Props = {
  memory: MemoryRecord | null;
  onSave: (memory: MemoryRecord) => void;
};

export default function MemoryEditorPanel({ memory, onSave }: Props) {
  if (!memory) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-neutral-500">
        Select a memory to view or edit
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <textarea
        className="flex-1 w-full resize-none rounded border border-neutral-800 bg-neutral-900 p-4 text-sm outline-none"
        value={memory.content}
        onChange={(e) => {
          memory.content = e.target.value;
        }}
      />

      <div className="flex justify-end">
        <button
          onClick={() => onSave(memory)}
          className="rounded bg-emerald-600 px-4 py-2 text-sm hover:bg-emerald-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}
