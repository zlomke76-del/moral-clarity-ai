// app/w/[workspaceId]/memory/page.tsx
import Link from "next/link";
import { listMemories, type MemoryListRow } from "@/lib/mca-rest";
import { supaServiceMca } from "@/server/supabase-clients";
import { revalidatePath } from "next/cache";

type PageProps = { params: { workspaceId: string } };

export const dynamic = "force-dynamic";

// Server Action: create a memory (title + optional content)
async function createMemoryAction(formData: FormData) {
  "use server";
  const workspaceId = String(formData.get("workspace_id") || "");
  const title = (formData.get("title") || "").toString().trim();
  const content = (formData.get("content") || "").toString().trim();

  if (!workspaceId) throw new Error("workspace_id required");
  if (!title) throw new Error("title required");

  const { error } = await supaServiceMca
    .from("memories")
    .insert({ workspace_id: workspaceId, title, ...(content ? { content } : {}) });

  if (error) throw new Error(error.message);

  // Refresh the list
  revalidatePath(`/w/${workspaceId}/memory`);
}

export default async function MemoryPage({ params }: PageProps) {
  const workspaceId = params.workspaceId;

  let memories: MemoryListRow[] = [];
  try {
    memories = await listMemories(workspaceId);
  } catch (e: any) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-2">Memory</h1>
        <p className="text-red-600">Failed to load memories: {e?.message ?? String(e)}</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Your Memories</h1>
        <p className="text-sm text-zinc-500">
          Workspace:{" "}
          <code className="px-1 py-0.5 bg-zinc-100 rounded">{workspaceId}</code>
        </p>
      </header>

      <section className="rounded-lg border p-4 space-y-3">
        <h2 className="text-base font-medium">Create a new memory</h2>
        <form action={createMemoryAction} className="space-y-3">
          <input type="hidden" name="workspace_id" value={workspaceId} />
          <input
            name="title"
            placeholder="Title"
            className="w-full rounded border px-3 py-2"
          />
          <textarea
            name="content"
            placeholder="Optional content…"
            rows={4}
            className="w-full rounded border px-3 py-2"
          />
          <button
            type="submit"
            className="rounded bg-black text-white px-4 py-2 hover:opacity-90"
          >
            Save
          </button>
        </form>
      </section>

      <section>
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
      </section>
    </main>
  );
}
