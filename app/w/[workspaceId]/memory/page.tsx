// app/w/[workspaceId]/memory/page.tsx

import MemoryWorkspaceClient from "./MemoryWorkspaceClient";

export const dynamic = "force-dynamic";

export default async function WorkspaceMemoryPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <section className="w-full h-full min-h-0 flex flex-col overflow-hidden">
      {/* Fixed header */}
      <header className="flex-shrink-0 px-8 py-6 border-b border-neutral-800">
        <h1 className="text-2xl font-semibold tracking-tight">
          Workspace Memories
        </h1>
        <p className="text-sm text-neutral-400">
          Long-term factual memory only
        </p>
      </header>

      {/* Client owns remaining height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MemoryWorkspaceClient
          workspaceId={workspaceId}
          initialItems={[]}
        />
      </div>
    </section>
  );
}
