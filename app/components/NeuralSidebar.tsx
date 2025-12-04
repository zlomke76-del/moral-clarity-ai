// app/components/NeuralSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";

/* Icons */
import {
  User,
  BrainCircuit,
  Newspaper,
  KeyRound,
} from "lucide-react";

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

  // ---------------------------
  // Extract workspaceId from route
  // ---------------------------
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

      {/* ---------------------------------------------------------
         TOP OPAQUE BRAND BLOCK
      ---------------------------------------------------------- */}
      <Link href="/app" className="neural-sidebar-top neural-sidebar-brand">
        <div className="neural-sidebar-brand-mark">
          <span>AI</span>
        </div>

        <div className="neural-sidebar-brand-text">
          <span className="neural-sidebar-brand-line-1">Moral Clarity</span>
          <span className="neural-sidebar-brand-line-2">Studio</span>
        </div>
      </Link>

      {/* ---------------------------------------------------------
         LOWER GLASS PANEL
      ---------------------------------------------------------- */}
      <div className="neural-sidebar-glass">
        <div className="neural-sidebar-section-label">Workspace</div>

        <nav className="neural-sidebar-list">
          {sidebarItems.map((item) => (
            <SidebarChip key={item.id} item={item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}

/* ============================================================
   CHIP COMPONENT
   ============================================================ */
function SidebarChip({ item }: { item: NeuralSidebarItem }) {
  const pathname = usePathname();

  const isActive =
    item.href &&
    (pathname === item.href ||
      pathname.startsWith(item.href + "/")); // Allow nested routes

  const inner = (
    <div className={`neural-sidebar-chip ${isActive ? "active" : ""}`}>
      <div className="neural-sidebar-chip-inner">
        {item.icon && (
          <div className="neural-sidebar-chip-icon">
            {item.icon}
          </div>
        )}

        <div>
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
      <Link
        href={item.href}
        className={`neural-sidebar-link ${isActive ? "active" : ""}`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={item.onClick}
      className={`neural-sidebar-link ${isActive ? "active" : ""}`}
    >
      {inner}
    </button>
  );
}

/* ============================================================
   DEFAULT ITEMS — now with icons
   ============================================================ */

function buildDefaultItems(workspaceId: string): NeuralSidebarItem[] {
  return [
    {
      id: "account",
      label: "Account",
      description: "Profile & billing",
      href: "/account",
      icon: <User className="neural-icon" size={18} />,
    },
    {
      id: "memory",
      label: "Memory",
      description: "Review & edit Solace memory",
      href: `/w/${workspaceId}/memory`,
      icon: <BrainCircuit className="neural-icon" size={18} />,
    },
    {
      id: "newsroom",
      label: "Newsroom Cabinet",
      description: "Neutrality & outlet metrics",
      href: "/newsroom/cabinet",
      icon: <Newspaper className="neural-icon" size={18} />,
    },
    {
      id: "magic-key",
      label: "Magic Key",
      description: "Generate a new secure key",
      href: "/auth/sign-in",
      icon: <KeyRound className="neural-icon" size={18} />,
    },
  ];
}


