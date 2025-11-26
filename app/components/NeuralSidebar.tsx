// app/components/NeuralSidebar.tsx
import Link from "next/link";

type AnchorEntry = {
  id: string;
  label: string;
  description: string;
  href: string;
};

type Workspace = {
  id: string;
  label: string;
  description: string;
  href: string;
};

const anchorEntries: AnchorEntry[] = [
  {
    id: "workspace-live",
    label: "Workspace Live",
    description: "Your anchored conversations with Solace.",
    href: "/app/decision-brief",
  },
  {
    id: "newsroom",
    label: "Newsroom Cabinet",
    description: "Neutral digest, outlet scores, and ledgers.",
    href: "/app/newsroom",
  },
  {
    id: "memory-center",
    label: "Memory Center",
    description: "Review and edit your stored memories.",
    href: "/app/memories",
  },
  {
    id: "attachments",
    label: "Attachments",
    description: "Files, exports, and reference packs.",
    href: "/app/attachments",
  },
  {
    id: "guidance-modes",
    label: "Guidance Modes",
    description: "Neutral, Guidance, and Ministry lenses.",
    href: "/app/guidance-modes",
  },
  {
    id: "founder-lane",
    label: "Founder Lane",
    description: "MCAI brain, news, and memory routed through Solace.",
    href: "/app/founder-lane",
  },
];

const workspaces: Workspace[] = [
  {
    id: "decision-brief",
    label: "Decision Brief",
    description: "One clear page to move from signal to action.",
    href: "/app/decision-brief",
  },
  {
    id: "journey-planner",
    label: "Journey Planner",
    description: "Next moves, owners, and aligned timelines.",
    href: "/app/journey",
  },
  {
    id: "newsroom-cabinet",
    label: "Newsroom Cabinet",
    description: "Anchored news, outlet cabinet, and bias telemetry.",
    href: "/app/newsroom",
  },
  {
    id: "memory-studio",
    label: "Memory Studio",
    description: "Rewrite, curate, and steward stored memories.",
    href: "/app/memory-studio",
  },
  {
    id: "founder-lane-ws",
    label: "Founder Lane",
    description: "Founder view of brain, news, and memory.",
    href: "/app/founder-lane",
  },
];

export default function NeuralSidebar() {
  return (
    <aside className="neural-sidebar relative rounded-2xl border border-slate-700/70 bg-slate-950/80 px-4 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.95)] backdrop-blur-xl ring-1 ring-cyan-400/10">
      {/* Header + Magic Key */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Solace System
          </p>
          <p className="mt-1 text-[11px] text-slate-300/80">
            Anchored entry points
          </p>
        </div>

        <Link
          href="/auth/sign-in"
          className="inline-flex items-center rounded-full bg-sky-500/95 px-3 py-1 text-[11px] font-semibold text-slate-950 shadow-[0_0_22px_rgba(56,189,248,0.7)] transition hover:bg-sky-400/95 hover:shadow-[0_0_32px_rgba(56,189,248,0.9)]"
        >
          Get magic key
        </Link>
      </div>

      {/* Anchored entries */}
      <div className="space-y-3">
        {anchorEntries.map((entry) => (
          <Link
            key={entry.id}
            href={entry.href}
            className="group block rounded-xl border border-slate-700/70 bg-slate-900/80 px-3 py-3 text-xs leading-snug text-slate-200/95 shadow-[0_12px_40px_rgba(15,23,42,0.95)] transition hover:border-cyan-400/80 hover:bg-slate-900/95 hover:shadow-[0_18px_50px_rgba(8,47,73,0.9)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)] transition-transform group-hover:scale-125" />
                  <span className="text-[12px] font-semibold">
                    {entry.label}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {entry.description}
                </p>
              </div>
              <span className="mt-0.5 text-[11px] text-cyan-300/90 transition-transform group-hover:translate-x-0.5">
                Open →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Workspaces list */}
      <div className="mt-5 border-t border-slate-700/70 pt-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Workspaces
        </p>
        <div className="space-y-1.5">
          {workspaces.map((ws) => (
            <Link
              key={ws.id}
              href={ws.href}
              className="group flex items-start justify-between gap-2 rounded-lg px-1 py-1 text-[11px] text-slate-300 hover:text-cyan-100"
            >
              <div className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-slate-500/80 group-hover:bg-cyan-400 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                <span className="font-medium">{ws.label}</span>
              </div>
              <span className="ml-2 truncate text-[10px] text-slate-500 group-hover:text-cyan-300/90">
                {ws.description}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-4 text-[11px] text-slate-500">
        Neural lines fire when Solace is thinking, remembering, or pulling fresh
        news context.
      </p>
    </aside>
  );
}


