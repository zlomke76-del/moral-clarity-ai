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
  params: {
    workspaceId?: string;
  };
};

export const dynamic = "force-dynamic";

export default function WorkspaceMemoryLayout({
  children,
  params,
}: LayoutProps) {
  const workspaceId = params?.workspaceId;

  // 🔒 STRUCTURAL REFUSAL
  // If the workspaceId is missing or malformed, render nothing.
  // No fallback UI. No explanation. No recovery.
  if (!workspaceId || typeof workspaceId !== "string") {
    console.error(
      "[WorkspaceMemoryLayout] workspaceId missing or invalid",
      params
    );
    return null;
  }

  // Param is now canonically valid for all descendants
  return <>{children}</>;
}
