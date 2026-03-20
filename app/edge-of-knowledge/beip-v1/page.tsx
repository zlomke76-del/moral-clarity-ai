// app/edge-of-knowledge/beip-v1/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BEIP v1 — Boundary-Encoded Interfacial Persistence",
  description:
    "A pre-registered, minimal falsification test for whether polymer interfaces encode persistent physical memory.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8 shadow-lg backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300 leading-7">
        {children}
      </div>
    </section>
  );
}

function Signal({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-sky-900/40 bg-slate-900/60 p-4">
      <div className="text-xs uppercase tracking-widest text-sky-300">
        {label}
      </div>
      <div className="mt-2 text-sm text-slate-200">{value}</div>
    </div>
  );
}

function Step({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-sky-900/30 bg-slate-900/60 p-5">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-2 text-sm text-slate-400">{children}</div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10 shadow-xl">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Boundary Experiment
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          BEIP v1 — Boundary-Encoded Interfacial Persistence
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Can a polymer interface remember?
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Pre-Registered Kill Test" />
          <Signal label="Domain" value="Polymer Interfaces" />
          <Signal label="Outcome" value="Binary Survival / Closure" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          No mechanism claims · No application claims · Falsification-first
        </div>
      </section>

      {/* QUESTION */}
      <Section title="The Question">
        <p>
          Do polymer interfaces encode persistent physical memory, or are all
          observed effects transient artifacts of processing history?
        </p>
      </Section>

      {/* CLAIM */}
      <Section title="Claim Under Test">
        <ul className="list-disc pl-6 space-y-2">
          <li>Interface-localized state</li>
          <li>Persistent under near-melt cycling</li>
          <li>Erased only by full melt reset</li>
        </ul>
      </Section>

      {/* WHAT THIS IS NOT */}
      <Section title="What This Is Not">
        <ul className="list-disc pl-6 space-y-2">
          <li>No mechanism proposal</li>
          <li>No chemistry modification</li>
          <li>No application pathway</li>
          <li>No performance claims</li>
        </ul>
        <p>This test exists to survive or fail.</p>
      </Section>

      {/* EXPERIMENT */}
      <Section title="Experimental Structure">
        <p>
          Minimal two-arm design isolates persistence vs reset behavior.
        </p>

        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <Step title="Arm A — Near-Melt Cycling">
            Repeated sub-melt cycling to test persistence.
          </Step>

          <Step title="Arm B — Full Melt Reset">
            Full melt cycles to erase any encoded state.
          </Step>
        </div>
      </Section>

      {/* READOUT */}
      <Section title="Readouts">
        <p>
          AFM (primary): spatially registered structural persistence.
        </p>
        <p>
          DSC (secondary): thermal signature separation.
        </p>
      </Section>

      {/* KILL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Single Fastest-Kill Criterion
        </h2>
        <p className="mt-4 text-red-200 leading-7">
          No reproducible interface-localized signature after cycling AND no
          DSC separation → hypothesis fails.
        </p>
        <p className="mt-4 font-medium text-red-300">
          If both conditions are met, the line closes.
        </p>
      </section>

      {/* OUTCOME */}
      <Section title="Outcome Space">
        <p>
          If it survives → boundaries become state-bearing regions.
        </p>
        <p>
          If it fails → ambiguity in polymer boundary behavior closes.
        </p>
      </Section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Pre-Registered · Minimal · Falsifiable · Non-Interpretive
      </div>
    </main>
  );
}
