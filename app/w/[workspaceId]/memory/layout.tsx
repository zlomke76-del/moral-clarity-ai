// app/w/[workspaceId]/memory/layout.tsx
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function WorkspaceMemoryLayout({
  children,
}: {
  children: ReactNode;
}) {
  // DO NOT validate params here
  return <>{children}</>;
}
