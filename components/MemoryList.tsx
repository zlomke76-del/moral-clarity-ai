export default function MemoryList({ items }: { items: any[] }) {
  if (!items?.length)
    return (
      <div className="text-neutral-400 text-sm">
        No memories yet. Add your first above.
      </div>
    );

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 divide-y divide-neutral-800">
      {items.map((m) => (
        <div key={m.id} className="px-4 py-3 flex justify-between">
          <div>
            <div className="text-sm font-medium text-neutral-200">
              {m.title || "(untitled)"}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {new Date(m.created_at).toLocaleString()}
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              importance: {m.importance}
            </div>
          </div>

          <div className="text-xs text-neutral-600">#{m.id.slice(0, 8)}</div>
        </div>
      ))}
    </div>
  );
}

