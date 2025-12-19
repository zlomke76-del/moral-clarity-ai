export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  return (
    <div data-workspace-id={params.workspaceId}>
      {children}
    </div>
  );
}
