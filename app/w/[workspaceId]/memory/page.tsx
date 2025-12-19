import MemoryWorkspaceClient from "./MemoryWorkspaceClient";

export default function WorkspaceMemoryPage() {
  // Read workspaceId from DOM boundary set by layout
  // (Next guarantees layout renders before page)
  // @ts-ignore – resolved at runtime
  const workspaceId =
    typeof document !== "undefined"
      ? document
          .querySelector("[data-workspace-id]")
          ?.getAttribute("data-workspace-id")
      : null;

  if (!workspaceId) {
    console.error(
      "[WorkspaceMemoryPage] workspaceId unavailable from layout boundary"
    );

    return (
      <section className="w-full h-full flex items-center justify-center text-sm text-neutral-500">
        Unable to load workspace memories.
      </section>
    );
  }

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
        <MemoryWorkspaceClient
          workspaceId={workspaceId}
          initialItems={[]}
        />
      </div>
    </section>
  );
}
