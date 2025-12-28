// app/w/[workspaceId]/memory/layout.tsx

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
