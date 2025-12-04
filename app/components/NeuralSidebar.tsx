// app/components/NeuralSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";

export type NeuralSidebarItem = {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
};

type Props = {
  items?: NeuralSidebarItem[];
};

export default function NeuralSidebar({ items }: Props) {
  const pathname = usePathname() ?? "";

  // Extract workspaceId from /w/[workspaceId]/*
  let workspaceId: string | null = null;
  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] === "w" && parts[1]) {
    workspaceId = parts[1];
  }

  const sidebarItems =
    items && items.length > 0
      ? items
      : buildDefaultItems(workspaceId ?? MCA_WORKSPACE_ID);

  return (
    <aside className="neural-sidebar">
      {/* BRAND */}
      <div className="neural-sidebar-brand">
        <div className="neural-sidebar-brand-mark">
          <span>AI</span>
        </div>
        <div className="neural-sidebar-brand-text">
          <span className="neural-sidebar-brand-line-1">Moral Clarity</span>
          <span className="neural-sidebar-brand-line-2">Studio</span>
        </div>
      </div>

      <div className="neural-sidebar-section-label">Workspace</div>

      <nav className="neural-sidebar-list">
        {sidebarItems.map((item) => (
          <SidebarChip key={item.id} item={item} />
        ))}
      </nav>
    </aside>
  );
}

/* -------------------------------------------------------
   CHIP COMPONENT
-------------------------------------------------------- */

function SidebarChip({ item }: { item: NeuralSidebarItem }) {
  const inner = (
    <div className="neural-sidebar-chip">
      <div className="neural-sidebar-chip-inner">
        {item.icon && <div className="neural-sidebar-chip-icon">{item.icon}</div>}

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
    return (
      const pathname = usePathname();
<Link
  href={item.href}
  className={`neural-sidebar-link ${pathname === item.href ? "active" : ""}`}
>

        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={item.onClick} className="neural-sidebar-link">
      {inner}
    </button>
  );
}

/* -------------------------------------------------------
   DEFAULT ITEMS
-------------------------------------------------------- */

function buildDefaultItems(workspaceId: string): NeuralSidebarItem[] {
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
      href: `/w/${workspaceId}/memory`,
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
