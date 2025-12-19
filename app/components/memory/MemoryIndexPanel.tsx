"use client";

import { MemoryRecord } from "./MemoryEditorPanel";

type Props = {
  workspaceId: string;
  initialItems: MemoryRecord[];
  onSelect: (record: MemoryRecord) => void;
};

export default function MemoryIndexPanel({
  initialItems,
  onSelect,
}: Props) {
  return (
    <div className="h-full overflow-y-auto">
      <ul className="divide-y divide-neutral-800">
        {initialItems.map((m) => (
          <li
            key={m.id}
            onClick={() => onSelect(m)}
            className="cursor-pointer px-4 py-3 hover:bg-neutral-900"
          >
            <div className="truncate text-sm text-neutral-200">
              {m.content}
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              {new Date(m.updated_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
