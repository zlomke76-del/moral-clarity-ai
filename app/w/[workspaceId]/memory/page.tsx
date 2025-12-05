// app/w/[workspaceId]/memory/page.tsx
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase";
import MemoryComposer from "@/components/MemoryComposer";
import MemoryList from "@/components/MemoryList";

export const dynamic = "force-dynamic";

export default async function WorkspaceMemoryPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const workspaceId = decodeURIComponent(params.workspaceId);

  // Build authenticated server-side client
  const sb = await supabaseServer();

  // Fetch memories from the *public* schema
  const { data, error } = await sb
    .from("memories")
    .select(
      `
      id,
      title,
      content,
      created_at,
      workspace_id
    `
    )
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = Array.isArray(data) && !error ? data : [];

  return (
    <section className="space-y-8 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Workspace Memories
          </h1>

          <p className="text-sm text-neutral-400">
            Workspace:{" "}
            <code className="text-neutral-300 break-all">{workspaceId}</code>
          </p>
        </div>

        <Link
          href={`/w/${workspaceId}`}
          className="text-sm text-neutral-300 hover:text-white underline underline-offset-4"
        >
          Back to workspace
        </Link>
      </header>

      <div className="space-y-6">
        {/* Composer */}
        <MemoryComposer workspaceId={workspaceId} />

        {/* Memory list */}
        <MemoryList
          items={rows}
          emptyHint="No memories yet. Add your first above."
        />
      </div>
    </section>
  );
}




