// app/components/NeuralSidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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

/**
 * NeuralSidebar
 * Left-side navigation using chip-style cards on a glass panel.
 */
export default function NeuralSidebar({ items }: Props) {
  const pathname = usePathname();

  // Extract workspaceId from /w/[workspaceId]/** path
  let workspaceId: string | null = null;
  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] === "w" && parts.length > 1) {
    workspaceId = parts[1];
  }

  const sidebarItems: NeuralSidebarItem[] =
    items && items.length > 0
      ? items
      : buildDefaultItems(workspaceId);

  return (
    <aside className="neural-sidebar">
      {/* Brand */}
      <div className="neural-sidebar-brand">
        <div className="neural-sidebar-brand-mark">
          <span>AI</span>
        </div>
        <div className="neural-sidebar-brand-text">
          <span className="neural-sidebar-brand-line-1">Moral Clarity</span>
          <span className="neural-sidebar-brand-line-2">Studio</span>
        </div>
      </div>

      {/* Section */}
      <div className="neural-sidebar-section-label">Workspace</div>

      {/* Items */}
      <nav className="neural-sidebar-list">
        {sidebarItems.map((item) => (
          <ChipCard key={item.id} item={item} />
        ))}
      </nav>
    </aside>
  );
}

/* -------------------------------------------------------
   Chip-style card
-------------------------------------------------------- */

type ChipCardProps = {
  item: NeuralSidebarItem;
};

function ChipCard({ item }: ChipCardProps) {
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
    return (
      <a href={item.href} className="neural-sidebar-link">
        {core}
      </a>
    );
  }

  return (
    <button type="button" onClick={item.onClick} className="neural-sidebar-link">
      {core}
    </button>
  );
}

/* -------------------------------------------------------
   Build default items with dynamic workspace memory link
-------------------------------------------------------- */

function buildDefaultItems(workspaceId: string | null): NeuralSidebarItem[] {
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
      href: workspaceId
        ? `/w/${workspaceId}/memory`
        : "/memories", // fallback to avoid breaking if accessed globally
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
