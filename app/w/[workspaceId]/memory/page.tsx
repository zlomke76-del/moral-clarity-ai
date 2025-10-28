// app/w/[workspaceId]/memory/page.tsx
import { listMemories, createMemory, type MemoryListRow } from "@/lib/mca-rest";
import Link from "next/link";
import { revalidatePath } from "next/cache";

type PageProps = { params: { workspaceId: string } };

export const dynamic = "force-dynamic";

// Server Action: create memory
async function createMemoryAction(formData: FormData) {
  "use server";
  const workspaceId = String(formData.get("workspace_id") || "");
  const title = (formData.get("title") || "").toString().trim();
  const content = (formData.get("content") || "").toString().trim();

  if (!workspaceId) throw new Error("workspace_id required");
  if (!title) throw new Error("title required");

  await createMemory(workspaceId, title, content || undefined);
  revalidatePath(`/w/${workspaceId}/memory`);
}

export default async function WorkspaceMemoryList({ params }: PageProps) {
  const workspaceId = params.workspaceId;

  let memories: MemoryListRow[] = [];
  let errMsg: string | null = null;

  try {
    memories = await listMemories(workspaceId);
  } catch (e: any) {
    errMsg = e?.message ?? String(e);
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Memories</h1>
        <p className="text-sm text-zinc-500">Workspace: {workspaceId}</p>
      </header>

      <section className="rounded-lg border p-4">
        <h2 className="text-base font-medium mb-3">New memory</h2>
        <form action={createMemoryAction} className="space-y-3">
          <input type="hidden" name="workspace_id" value={workspaceId} />
          <input
            name="title"
            placeholder="Title"
            className="w-full rounded border px-3 py-2"
          />
          <textarea
            name="content"
            rows={6}
            placeholder="Content…"
            className="w-full rounded border px-3 py-2"
          />
          <button
            type="submit"
            className="rounded bg-black text-white px-4 py-2 hover:opacity-90"
          >
            Create
          </button>
        </form>
      </section>

      <section className="rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-base font-medium">Recent</h2>
        </div>
        {errMsg ? (
          <div className="p-4 text-red-600">Failed to load: {errMsg}</div>
        ) : memories.length === 0 ? (
          <div className="p-4 text-zinc-600">No memories yet.</div>
        ) : (
          <ul className="divide-y">
            {memories.map((m) => (
              <li key={m.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/memory/${m.id}`}
                    className="font-medium hover:underline break-words"
                  >
                    {m.title || "(untitled)"}
                  </Link>
                  <div className="text-xs text-zinc-500">
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
                <Link
                  href={`/memory/${m.id}/edit`}
                  className="text-sm rounded border px-3 py-1 hover:bg-zinc-50 whitespace-nowrap"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
