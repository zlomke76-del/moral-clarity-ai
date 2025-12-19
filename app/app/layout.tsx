// app/app/layout.tsx

"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";

  // Tool / editor pages must be edge-to-edge
  const noPadding =
    pathname.includes("/memory") ||
    pathname.includes("/newsroom") ||
    pathname.includes("/builder");

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
