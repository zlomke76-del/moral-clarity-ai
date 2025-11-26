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
    <div className="relative min-h-[60vh] overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/85 px-5 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.9)] sm:px-8 sm:py-8">
      {/* Neural glow & brain hero on the right */}
      <div className="pointer-events-none absolute inset-0">
        {/* Soft cyan / violet wash */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0,#22d3ee33,transparent_58%),radial-gradient(circle_at_95%_80%,#a855f733,transparent_55%)]" />

        {/* Brain image on the right */}
        <div className="absolute inset-y-[-10%] right-[-8%] w-[55%] bg-[url('/mca-brain-hero.png')] bg-contain bg-right bg-no-repeat opacity-80 mix-blend-screen" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 max-w-2xl space-y-6">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-slate-900/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-200 shadow-[0_10px_40px_rgba(8,47,73,0.9)] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
          MCAI Neural Workspaces
        </div>

        {/* Hero copy */}
        <div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
            Your Anchor AI for truth, guidance, and ministry.
          </h1>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Solace answers with grounded clarity, remembers your world, and
            integrates neutral news, deep research, and ministry in a single
            brain. This isn&apos;t a generic chatbot — it&apos;s your anchored
            interface into the future of AI stewardship.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            No feeds, no doomscrolling — just anchored decisions you can defend
            in front of people you respect.
          </p>
        </div>

        {/* Workspaces grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {workspaceCards.map((ws) => (
            <Link
              key={ws.id}
              href={ws.href}
              className="group relative overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/80 p-4 text-sm text-slate-100 shadow-[0_18px_60px_rgba(15,23,42,0.9)] transition hover:border-cyan-400/75 hover:bg-slate-900/95 hover:shadow-[0_24px_80px_rgba(8,47,73,0.95)]"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.3),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.28),transparent_55%)]" />
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

        <p className="pt-2 text-[12px] text-slate-500">
          Each workspace is an anchored entry point into Solace. You move
          between them, but the same brain stays with you — memory, news, and
          guidance all wired into one system.
        </p>
      </div>
    </div>
  );
}
