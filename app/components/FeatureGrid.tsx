// app/components/FeatureGrid.tsx
import Link from "next/link";

const workspaceCards = [
  {
    id: "decision-brief",
    label: "Decision Brief",
    description: "One clear page to move from signal to action.",
    href: "/app/decision-brief",
  },
  {
    id: "journey-planner",
    label: "Journey Planner",
    description: "Map grounded next moves, owners, and aligned timelines.",
    href: "/app/journey",
  },
  {
    id: "newsroom-cabinet",
    label: "Newsroom Cabinet",
    description: "Neutral news digest, outlet cabinet, and bias telemetry.",
    href: "/app/newsroom",
  },
  {
    id: "memory-studio",
    label: "Memory Studio",
    description: "Rewrite, curate, and steward stored memories.",
    href: "/app/memory-studio",
  },
  {
    id: "founder-lane",
    label: "Founder Lane",
    description: "Founder view of brain, news, and memory routed through Solace.",
    href: "/app/founder-lane",
  },
];

export default function FeatureGrid() {
  return (
    <section className="border-t border-slate-800/70 pt-8 lg:pt-10">
      {/* Section intro */}
      <div className="max-w-2xl space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
          Workspaces
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          MCAI Neural Workspaces
        </h2>
        <p className="text-sm text-slate-300 sm:text-[15px]">
          Each workspace is an anchored entry point into Solace. You move
          between them, but the same brain stays with you — memory, news, and
          guidance all wired into a single system.
        </p>
      </div>

      {/* Grid of workspace cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workspaceCards.map((ws) => (
          <Link
            key={ws.id}
            href={ws.href}
            className="group relative overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/70 p-4 text-sm text-slate-100 shadow-[0_18px_60px_rgba(15,23,42,0.9)] transition hover:border-cyan-400/80 hover:bg-slate-950/95 hover:shadow-[0_24px_80px_rgba(8,47,73,0.95)]"
          >
            {/* glow on hover */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.26),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.24),transparent_55%)]" />
            <div className="relative flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                <span className="text-sm font-semibold">{ws.label}</span>
              </div>
              <p className="text-[13px] text-slate-300">{ws.description}</p>
              <span className="mt-1 text-[11px] text-cyan-300/90 transition-transform group-hover:translate-x-0.5">
                Open workspace →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-4 text-[12px] text-slate-500">
        Neural lines fire when Solace is thinking, remembering, or pulling fresh
        news context — so you always see when the brain is at work.
      </p>
    </section>
  );
}

