import MemoryWorkspaceClient from "./MemoryWorkspaceClient";

type Props = {
  params: {
    workspaceId: string;
  };
};

export default function WorkspaceMemoryPage({ params }: Props) {
  return (
    <section
      data-layout-boundary="WorkspaceMemoryPage"
      className="w-full h-full flex flex-col"
    >
      <header className="px-8 py-6 border-b border-neutral-800">
        <h1 className="text-2xl font-semibold tracking-tight">
          Workspace Memories
        </h1>
        <p className="text-sm text-neutral-400">
          Long-term factual memory only
        </p>
      </header>

      <div className="flex-1 min-h-0">
        <MemoryWorkspaceClient workspaceId={params.workspaceId} />
      </div>
    </section>
  );
}
