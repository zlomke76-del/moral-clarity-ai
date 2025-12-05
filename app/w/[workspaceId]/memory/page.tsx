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

  // Must await the server client
  const sb = await supabaseServer();

  const { data, error } = await sb
    .schema("mca")
    .from("memories")
    .select("id, title, content, created_at, kind, user_key")
    .eq("workspace_id", workspaceId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = Array.isArray(data) ? data : [];

  return (
    <section className="space-y-8 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Workspace Memories
          </h1>
          <p className="text-sm text-neutral-400 break-all">
            Workspace: {workspaceId}
          </p>
        </div>

        <Link
          href={`/w/${workspaceId}`}
          className="text-sm text-neutral-300 hover:text-white underline underline-offset-4"
        >
          Back to workspace
        </Link>
      </header>

      <MemoryComposer workspaceId={workspaceId} />

      <MemoryList
        items={rows}
        workspaceId={workspaceId}
        emptyHint="No memories yet. Add your first above."
      />
    </section>
  );
}


