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
 */
export default function NeuralSidebar({ items }: Props) {
  const sidebarItems: NeuralSidebarItem[] =
    items && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <aside
      className="
        hidden
        h-full
        w-72
        flex-shrink-0
        flex-col
        gap-4
        border-r
        border-slate-800/80
        bg-slate-950/80
        bg-gradient-to-b
        from-slate-950/95
        via-slate-900/80
        to-slate-950/95
        px-4
        py-5
        shadow-[18px_0_50px_rgba(3,7,18,0.95)]
        backdrop-blur-2xl
        md:flex
        relative
        z-10
      "
    >
      {/* Logo / Brand */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/60 bg-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.55)]">
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

      {/* Chip grid */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-2">
        {sidebarItems.map((item) => (
          <ChipCard key={item.id} item={item} />
        ))}
      </div>
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
    <div
      className="
        relative
        flex
        cursor-pointer
        flex-col
        gap-1
        rounded-2xl
        border
        border-cyan-400/40
        bg-slate-950/90
        px-3.5
        py-3
        shadow-[0_0_26px_rgba(15,23,42,0.9)]
        transition-all
        duration-150
        hover:-translate-y-[1px]
        hover:border-cyan-300/70
        hover:shadow-[0_0_34px_rgba(34,211,238,0.75)]
      "
    >
      {/* Circuit traces into the panel */}
      <div className="pointer-events-none absolute -left-6 top-1/2 h-px w-6 -translate-y-1/2 bg-cyan-400/50" />
      <div className="pointer-events-none absolute -right-6 top-1/2 h-px w-6 -translate-y-1/2 bg-cyan-400/30" />

      <div className="flex items-center gap-2.5">
        {item.icon && (
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-cyan-400/50 bg-slate-900 text-cyan-200">
            {item.icon}
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          <div className="truncate text-sm font-medium text-slate-100">
            {item.label}
          </div>
          {item.description && (
            <div className="truncate text-xs text-slate-400">
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
        className="
          group
          block
          rounded-2xl
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-400/80
          focus:ring-offset-2
          focus:ring-offset-slate-950
        "
      >
        {core}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={item.onClick}
      className="
        group
        block
        w-full
        rounded-2xl
        text-left
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-400/80
        focus:ring-offset-2
        focus:ring-offset-slate-950
      "
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
    description: "Generate a new secure key",
    href: "#magic-key",
  },
];

