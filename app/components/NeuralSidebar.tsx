// app/components/NeuralSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import type { ReactNode } from "react";
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";

/* -------------------------------------------------------
   ICON SET — Ultra-Premium Mono (matching brand)
-------------------------------------------------------- */

function IconBrain() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="neural-icon">
      <path d="M12 3c-1.7 0-3 1.3-3 3v12c0 1.7 1.3 3 3 3m0-18c1.7 0 3 1.3 3 3v12c0 1.7-1.3 3-3 3" />
      <path d="M9 10H5.5A2.5 2.5 0 017 5.5M9 14H5.5A2.5 2.5 0 003 16.5" />
      <path d="M15 10h3.5A2.5 2.5 0 0017 5.5M15 14h3.5a2.5 2.5 0 012.5 2.5" />
    </svg>
  );
}

function IconNewspaper() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="neural-icon">
      <path d="M4 19h16a2 2 0 002-2V5H6a2 2 0 00-2 2v12z" />
      <path d="M22 7H6" />
      <path d="M11 12h5" />
      <path d="M11 16h5" />
      <path d="M7 12h1" />
      <path d="M7 16h1" />
    </svg>
  );
}

function IconKey() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="neural-icon">
      <circle cx="7" cy="12" r="3" />
      <path d="M10 12h10l-2 2 2 2" />
    </svg>
  );
}

/* Account icon becomes the avatar circle — clickable upload */
function AccountAvatar() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div
        className="neural-avatar"
        onClick={() => inputRef.current?.click()}
      >
        <span className="neural-avatar-initial">U</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          // Hook for image upload later
          console.log("Uploaded avatar:", e.target.files?.[0]);
        }}
      />
    </>
  );
}

/* -------------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------------- */

export default function NeuralSidebar({ items }: { items?: any[] }) {
  const pathname = usePathname() ?? "";

  let workspaceId: string | null = null;
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "w" && parts[1]) workspaceId = parts[1];

  const sidebarItems =
    items && items.length > 0
      ? items
      : buildDefaultItems(workspaceId ?? MCA_WORKSPACE_ID);

  return (
    <aside className="neural-sidebar">
      {/* BRAND */}
      <Link href="/app" className="neural-sidebar-brand">
        <div className="neural-sidebar-brand-mark">AI</div>
        <div className="neural-sidebar-brand-text">
          <span className="neural-sidebar-brand-line-1">Moral Clarity</span>
          <span className="neural-sidebar-brand-line-2">Studio</span>
        </div>
      </Link>

      <div className="neural-sidebar-section-label">Workspace</div>

      <nav className="neural-sidebar-list">
        {sidebarItems.map((item) => (
          <SidebarChip key={item.id} item={item} pathname={pathname} />
        ))}
      </nav>
    </aside>
  );
}

/* -------------------------------------------------------
   CHIP COMPONENT
-------------------------------------------------------- */

function SidebarChip({
  item,
  pathname,
}: {
  item: any;
  pathname: string;
}) {
  const isActive = pathname === item.href;

  const icon =
    item.id === "account"
      ? <AccountAvatar />
      : item.id === "memory"
      ? <IconBrain />
      : item.id === "newsroom"
      ? <IconNewspaper />
      : item.id === "magic-key"
      ? <IconKey />
      : null;

  const chip = (
    <div className={`neural-sidebar-chip ${isActive ? "active" : ""}`}>
      <div className="neural-sidebar-chip-inner">
        {icon && <div className="neural-sidebar-chip-icon">{icon}</div>}

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

  return (
    <Link href={item.href} className={`neural-sidebar-link ${isActive ? "active" : ""}`}>
      {chip}
    </Link>
  );
}

/* -------------------------------------------------------
   DEFAULT ITEMS
-------------------------------------------------------- */

function buildDefaultItems(workspaceId: string) {
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

