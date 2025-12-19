"use client";

import { useState } from "react";

type MemoryItem = {
  id: string;
  content: string;
  created_at: string;
};

type Props = {
  items: MemoryItem[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
};

export default function MemoryIndexPanel({
  items,
  selectedId,
  onSelect,
}: Props) {
  return (
    <aside className="w-[320px] shrink-0 border-r border-neutral-800 bg-neutral-950/60">
      <div className="p-4 text-sm font-medium text-neutral-300">
        Memories
      </div>

      <div className="overflow-y-auto">
        {items.length === 0 && (
          <div className="px-4 py-6 text-sm text-neutral-500">
            No memories yet.
          </div>
        )}

        {items.map((m) => {
          const active = m.id === selectedId;
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className={[
                "w-full text-left px-4 py-3 border-l-2 transition",
                active
                  ? "border-blue-500 bg-neutral-900 text-white"
                  : "border-transparent hover:bg-neutral-900/60 text-neutral-400",
              ].join(" ")}
            >
              <div className="truncate text-sm">
                {m.content || "Untitled memory"}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {new Date(m.created_at).toLocaleDateString()}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
