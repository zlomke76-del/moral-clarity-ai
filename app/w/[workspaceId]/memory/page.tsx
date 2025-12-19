// app/w/[workspaceId]/memory/page.tsx

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClientServer } from "@/lib/supabase/server";
import MemoryComposer from "@/components/MemoryComposer";
import MemoryList from "@/components/MemoryList";

type Props = {
  params: {
    workspaceId: string;
  };
};

export default async function WorkspaceMemoryPage({ params }: Props) {
  const workspaceId = decodeURIComponent(params.workspaceId);

  const supabase = await createClientServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("[WorkspaceMemoryPage] auth error", authError);
    return null;
  }

  const { data, error } = await supabase
    .schema("memory")
    .from("memories")
    .select(
      "id, content, created_at, memory_type, is_active"
    )
    .eq("user_id", user.id)
    .eq("memory_type", "fact")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[WorkspaceMemoryPage] load error", error);
  }

  return (
    <section
      data-layout-boundary="WorkspaceMemoryPage"
      className="space-y-8"
    >
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Long Term Memory
          </h1>
          <p className="text-sm text-neutral-400">
            Factual memories stored for this account
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
        <div data-layout-boundary="MemoryComposer">
          <MemoryComposer workspaceId={workspaceId} />
        </div>

        <div data-layout-boundary="MemoryList">
          <MemoryList
            items={Array.isArray(data) ? data : []}
          />
        </div>
      </div>
    </section>
  );
}
