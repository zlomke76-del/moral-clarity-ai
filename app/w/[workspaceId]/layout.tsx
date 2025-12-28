export default function WorkspaceIdLayout({ children, params }) {
  const workspaceId = params?.workspaceId;

  if (!workspaceId || typeof workspaceId !== "string") {
    console.error("[WorkspaceIdLayout] workspaceId missing or invalid", params);
    return null;
  }

  return children;
}
