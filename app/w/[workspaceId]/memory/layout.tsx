// app/w/[workspaceId]/memory/layout.tsx
// ============================================================
// WORKSPACE MEMORY LAYOUT
// Structural param validation & refusal boundary
// ============================================================
// This layout is the ONLY place workspaceId is validated.
// Pages beneath this layer must assume workspaceId is valid.
// ============================================================

import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{
    workspaceId?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function WorkspaceMemoryLayout({
  children,
  params,
}: LayoutProps) {
  const resolvedParams = await params;
  const workspaceId = resolvedParams?.workspaceId;

  // 🔒 STRUCTURAL REFUSAL
  if (!workspaceId || typeof workspaceId !== "string") {
    console.error(
      "[WorkspaceMemoryLayout] workspaceId missing or invalid",
      resolvedParams
    );
    return null;
  }

  return <>{children}</>;
}
