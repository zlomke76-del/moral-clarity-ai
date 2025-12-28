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

  if (!workspaceId || typeof workspaceId !== "string") {
    console.error(
      "[WorkspaceIdLayout] workspaceId missing or invalid",
      params
    );
    return null;
  }

  return <>{children}</>;
}
