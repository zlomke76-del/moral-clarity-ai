"use client";

import { useState } from "react";
import type { MemoryRecord } from "./MemoryEditorPanel";

type Props = {
  items: MemoryRecord[];
  pageSize?: number;
  selectedId?: string | null;
  onSelect?: (memory: MemoryRecord) => void;
};

export default function MemoryIndexPanel({
  items,
  pageSize = 20,
  selectedId,
  onSelect,
}: Props) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = page * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-neutral-200">
          Memories
        </h2>

        <span className="text-xs text-neutral-500">
          {items.length} total
        </span>
      </div>

      <div className="divide-y divide-neutral-800 rounded-md border border-neutral-800 overflow-hidden">
        {pageItems.length === 0 && (
          <div className="p-4 text-sm text-neutral-400">
            No memories found.
          </div>
        )}

        {pageItems.map((m) => {
          const active = m.id === selectedId;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect?.(m)}
              className={[
                "w-full text-left px-4 py-3 text-sm transition",
                "hover:bg-neutral-800/60",
                active ? "bg-neutral-800 text-white" : "text-neutral-300",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">
                  {m.memory_type}
                </span>

                {m.updated_at && (
                  <span className="text-xs text-neutral-500">
                    {new Date(m.updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="mt-1 line-clamp-2 text-xs text-neutral-400">
                {m.content}
              </div>
            </button>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="text-xs text-neutral-400 hover:text-white disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-xs text-neutral-500">
            Page {page + 1} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() =>
              setPage((p) => Math.min(totalPages - 1, p + 1))
            }
            className="text-xs text-neutral-400 hover:text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
