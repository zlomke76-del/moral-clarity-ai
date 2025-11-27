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
 *
 * Left-side vertical navigation using "chip-style" cards
 * on a high-contrast glass panel.
 */
export default function NeuralSidebar({ items }: Props) {
  const sidebarItems: NeuralSidebarItem[] =
    items && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <aside
      className="hidden h-full w-72 flex-shrink-0 flex-col gap-4 border-r border-cyan-400/30 bg-slate-950/85 bg-gradient-to-b from-slate-950/95 via-slate-900/80 to-slate-950/95 px-4 py-5 shadow-[18px_0_40px_rgba(15,23,42,0.9)] backdrop-blur-2xl md:flex"
    >
      {/* Logo / Brand */}
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/70 bg-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.65)]">
          <span className="text-xs font-semibold tracking-[0.18em] text-cyan-200">
            AI
          </span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-slate-400">
            Moral Clarity
          </span>
          <span className="text-sm font-medium text-slate-100">Studio</span>
        </div>
      </div>

      {/* Chip cards */}
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
  const content = (
    <div className="relative flex cursor-pointer flex-col gap-1 rounded-2xl border border-cyan-400/70 bg-slate-950/90 px-3.5 py-3 shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-200 hover:-translate-y-[1px] hover:border-cyan-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.85)]">
      {/* Circuit traces */}
      <div className="pointer-events-none absolute -left-5 top-1/2 h-px w-5 -translate-y-1/2 bg-cyan-400/60" />
      <div className="pointer-events-none absolute -right-5 top-1/2 h-px w-5 -translate-y-1/2 bg-cyan-400/40" />

      <div className="flex items-center gap-2.5">
        {item.icon && (
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border border-cyan-400/70 bg-slate-900 text-cyan-200">
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
        className="group block rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400/80 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={item.onClick}
      className="group block w-full rounded-2xl text-left focus:outline-none focus:ring-2 focus:ring-cyan-400/80 focus:ring-offset-2 focus:ring-offset-slate-950"
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
    description: "Generate a new secure key",
    href: "#magic-key",
  },
];

