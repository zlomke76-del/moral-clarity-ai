// app/components/NeuralSidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";  // ⬅️ import your default workspace

// ...everything above stays the same...

function ChipCard({ item }: { item: NeuralSidebarItem }) {
  const core = (
    <div className="neural-sidebar-chip">
      <div className="neural-sidebar-chip-inner">
        {item.icon && (
          <div className="neural-sidebar-chip-icon">{item.icon}</div>
        )}
        <div className="neural-sidebar-chip-text">
          <div className="neural-sidebar-chip-label">{item.label}</div>
          {item.description && (
            <div className="neural-sidebar-chip-description">
              {item.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (item.href) {
    // ✅ Use Next.js Link for client-side navigation
    return (
      <Link href={item.href} className="neural-sidebar-link">
        {core}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={item.onClick}
      className="neural-sidebar-link"
    >
      {core}
    </button>
  );
}

/* -------------------------------------------------------
   Defaults
-------------------------------------------------------- */

function buildDefaultItems(workspaceId: string | null): NeuralSidebarItem[] {
  const effectiveWorkspaceId = workspaceId ?? MCA_WORKSPACE_ID;

  return [
    {
      id: "account",
      label: "Account",
      description: "Profile & billing",
      href: "/account",
    },
    {
      id: "memory",
      label: "Memory",
      description: "Review & edit Solace memory",
      href: `/w/${effectiveWorkspaceId}/memory`,
    },
    {
      id: "newsroom",
      label: "Newsroom Cabinet",
      description: "Neutrality & outlet metrics",
      href: "/newsroom/cabinet",
    },
    {
      id: "magic-key",
      label: "Magic Key",
      description: "Generate a new secure key",
      href: "/auth/sign-in",
    },
  ];
}
