"use client";

import Link from "next/link";

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-12 w-full">

      {/* LEFT COLUMN */}
      <aside className="space-y-8 text-neutral-200">

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            MCAI Neural Workspaces
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            The MCAI brain wired into moral clarity circuits.
          </p>
        </div>

        <nav className="space-y-6">

          <Section
            title="Decision Brief"
            description="One clear page to move from signal to action."
            href="/app/decision-brief"
          />

          <Section
            title="Journey Planner"
            description="Map grounded next moves, owners, and aligned timelines."
            href="/app/journey"
          />

          <Section
            title="Newsroom Cabinet"
            description="Neutral news digest, outlets, and bias telemetry."
            href="/app/newsroom"
          />

          <Section
            title="Memory Studio"
            description="Review, rewrite, and curate stored memories."
            href="/app/memories"
          />

          <Section
            title="Founder Lane"
            description="MCAI brain, news, and memory routed through Solace."
            href="/app/founder"
          />

        </nav>

        {/* FOOTER LINKS */}
        <div className="pt-4 border-t border-white/10 space-y-3 text-sm text-neutral-400">
          <Link
            href="/app/login"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Get magic key
          </Link>

          <div className="space-x-4 block">
            <Link href="/privacy" className="hover:text-neutral-200">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-200">
              Terms
            </Link>
            <Link href="/status" className="hover:text-neutral-200">
              Status
            </Link>
          </div>

          <div className="text-xs text-neutral-500">
            © 2025 Moral Clarity AI
          </div>
        </div>

      </aside>

      {/* RIGHT PANEL (empty, SolaceDock handles it) */}
      <div className="relative">
        {/* Nothing here — SolaceDock renders above this */}
      </div>

    </div>
  );
}

function Section({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block group"
    >
      <h3 className="text-lg font-semibold text-neutral-100 group-hover:text-blue-300 transition">
        {title}
      </h3>
      <p className="text-sm text-neutral-400">
        {description}
      </p>
    </Link>
  );
}
