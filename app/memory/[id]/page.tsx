// app/memory/[id]/page.tsx
import { getMemoryById, type MemoryDetailRow } from "@/lib/mca-rest";
import Link from "next/link";

type PageProps = { params: { id: string } };

export const dynamic = "force-dynamic";

export default async function MemoryDetail({ params }: PageProps) {
  const id = params.id;

  let mem: MemoryDetailRow | null = null;
  try {
    mem = await getMemoryById(id);
  } catch (e: any) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-2">Memory</h1>
        <p className="text-red-600">Failed to load memory: {e?.message ?? String(e)}</p>
        <div className="mt-6">
          <Link href="/memories" className="text-blue-600 hover:underline">
            ← Back
          </Link>
        </div>
      </main>
    );
  }

  if (!mem) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-2">Memory not found</h1>
        <Link href="/memories" className="text-blue-600 hover:underline">
          ← Back
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{mem.title || "(untitled)"}</h1>
        <div className="text-sm text-zinc-500">
          <time>{new Date(mem.created_at).toLocaleString()}</time>
          <span className="mx-2">•</span>
          <span>Workspace: {mem.workspace_id}</span>
        </div>
      </div>

      {mem.content ? (
        <article className="prose max-w-none whitespace-pre-wrap">
          {mem.content}
        </article>
      ) : (
        <p className="text-zinc-600">No content.</p>
      )}

      <div>
        <Link href={`/w/${mem.workspace_id}/memory`} className="text-blue-600 hover:underline">
          ← Back to list
        </Link>
      </div>
    </main>
  );
}
