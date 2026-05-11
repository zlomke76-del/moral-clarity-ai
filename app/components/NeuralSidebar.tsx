// app/components/NeuralSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";
import {
  BrainCircuit,
  ChevronDown,
  Edit3,
  Home,
  KeyRound,
  Library,
  LockKeyhole,
  MessageSquare,
  Newspaper,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";

export type NeuralSidebarItem = {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
};

type SidebarSection = {
  label?: string;
  items: NeuralSidebarItem[];
};

type Props = {
  items?: NeuralSidebarItem[];
};

export default function NeuralSidebar({ items }: Props) {
  const pathname = usePathname() ?? "";
  const parts = pathname.split("/").filter(Boolean);
  const workspaceId = parts[0] === "w" && parts[1] ? parts[1] : MCA_WORKSPACE_ID;
  const activeItemId = resolveActiveItemId(pathname);

  const sections = items?.length
    ? [{ items }]
    : buildDefaultSections(workspaceId);

  return (
    <aside className="consumer-sidebar text-white">
      <Link href="/app" className="consumer-brand" aria-label="Solace home">
        <div className="consumer-brand-mark">
          <span />
        </div>
        <div>
          <strong>Solace</strong>
          <small>AI for Moral Clarity</small>
        </div>
      </Link>

      <div className="consumer-sidebar-scroll">
        {sections.map((section, sectionIndex) => (
          <div className="consumer-sidebar-section" key={section.label ?? sectionIndex}>
            {section.label && <div className="consumer-sidebar-label">{section.label}</div>}
            <nav className="consumer-sidebar-nav">
              {section.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  isActive={item.id === activeItemId}
                />
              ))}
            </nav>
          </div>
        ))}

        <div className="consumer-sidebar-status">
          <div className="status-shield">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <strong>Solace Memory Active</strong>
            <p>Your continuity is secure and always within reach.</p>
            <Link href={`/w/${workspaceId}/memory`}>Learn more →</Link>
          </div>
          <i />
        </div>
      </div>

      <div className="consumer-sidebar-user">
        <div className="consumer-user-avatar">TZ</div>
        <div>
          <strong>Tim Zlomke</strong>
          <small>Personal Plan</small>
        </div>
        <ChevronDown className="ml-auto h-4 w-4 text-white/60" />
      </div>
    </aside>
  );
}

function SidebarItem({
  item,
  isActive,
}: {
  item: NeuralSidebarItem;
  isActive: boolean;
}) {
  const content = (
    <div className={["consumer-sidebar-item", isActive ? "active" : ""].join(" ")}>
      <span className="consumer-sidebar-icon">{item.icon}</span>
      <span>
        <strong>{item.label}</strong>
        {item.description && <small>{item.description}</small>}
      </span>
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="consumer-sidebar-link">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={item.onClick} className="consumer-sidebar-link">
      {content}
    </button>
  );
}

function resolveActiveItemId(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);

  if (pathname === "/app" || pathname.startsWith("/app/")) return "home";

  if (parts[0] === "w" && parts[2]) {
    if (parts[2] === "memory" || parts[2] === "rolodex") return "memory";
  }

  if (pathname.startsWith("/newsroom")) return "newsroom";
  if (pathname.startsWith("/research")) return "research";
  if (pathname.startsWith("/auth/sign-in")) return "magic-key";
  if (pathname.startsWith("/memories")) return "memory-vault";
  if (pathname.startsWith("/account")) return "account";

  return null;
}

function buildDefaultSections(workspaceId: string): SidebarSection[] {
  return [
    {
      items: [
        {
          id: "home",
          label: "Home",
          description: "Start a conversation",
          href: "/app",
          icon: <Home className="h-[18px] w-[18px]" />,
        },
      ],
    },
    {
      label: "Explore",
      items: [
        {
          id: "research",
          label: "Research",
          description: "Find answers, explore topics",
          href: "/research",
          icon: <Search className="h-[18px] w-[18px]" />,
        },
        {
          id: "analysis",
          label: "Analysis",
          description: "Break down claims and ideas",
          href: "/app",
          icon: <Target className="h-[18px] w-[18px]" />,
        },
        {
          id: "protect",
          label: "Protect",
          description: "Family, privacy, digital safety",
          href: "/app",
          icon: <ShieldCheck className="h-[18px] w-[18px]" />,
        },
        {
          id: "create",
          label: "Create",
          description: "Write, build, and ideate",
          href: "/app",
          icon: <Edit3 className="h-[18px] w-[18px]" />,
        },
        {
          id: "conversations",
          label: "Conversations",
          description: "Your recent threads",
          href: "/app",
          icon: <MessageSquare className="h-[18px] w-[18px]" />,
        },
        {
          id: "library",
          label: "Library",
          description: "Saved references",
          href: "/docs",
          icon: <Library className="h-[18px] w-[18px]" />,
        },
      ],
    },
    {
      label: "Memory & Context",
      items: [
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
          href: "/memories",
          icon: <LockKeyhole className="h-[18px] w-[18px]" />,
        },
        {
          id: "newsroom",
          label: "Newsroom",
          description: "Neutrality and outlet metrics",
          href: "/newsroom/cabinet",
          icon: <Newspaper className="h-[18px] w-[18px]" />,
        },
      ],
    },
    {
      label: "Settings",
      items: [
        {
          id: "magic-key",
          label: "Magic Key",
          description: "Generate secure access",
          href: "/auth/sign-in",
          icon: <KeyRound className="h-[18px] w-[18px]" />,
        },
        {
          id: "preferences",
          label: "Preferences",
          description: "Tune your experience",
          href: "/app",
          icon: <Settings className="h-[18px] w-[18px]" />,
        },
        {
          id: "account",
          label: "Account",
          description: "Plan and profile",
          href: "/account",
          icon: <UserRound className="h-[18px] w-[18px]" />,
        },
      ],
    },
  ];
}
