// app/w/[workspaceId]/memory/page.tsx

import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import MemoryComposer from "@/components/MemoryComposer";
import MemoryList from "@/components/MemoryList";

export const dynamic = "force-dynamic";

export default async function WorkspaceMemoryPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const workspaceId = decodeURIComponent(params.workspaceId);

  // Supabase server client
  const sb = await supabaseServer();

  const { data, error } = await sb
    .from("user_memories")
    .select("id, title, created_at, workspace_id")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = !error && Array.isArray(data) ? data : [];

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
        <MemoryComposer workspaceId={workspaceId} />

        <MemoryList
          items={rows}
          emptyHint="No memories yet. Add your first above."
        />
      </div>
    </section>
  );
}


