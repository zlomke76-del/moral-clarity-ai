"use client";

export type MemoryRecord = {
  id: string;
  content: string;
  memory_type: string;
  updated_at: string;
};

type Props = {
  workspaceId: string;
  record: MemoryRecord | null;
};

export default function MemoryEditorPanel({
  record,
}: Props) {
  if (!record) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-neutral-500">
        Select a memory to view or edit
      </div>
    );
  }

  return (
    <div className="h-full p-6 flex flex-col gap-4">
      <div className="text-xs uppercase tracking-wide text-neutral-400">
        {record.memory_type}
      </div>

      <textarea
        className="flex-1 w-full rounded-md bg-neutral-900 border border-neutral-800 p-4 text-sm text-neutral-200 resize-none"
        defaultValue={record.content}
      />

      <div className="text-xs text-neutral-500">
        Last updated: {new Date(record.updated_at).toLocaleString()}
      </div>
    </div>
  );
}
