// app/components/NeuralSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";

/* Icons */
import {
  BrainCircuit,
  Newspaper,
  KeyRound,
  Sparkles,
  ChevronRight,
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

  let workspaceId: string | null = null;
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "w" && parts[1]) workspaceId = parts[1];

  const sidebarItems =
    items && items.length > 0
      ? items
      : buildDefaultItems(workspaceId ?? MCA_WORKSPACE_ID);

  return (
    <div
      className="neural-sidebar text-white"
      style={{
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* BRAND */}
      <div
        className="border-b border-white/6 px-5 pb-5 pt-5"
        style={{ flexShrink: 0 }}
      >
        <Link
          href="/app"
          className="group block rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-4 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.035]"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_10px_30px_rgba(250,204,21,0.12)]">
              <span className="text-base font-semibold tracking-tight text-neutral-950">
                AI
              </span>
            </div>

            <div className="min-w-0">
              <div className="truncate text-[1.02rem] font-semibold tracking-tight text-white">
                Moral Clarity
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/55">
                <span>Studio</span>
                <span className="inline-block h-1 w-1 rounded-full bg-white/25" />
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* CONTENT */}
      <div
        className="neural-sidebar-glass flex-1 overflow-y-auto overflow-x-hidden px-4 py-5"
        style={{
          minHeight: 0,
        }}
      >
        <div className="mb-3 px-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
            Workspace
          </div>
        </div>

        <nav className="flex flex-col gap-3">
          {sidebarItems.map((item) => (
            <SidebarChip key={item.id} item={item} />
          ))}
        </nav>

        <div className="mt-6 rounded-2xl border border-white/6 bg-white/[0.02] p-4">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-white/35">
            Environment
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white/85">
                Studio Workspace
              </div>
              <div className="mt-1 text-xs leading-5 text-white/45">
                Tools for memory, newsroom governance, and secure access.
              </div>
            </div>

            <div className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.75)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* CHIP */
function SidebarChip({ item }: { item: NeuralSidebarItem }) {
  const pathname = usePathname() ?? "";
  const href = item.href ?? "";

  const isActive =
    href.length > 0 && (pathname === href || pathname.startsWith(href + "/"));

  const content = (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border px-4 py-4 transition-all duration-200",
        isActive
          ? "border-white/14 bg-white/[0.07] shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
          : "border-white/7 bg-white/[0.03] hover:border-white/12 hover:bg-white/[0.05]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {item.icon && (
          <div
            className={[
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200",
              isActive
                ? "border-white/12 bg-white/[0.08] text-white"
                : "border-white/8 bg-white/[0.04] text-white/70 group-hover:text-white/90",
            ].join(" ")}
          >
            {item.icon}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div
                className={[
                  "truncate text-[1rem] font-semibold tracking-tight transition-colors",
                  isActive ? "text-white" : "text-white/92",
                ].join(" ")}
              >
                {item.label}
              </div>

              {item.description && (
                <div
                  className={[
                    "mt-1 line-clamp-2 text-sm leading-5",
                    isActive ? "text-white/62" : "text-white/50",
                  ].join(" ")}
                >
                  {item.description}
                </div>
              )}
            </div>

            <div
              className={[
                "mt-0.5 shrink-0 rounded-lg p-1 transition-all duration-200",
                isActive
                  ? "text-white/70"
                  : "text-white/28 group-hover:text-white/50",
              ].join(" ")}
            >
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {isActive && (
        <div className="pointer-events-none absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.55)]" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/40 focus-visible:ring-offset-0 rounded-2xl"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={item.onClick}
      className="block w-full rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/40 focus-visible:ring-offset-0"
    >
      {content}
    </button>
  );
}

/* DEFAULT PAGES */
function buildDefaultItems(workspaceId: string): NeuralSidebarItem[] {
  return [
    {
      id: "memory",
      label: "Memory",
      description: "Review & edit Solace memory",
      href: `/w/${workspaceId}/memory`,
      icon: <BrainCircuit className="h-[18px] w-[18px]" />,
    },
    {
      id: "newsroom",
      label: "Newsroom Cabinet",
      description: "Neutrality & outlet metrics",
      href: "/newsroom/cabinet",
      icon: <Newspaper className="h-[18px] w-[18px]" />,
    },
    {
      id: "magic-key",
      label: "Magic Key",
      description: "Generate a new secure key",
      href: "/auth/sign-in",
      icon: <KeyRound className="h-[18px] w-[18px]" />,
    },
  ];
}
