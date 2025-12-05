"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";

type Item = {
  id: string;
  title?: string | null;
  content?: string | null;
  created_at?: string | null;
  user_key?: string | null;
  kind?: string | null;
};

export default function MemoryList({
  items,
  workspaceId,
  emptyHint = "Nothing here yet.",
}: {
  items: Item[];
  workspaceId: string;
  emptyHint?: string;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function onDelete(id: string) {
    try {
      const res = await fetch(`/api/memory?id=${id}`, {
        method: "DELETE",
      });
      const j = await res.json();

      if (!res.ok) return toast(j?.error ?? "Failed to delete");

      toast("Deleted.");
      window.location.reload();
    } catch (err) {
      toast("Delete failed.");
    }
  }

  if (!items?.length) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
        {emptyHint}
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 bg-neutral-900/40">
      {items.map((m) => {
        const open = expandedId === m.id;
        return (
          <div key={m.id} className="px-4 py-3 space-y-2">
            <div className="flex items-center justify-between">
              <div
                className="truncate cursor-pointer"
                onClick={() => setExpandedId(open ? null : m.id)}
              >
                <div className="text-sm font-medium text-neutral-100 truncate">
                  {m.title || "(untitled)"}
                </div>
                <div className="text-xs text-neutral-400">
                  {m.created_at
                    ? new Date(m.created_at).toLocaleString()
                    : "—"}
                </div>
              </div>

              <button
                onClick={() => onDelete(m.id)}
                className="text-xs text-red-300 hover:text-red-400"
              >
                delete
              </button>
            </div>

            {open && m.content && (
              <pre className="whitespace-pre-wrap text-sm text-neutral-300 bg-black/20 p-3 rounded-lg border border-neutral-800">
                {m.content}
              </pre>
            )}
          </div>
        );
      })}
    </div>
  );
}
