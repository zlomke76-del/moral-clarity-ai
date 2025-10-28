// app/w/[workspaceId]/memory/page.tsx
// Server component that renders the memory list via Supabase REST
// to avoid supabase-js generic recursion. Clean, fast, and typed.

import Link from "next/link";
import { listMemories, type MemoryListRow } from "@/lib/mca-rest";

type PageProps = { params: { workspaceId: string } };

export const dynamic = "force-dynamic"; // always SSR (no cached user data)

export default async function MemoryPage({ params }: PageProps) {
  const workspaceId = params.workspaceId;

  let memories: MemoryListRow[] = [];
  try {
    memories = await listMemories(workspaceId);
  } catch (e: any) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-2">Memory</h1>
        <p className="text-red-600">
          Failed to load memories: {e?.message ?? String(e)}
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Your Memories</h1>
        <p className="text-sm text-zinc-500">
          Workspace:{" "}
          <code className="px-1 py-0.5 bg-zinc-100 rounded">{workspaceId}</code>
        </p>
      </header>

      {memories.length === 0 ? (
        <p className="text-zinc-600">No memories yet.</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 overflow-hidden">
          {memories.map((m) => (
            <li key={m.id} className="p-4 hover:bg-zinc-50">
              <div className="flex items-center justify-between gap-4">
                <Link
                  className="font-medium text-blue-600 hover:underline"
                  href={`/memory/${m.id}`}
                >
                  {m.title || "(untitled)"}
                </Link>
                <time className="text-xs text-zinc-500">
                  {new Date(m.created_at).toLocaleString()}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
