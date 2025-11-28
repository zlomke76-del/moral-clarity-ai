// app/components/NeuralSidebar.tsx
"use client";

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
 * Uses dedicated .neural-sidebar* classes defined in globals.css
 * so Tailwind purging / specificity can't strip the visual.
 */
export default function NeuralSidebar({ items }: Props) {
  const sidebarItems: NeuralSidebarItem[] =
    items && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <aside className="neural-sidebar">
      {/* Logo / Brand */}
      <div className="neural-sidebar-brand">
        <div className="neural-sidebar-brand-mark">
          <span>AI</span>
        </div>
        <div className="neural-sidebar-brand-text">
          <span className="neural-sidebar-brand-line-1">Moral Clarity</span>
          <span className="neural-sidebar-brand-line-2">Studio</span>
        </div>
      </div>

      {/* Label */}
      <div className="neural-sidebar-section-label">Workspace</div>

      {/* Chip list */}
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
      <a
        href={item.href}
        onClick={item.onClick}
        className="neural-sidebar-link"
      >
        {core}
      </a>
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
   Default items
-------------------------------------------------------- */

const DEFAULT_ITEMS: NeuralSidebarItem[] = [
  {
    id: "account",
    label: "Account",
    description: "Profile & billing",
    // Still using anchor until /account is fully live
    href: "#account",
  },
  {
    id: "memory",
    label: "Memory",
    description: "View Supabase memories",
    // Still using anchor until /memory is fully live
    href: "#memory",
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
    // 🔑 Magic Key route
    href: "/auth/sign-in",
  },
];
