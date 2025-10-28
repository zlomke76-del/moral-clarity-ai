// app/memory/[id]/edit/page.tsx
import { getMemoryById, updateMemory, deleteMemory } from "@/lib/mca-rest";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";

type PageProps = { params: { id: string } };

export const dynamic = "force-dynamic";

// Server Action: update memory
async function updateMemoryAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const workspaceId = String(formData.get("workspace_id") || "");
  const title = (formData.get("title") || "").toString().trim();
  const contentRaw = (formData.get("content") || "").toString();
  const content = contentRaw.length ? contentRaw : null;

  if (!id || !workspaceId) throw new Error("id and workspace_id required");
  if (!title) throw new Error("title required");

  await updateMemory(id, { title, content });
  revalidatePath(`/memory/${id}`);
  revalidatePath(`/w/${workspaceId}/memory`);
  redirect(`/memory/${id}`);
}

// Server Action: delete memory
async function deleteMemoryAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  const workspaceId = String(formData.get("workspace_id") || "");
  if (!id || !workspaceId) throw new Error("id and workspace_id required");

  await deleteMemory(id);
  revalidatePath(`/w/${workspaceId}/memory`);
  redirect(`/w/${workspaceId}/memory`);
}

export default async function EditMemory({ params }: PageProps) {
  const id = params.id;
  const mem = await getMemoryById(id);

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
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Edit Memory</h1>
        <p className="text-sm text-zinc-500">
          <span>ID: {mem.id}</span>
          <span className="mx-2">•</span>
          <span>Workspace: {mem.workspace_id}</span>
        </p>
      </header>

      <section className="rounded-lg border p-4 space-y-3">
        <form action={updateMemoryAction} className="space-y-3">
          <input type="hidden" name="id" value={mem.id} />
          <input type="hidden" name="workspace_id" value={mem.workspace_id} />
          <input
            name="title"
            defaultValue={mem.title ?? ""}
            placeholder="Title"
            className="w-full rounded border px-3 py-2"
          />
          <textarea
            name="content"
            defaultValue={mem.content ?? ""}
            rows={12}
            placeholder="Content…"
            className="w-full rounded border px-3 py-2"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded bg-black text-white px-4 py-2 hover:opacity-90"
            >
              Save changes
            </button>
            <Link
              href={`/memory/${mem.id}`}
              className="rounded border px-4 py-2 hover:bg-zinc-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>

      <section className="rounded-lg border p-4 space-y-3">
        <h2 className="text-base font-medium text-red-600">Danger zone</h2>
        <form action={deleteMemoryAction}>
          <input type="hidden" name="id" value={mem.id} />
          <input type="hidden" name="workspace_id" value={mem.workspace_id} />
          <button
            type="submit"
            className="rounded bg-red-600 text-white px-4 py-2 hover:opacity-90"
          >
            Delete memory
          </button>
        </form>
      </section>
    </main>
  );
}
