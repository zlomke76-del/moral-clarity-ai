"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase/client";

type MemoryRow = {
  id: string;
  content: string;
  memory_type: string;
  updated_at: string;
};

type Props = {
  workspaceId: string;
  pageSize?: number;
  onSelect: (memoryId: string) => void;
};

export default function MemoryIndexPanel({
  workspaceId,
  pageSize = 25,
  onSelect,
}: Props) {
  const supabase = createClientBrowser();

  const [items, setItems] = useState<MemoryRow[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  async function loadPage(targetPage: number, reset = false) {
    if (!workspaceId) return;

    setLoading(true);

    const from = targetPage * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("memory.memories")
      .select("id, content, memory_type, updated_at")
      .eq("workspace_id", workspaceId)
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("[MemoryIndexPanel] load error", error);
      setLoading(false);
      return;
    }

    const rows = Array.isArray(data) ? data : [];

    setItems(reset ? rows : rows);
    setPage(targetPage);
    setHasMore(rows.length === pageSize);
    setLoading(false);
  }

  return (
    <aside
      data-layout-boundary="MemoryIndexPanel"
      className="h-full border-r border-neutral-800 bg-neutral-950/60 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-800">
        <h2 className="text-sm font-semibold text-neutral-200">
          Memories
        </h2>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 && !loading && (
          <div className="px-4 py-6 text-sm text-neutral-500">
            No memories found.
          </div>
        )}

        <ul className="divide-y divide-neutral-800">
          {items.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => onSelect(m.id)}
                className="w-full text-left px-4 py-3 hover:bg-neutral-900 transition"
              >
                <div className="text-xs uppercase text-neutral-500 mb-1">
                  {m.memory_type}
                </div>
                <div className="text-sm text-neutral-200 line-clamp-2">
                  {m.content}
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  {new Date(m.updated_at).toLocaleString()}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination */}
      <div className="border-t border-neutral-800 px-4 py-3 flex items-center justify-between">
        <button
          disabled={page === 0 || loading}
          onClick={() => loadPage(page - 1)}
          className="text-xs text-neutral-300 disabled:text-neutral-600"
        >
          Prev
        </button>

        <span className="text-xs text-neutral-500">
          Page {page + 1}
        </span>

        <button
          disabled={!hasMore || loading}
          onClick={() => loadPage(page + 1)}
          className="text-xs text-neutral-300 disabled:text-neutral-600"
        >
          Next
        </button>
      </div>
    </aside>
  );
}
