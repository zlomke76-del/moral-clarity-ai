// app/app/page.tsx
import Image from "next/image";
import FeatureGrid from "@/app/components/FeatureGrid";

export const runtime = "nodejs";

export default function AppHome() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col lg:flex-row gap-8 lg:gap-10">
      {/* LEFT COLUMN — WORKSPACES */}
      <section className="w-full lg:w-[38%] space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Start in one of these workspaces
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
            Follow the loop from signal to stewardship — or jump in where you are.
            Each workspace is wired directly into Solace.
          </p>
        </header>

        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-950/60 shadow-[0_0_40px_rgba(15,23,42,0.8)] overflow-hidden">
          <FeatureGrid />
        </div>

        {/* Quick auth / magic key CTA for the studio */}
        <div className="mt-2 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="text-neutral-400">
            <div className="font-medium text-neutral-200">
              Founder lane • Live
            </div>
            <div>MCAI brain, news, and memory all routed through Solace.</div>
          </div>
          <a
            href="/magic-key"
            className="inline-flex items-center justify-center rounded-lg bg-amber-400/90 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-neutral-950 shadow hover:bg-amber-300 transition"
          >
            Get magic key
          </a>
        </div>
      </section>

      {/* RIGHT COLUMN — MCAI BRAIN HERO */}
      <section className="relative w-full lg:w-[62%] flex items-center justify-center">
        {/* Glowing backdrop + “circuit” feel */}
        <div className="pointer-events-none absolute inset-[6%] rounded-[32px] border border-cyan-400/30 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.45),transparent_60%),radial-gradient(circle_at_0%_100%,rgba(59,130,246,0.2),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(96,165,250,0.18),transparent_55%)] opacity-80 blur-[1px]" />

        {/* Static image (hero) */}
        <div className="relative max-w-full">
          <Image
            src="/mca-brain-hero.png"
            alt="MCAI neural brain wired into moral clarity circuits"
            width={900}
            height={900}
            priority
            className="h-auto w-full max-w-[820px] object-contain drop-shadow-[0_0_40px_rgba(34,211,238,0.6)]"
          />
        </div>

        {/* NOTE: this is where we’ll layer the animated “firing wires”:
            - SVG or canvas overlay
            - Pulsing paths pushing into the brain lobes
            We can build that as a separate component next without
            touching this layout again. */}
      </section>
    </div>
  );
}
