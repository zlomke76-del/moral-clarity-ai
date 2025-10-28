// app/w/[workspaceId]/memory/page.tsx
import { supaMca } from "@/server/supabase-clients";
import Link from "next/link";

type PageProps = { params: { workspaceId: string } };

// Always render this page dynamically (server-rendered)
export const dynamic = "force-dynamic";

// Lightweight type to avoid Supabase/TypeScript recursion
type MemoryListRow = {
  id: string;
  title: string | null;
  created_at: string;
  workspace_id: string;
};

export default async function MemoryPage({ params }: PageProps) {
  const workspaceId = params.workspaceId;

  // Fetch memories for the given workspace
  const { data: memories, error } = await supaMca
    .from<MemoryListRow>("memories")
    .select("id,title,created_at,workspace_id")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to load memories:", error.message);
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-4">Error Loading Memories</h1>
        <p className="text-red-600">{error.message}</p>
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

      {(!memories || memories.length === 0) && (
        <p className="text-zinc-600">No memories yet.</p>
      )}

      <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 overflow-hidden">
        {memories?.map((m) => (
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
    </main>
  );
}
