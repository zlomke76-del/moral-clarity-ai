// /components/MemoryList.tsx
type Item = { id: string; title?: string | null; created_at?: string | null };

export default function MemoryList({
  items,
  emptyHint = 'Nothing here yet.',
}: {
  items: Item[];
  emptyHint?: string;
}) {
  if (!items?.length) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
        {emptyHint}
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 bg-neutral-900/40">
      {items.map((m) => (
        <div key={m.id} className="flex items-center justify-between px-4 py-3">
          <div className="truncate">
            <div className="truncate text-sm font-medium text-neutral-100">
              {m.title || '(untitled)'}
            </div>
            <div className="text-xs text-neutral-400">
              {m.created_at ? new Date(m.created_at).toLocaleString() : '—'}
            </div>
          </div>
          <div className="text-xs text-neutral-500">#{m.id.slice(0, 8)}</div>
        </div>
      ))}
    </div>
  );
}
