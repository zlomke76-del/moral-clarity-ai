// app/w/[workspaceId]/memory/page.tsx

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClientServer } from "@/lib/supabase/server";
import MemoryComposer from "@/components/MemoryComposer";
import MemoryList from "@/components/MemoryList";
import LayoutDiagnosticsBoundary from "@/components/LayoutDiagnosticsBoundary";

type Props = {
  params: {
    workspaceId: string;
  };
};

export default async function WorkspaceMemoryPage({ params }: Props) {
  const workspaceId = decodeURIComponent(params.workspaceId);

  console.log("[LAYOUT-PAGE]", {
    page: "WorkspaceMemoryPage",
    workspaceId,
    runtime: "nodejs",
    dynamic: true,
  });

  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from("user_memories")
    .select("id, title, created_at, workspace_id")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[workspace memory] Load error:", error);
  }

  return (
    <LayoutDiagnosticsBoundary id="WorkspaceMemoryPage">
      <section className="space-y-8 p-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Workspace Memories
            </h1>
            <p className="text-sm text-neutral-400">
              Workspace:{" "}
              <code className="text-neutral-300 break-all">
                {workspaceId}
              </code>
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
          <LayoutDiagnosticsBoundary id="MemoryComposer">
            <MemoryComposer workspaceId={workspaceId} />
          </LayoutDiagnosticsBoundary>

          <LayoutDiagnosticsBoundary id="MemoryList">
            <MemoryList items={Array.isArray(data) ? data : []} />
          </LayoutDiagnosticsBoundary>
        </div>
      </section>
    </LayoutDiagnosticsBoundary>
  );
}
