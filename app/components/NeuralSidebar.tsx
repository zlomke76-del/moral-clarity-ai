// app/components/NeuralSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import {
  BookOpen,
  BrainCircuit,
  ChevronDown,
  Home,
  Library,
  Lock,
  MessageSquare,
  PenLine,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Target,
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
  const parts = pathname.split("/").filter(Boolean);
  const workspaceId = parts[0] === "w" && parts[1] ? parts[1] : MCA_WORKSPACE_ID;
  const activeItemId = resolveActiveItemId(pathname);

  const primaryItems =
    items && items.length > 0
      ? items
      : [
          {
            id: "home",
            label: "Home",
            description: "Start a conversation",
            href: "/app",
            icon: <Home className="h-[18px] w-[18px]" />,
          },
          {
            id: "research",
            label: "Research",
            description: "Find answers, explore topics",
            href: "/app?mode=research",
            icon: <Search className="h-[18px] w-[18px]" />,
          },
          {
            id: "analysis",
            label: "Analysis",
            description: "Break down claims and ideas",
            href: "/app?mode=analysis",
            icon: <Target className="h-[18px] w-[18px]" />,
          },
          {
            id: "protect",
            label: "Protect",
            description: "Family, privacy, digital safety",
            href: "/app?mode=protect",
            icon: <ShieldCheck className="h-[18px] w-[18px]" />,
          },
          {
            id: "create",
            label: "Create",
            description: "Write, build, and ideate",
            href: "/app?mode=create",
            icon: <PenLine className="h-[18px] w-[18px]" />,
          },
          {
            id: "conversations",
            label: "Conversations",
            description: "Your recent threads",
            href: "/app?view=conversations",
            icon: <MessageSquare className="h-[18px] w-[18px]" />,
          },
          {
            id: "library",
            label: "Library",
            description: "Saved references",
            href: "/app?view=library",
            icon: <Library className="h-[18px] w-[18px]" />,
          },
        ];

  const memoryItems: NeuralSidebarItem[] = [
    {
      id: "memory",
      label: "Memory",
      description: "Your saved knowledge",
      href: `/w/${workspaceId}/memory`,
      icon: <BrainCircuit className="h-[18px] w-[18px]" />,
    },
    {
      id: "memory-vault",
      label: "Memory Vault",
      description: "Review and edit memories",
      href: `/w/${workspaceId}/memory`,
      icon: <Lock className="h-[18px] w-[18px]" />,
    },
  ];

  return (
    <aside className="solace-sidebar" aria-label="Solace navigation">
      <div className="solace-sidebar-brand">
        <Link href="/app" className="solace-brand-lockup" aria-label="Solace home">
          <span className="solace-brand-orb" aria-hidden>
            <span />
          </span>
          <span className="solace-brand-copy">
            <span className="solace-brand-title">Solace</span>
            <span className="solace-brand-kicker">AI for Moral Clarity</span>
          </span>
        </Link>
      </div>

      <div className="solace-sidebar-scroll">
        <nav className="solace-nav-block" aria-label="Primary">
          {primaryItems.map((item) => (
            <SidebarRow key={item.id} item={item} isActive={item.id === activeItemId} />
          ))}
        </nav>

        <div className="solace-sidebar-divider" />

        <div className="solace-sidebar-section-label">Memory &amp; Context</div>
        <nav className="solace-nav-block" aria-label="Memory">
          {memoryItems.map((item) => (
            <SidebarRow key={item.id} item={item} isActive={item.id === activeItemId} />
          ))}
        </nav>

        <div className="solace-sidebar-divider" />

        <div className="solace-sidebar-section-label">Settings</div>
        <nav className="solace-nav-block" aria-label="Settings">
          <SidebarRow
            item={{
              id: "preferences",
              label: "Preferences",
              href: "/account",
              icon: <SlidersHorizontal className="h-[18px] w-[18px]" />,
            }}
            isActive={pathname.startsWith("/account")}
          />
          <SidebarRow
            item={{
              id: "account",
              label: "Account",
              href: "/account",
              icon: <BookOpen className="h-[18px] w-[18px]" />,
            }}
            isActive={pathname.startsWith("/account")}
          />
        </nav>

        <div className="solace-memory-card">
          <div className="solace-memory-card-icon">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="solace-memory-card-title">Solace Memory Active</div>
            <p>Your continuity is secure and always within reach.</p>
            <Link href={`/w/${workspaceId}/memory`}>Learn more →</Link>
          </div>
        </div>
      </div>

      <div className="solace-sidebar-user">
        <div className="solace-user-avatar">TZ</div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-white">Tim Zlomke</div>
          <div className="mt-0.5 text-xs text-white/50">Personal Plan</div>
        </div>
        <ChevronDown className="h-4 w-4 text-white/45" />
      </div>
    </aside>
  );
}

function SidebarRow({ item, isActive }: { item: NeuralSidebarItem; isActive: boolean }) {
  const content = (
    <div className={["solace-nav-row", isActive ? "is-active" : ""].join(" ")}>
      <span className="solace-nav-icon">{item.icon}</span>
      <span className="solace-nav-copy">
        <span className="solace-nav-label">{item.label}</span>
        {item.description && <span className="solace-nav-description">{item.description}</span>}
      </span>
      {item.id === "memory" && <span className="solace-nav-dot" />}
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="solace-nav-link">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={item.onClick} className="solace-nav-button">
      {content}
    </button>
  );
}

function resolveActiveItemId(pathname: string): string | null {
  if (pathname === "/app" || pathname.startsWith("/app?")) return "home";
  if (pathname.startsWith("/w/") && pathname.includes("/memory")) return "memory";
  if (pathname.startsWith("/account")) return "preferences";
  return "home";
}
