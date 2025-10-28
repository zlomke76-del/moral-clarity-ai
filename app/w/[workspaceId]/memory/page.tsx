// app/w/[workspaceId]/memory/page.tsx
import { listMemories, createMemory, type MemoryListRow, getWorkspaceById } from "@/lib/mca-rest";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import Breadcrumb from "@/components/Breadcrumb";
import NewMemoryDock from "@/components/NewMemoryDock";

type PageProps = { params: { workspaceId: string } };

export const dynamic = "force-dynamic";

// --- Server action used by the floating dock ---
async function createMemoryAction(formData: FormData) {
  "use server";
  const workspaceId = String(formData.get("workspace_id") || "");
  const title = (formData.get("title") || "").toString().trim();
  const content = (formData.get("content") || "").toString();

  if (!workspaceId) throw new Error("workspace_id required");
  if (!title) throw new Error("title required");

  await createMemory(workspaceId, title, content || undefined);
  revalidatePath(`/w/${workspaceId}/memory`);
}

export default async function WorkspaceMemoryList({ params }: PageProps) {
  const workspaceId = params.workspaceId;

  const [ws, memoriesOrErr] = await Promise.allSettled([
    getWorkspaceById(workspaceId),
    listMemories(workspaceId),
  ]);

  const workspace = ws.status === "fulfilled" ? ws.value : null;
  const memories = memoriesOrErr.status === "fulfilled" ? memoriesOrErr.value : [];
  const errMsg =
    memoriesOrErr.status === "rejected" ? (memoriesOrErr.reason as Error).message : null;

  return (
    <main className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Memory", href: "/memories" },
          { label: workspace?.name ?? workspaceId },
        ]}
      />

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Memories</h1>
        <p className="text-sm text-neutral-400">Workspace: {workspace?.name ?? workspaceId}</p>
      </header>

      {/* List */}
      <section className="rounded-lg border border-neutral-800">
        <div className="p-4 border-b border-neutral-800">
          <h2 className="text-base font-medium">Recent</h2>
        </div>
        {errMsg ? (
          <div className="p-4 text-red-400">Failed to load: {errMsg}</div>
        ) : memories.length === 0 ? (
          <div className="p-4 text-neutral-400">No memories yet. Use “+ New Memory” to create one.</div>
        ) : (
          <ul className="divide-y divide-neutral-800">
            {memories.map((m: MemoryListRow) => (
              <li key={m.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/memory/${m.id}`} className="font-medium hover:underline break-words">
                    {m.title || "(untitled)"}
                  </Link>
                  <div className="text-xs text-neutral-500">
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
                <Link
                  href={`/memory/${m.id}/edit`}
                  className="text-sm rounded border border-neutral-800 px-3 py-1 hover:bg-neutral-900 whitespace-nowrap"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Floating dock (FAB + slide-up form) */}
      <NewMemoryDock workspaceId={workspaceId} createAction={createMemoryAction} />
    </main>
  );
}
