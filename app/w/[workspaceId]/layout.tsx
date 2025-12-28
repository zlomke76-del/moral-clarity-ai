// app/w/[workspaceId]/layout.tsx
// SERVER LAYOUT — NO PARAM VALIDATION

import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function WorkspaceIdLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
