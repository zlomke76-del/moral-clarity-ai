// app/w/layout.tsx
// WORKSPACE ROOT LAYOUT — TOOL SURFACE

import clsx from "clsx";
import { ReactNode } from "react";

type WorkspaceLayoutProps = {
  children: ReactNode;
};

export default function WorkspaceLayout({
  children,
}: WorkspaceLayoutProps) {
  return (
    <div
      data-app-content
      className={clsx(
        "w-full min-h-screen h-screen",
        "flex flex-col",
        "overflow-hidden",
        "px-0 py-0"
      )}
    >
      {children}
    </div>
  );
}
