// app/w/[workspaceId]/memory/page.tsx
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import MemoryComposer from "@/components/MemoryComposer";
import MemoryList from "@/components/MemoryList";

export const dynamic = "force-dynamic";

export default async function WorkspaceMemoryPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const workspaceId = decodeURIComponent(params.workspaceId);

  const supabase = await supabaseServer();

  // Get the signed in user (email)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userEmail = user?.email ?? "";

  // Fetch workspace memories for this user
  const { data: memories } = await supabase
    .from("memories")
    .select("id, title, content, created_at, kind")
    .eq("workspace_id", workspaceId)
    .eq("user_email", userEmail)
    .order("created_at", { ascending: false });

  return (
    <section className="space-y-8 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Workspace Memories
          </h1>
          <p className="text-sm text-neutral-400">
            Workspace: <code>{workspaceId}</code>
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
        <MemoryList items={memories ?? []} emptyHint="No memories yet." />
      </div>
    </section>
  );
}


