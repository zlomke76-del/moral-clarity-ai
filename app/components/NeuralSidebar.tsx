// app/components/NeuralSidebar.tsx
import Link from "next/link";

type NavItem = {
  label: string;
  description: string;
  href: string;
  badge?: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Workspace",
    description: "Your anchored conversations with Solace.",
    href: "/app",
    badge: "Live",
  },
  {
    label: "Newsroom Cabinet",
    description: "Neutral digest, outlet scores, and ledgers.",
    href: "/app/newsroom",
  },
  {
    label: "Memory Center",
    description: "Review and edit your stored memories.",
    href: "/app/memories",
  },
  {
    label: "Attachments",
    description: "Files, exports, and reference packs.",
    href: "/app/files",
  },
  {
    label: "Guidance Modes",
    description: "Neutral • Guidance • Ministry lenses.",
    href: "/app/modes",
  },
];

export default function NeuralSidebar() {
  return (
    <aside
      className="mc-neural-sidebar relative h-full rounded-3xl border border-neutral-800/80 bg-neutral-950/70 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.85)] backdrop-blur-md"
      aria-label="Solace navigation"
    >
      {/* Spine glow behind nodes */}
      <div className="mc-neural-spine" aria-hidden="true" />

      <div className="mb-5 flex items-center gap-2">
        <div className="mc-neural-orb">
          <span className="mc-neural-orb-core" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Solace System
          </p>
          <p className="text-sm text-neutral-300">Anchored entry points</p>
        </div>
      </div>

      <nav className="space-y-2">
        {NAV_ITEMS.map((item, idx) => (
          <div key={item.label} className="mc-neural-node-block">
            {/* Node + link */}
            <Link
              href={item.href}
              className="mc-neural-node group"
              prefetch={false}
            >
              <div className="mc-neural-node-dot" />
              <div className="mc-neural-node-body">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-neutral-50">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-neutral-400">
                  {item.description}
                </p>
              </div>
            </Link>

            {/* Wire between this node and the next */}
            {idx < NAV_ITEMS.length - 1 && (
              <div className="mc-neural-link" aria-hidden="true">
                <div className="mc-neural-link-line" />
                <div className="mc-neural-link-pulse" />
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
