// app/w/[workspaceId]/memory/page.tsx
import MemoryWorkspaceClient from "./MemoryWorkspaceClient";

type PageProps = {
  params: {
    workspaceId: string;
  };
};

export default async function WorkspaceMemoryPage({
  params,
}: PageProps) {
  const { workspaceId } = params;

  return (
    <section className="w-full h-full flex flex-col">
      <header className="px-8 py-6 border-b border-neutral-800">
        <h1 className="text-2xl font-semibold tracking-tight">
          Workspace Memories
        </h1>
        <p className="text-sm text-neutral-400">
          Long-term factual memory only
        </p>
      </header>

      <div className="flex-1 min-h-0">
        <MemoryWorkspaceClient
          workspaceId={workspaceId}
          initialItems={[]}
        />
      </div>
    </section>
  );
}
