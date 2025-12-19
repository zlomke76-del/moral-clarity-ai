// app/w/layout.tsx

"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";

  // Editor / tool pages should be edge-to-edge
  const noPadding =
    pathname.includes("/memory") ||
    pathname.includes("/newsroom");

  return (
    <div
      data-app-content
      className={clsx(
        "w-full h-full",
        noPadding ? "px-0 py-0" : "px-8 py-10"
      )}
    >
      {children}
    </div>
  );
}
