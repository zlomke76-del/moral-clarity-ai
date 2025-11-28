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
 * Minimal, loud, impossible-to-miss left sidebar.
 */
export default function NeuralSidebar({ items }: Props) {
  const sidebarItems: NeuralSidebarItem[] =
    items && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <aside
      className="
        hidden md:flex
        flex-col
        w-72
        min-h-screen
        flex-shrink-0
        bg-slate-950
        border-r border-cyan-400
        text-slate-50
        px-4 py-5
        z-10
      "
    >
      {/* Logo / Brand */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400 bg-slate-900">
            <span className="text-xs font-semibold tracking-[0.18em] text-cyan-200">
              AI
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-slate-400">
              Moral Clarity
            </span>
            <span className="text-sm font-medium text-slate-100">
              Studio
            </span>
          </div>
        </div>

        <div className="mt-3 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-slate-400">
          Workspace
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => (
          <SidebarItem key={item.id} item={item} />
        ))}
      </nav>
    </aside>
  );
}

/* -------------------------------------------------------
   Item
-------------------------------------------------------- */

type SidebarItemProps = {
  item: NeuralSidebarItem;
};

function SidebarItem({ item }: SidebarItemProps) {
  const content = (
    <div
      className="
        w-full
        rounded-xl
        border border-slate-700
        bg-slate-900
        px-3 py-2
        hover:border-cyan-400
        hover:bg-slate-900/90
        transition-colors
      "
    >
      <div className="text-sm font-medium text-slate-100">
        {item.label}
      </div>
      {item.description && (
        <div className="mt-0.5 text-xs text-slate-400">
          {item.description}
        </div>
      )}
    </div>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        onClick={item.onClick}
        className="block focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-xl"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={item.onClick}
      className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-xl"
    >
      {content}
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
    href: "#account",
  },
  {
    id: "memory",
    label: "Memory",
    description: "View Supabase memories",
    href: "#memory",
  },
  {
    id: "newsroom",
    label: "Newsroom Cabinet",
    description: "Neutrality & outlet metrics",
    href: "#newsroom",
  },
  {
    id: "magic-key",
    label: "Magic Key",
    description: "Generate a new fabulous secure key",
    href: "#magic-key",
  },
];
