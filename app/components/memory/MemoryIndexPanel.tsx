"use client";

import { MemoryRecord } from "./MemoryEditorPanel";

type Props = {
  workspaceId: string;
  initialItems: MemoryRecord[];
  onSelect: (m: MemoryRecord) => void;
};

export default function MemoryIndexPanel({
  initialItems,
  onSelect,
}: Props) {
  return (
    <ul className="divide-y divide-neutral-800">
      {initialItems.map((m) => (
        <li
          key={m.id}
          onClick={() => onSelect(m)}
          className="p-4 cursor-pointer hover:bg-neutral-900"
        >
          <div className="text-sm text-neutral-300 truncate">
            {m.content}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            {new Date(m.updated_at).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
}
