// app/w/[workspaceId]/layout.tsx
// ============================================================
// WORKSPACE ROOT LAYOUT
// Canonical workspaceId validation & stabilization
// ============================================================
// This is the FIRST ownership boundary for [workspaceId].
// Validation MUST occur here so all descendants receive
// a resolved, trusted string value.
// ============================================================

import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  params: {
    workspaceId?: string;
  };
};

export const dynamic = "force-dynamic";

export default function WorkspaceIdLayout({
  children,
  params,
}: LayoutProps) {
  const workspaceId = params?.workspaceId;

  // 🔒 STRUCTURAL REFUSAL
  // No workspaceId → no render
  if (!workspaceId || typeof workspaceId !== "string") {
    console.error(
      "[WorkspaceIdLayout] workspaceId missing or invalid",
      params
    );
    return null;
  }

  // Canonical boundary: all descendants may now assume validity
  return <>{children}</>;
}
