import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Gauge-Correlated Asymmetry in Polymer Cooling — Short-Cycle Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether nominal cooling suppresses operationally relevant thermal asymmetry in injection-molded polypropylene parts.",
  openGraph: {
    title:
      "Gauge-Correlated Asymmetry in Polymer Cooling — Constraint Boundary",
    description:
      "A plant-executable falsification protocol that removes deniability around cooling symmetry assumptions.",
    url: "https://studio.moralclarity.ai/edge-of-practice/gauge-correlated-asymmetry-in-polymer-cooling",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        {eyebrow}
      </div>
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-7 text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </section>
  );
}

function SignalPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "fail" | "pass";
}) {
  const toneClass =
    tone === "fail"
      ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
      : tone === "pass"
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        : "border-zinc-300/70 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function GaugeCorrelatedAsymmetryPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex flex-wrap gap-2">
                <SignalPill>Edge of Practice</SignalPill>
                <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
                <SignalPill>Process Control Boundary</SignalPill>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
                Gauge-Correlated Asymmetry in Polymer Cooling
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Cooling symmetry is admissible only if downstream product artifacts
                remain invariant under controlled variation of cooling time.
                Reproducible, gauge-correlated defects invalidate the symmetry
                assumption for operational use.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50">
                <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
                  Core Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  A process symmetry assumption is <strong>admissible</strong>{" "}
                  only if controlled parameter variation does not produce
                  reproducible, product-correlated asymmetry. Otherwise, the
                  assumption is operationally void.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 p-10 text-zinc-50 space-y-5">
              <div className="text-[11px] uppercase tracking-[0.24em] text-zinc-400">
                Boundary Summary
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Valid only if
                </div>
                <p className="text-sm">
                  No reproducible artifact trend appears across cooling-time variation.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
                <div className="text-xs uppercase text-rose-300 mb-1">
                  Invalid when
                </div>
                <p className="text-sm text-rose-100">
                  A monotonic or directional defect signature correlates with cooling time.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Governing variable
                </div>
                <p className="text-sm">
                  Product-correlated artifact response to controlled cooling variation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Cooling suppresses operational asymmetry"
        >
          <p>
            Standard cooling times are assumed to suppress internal thermal
            asymmetry such that no reproducible downstream defect emerges under
            nominal conditions.
          </p>
        </SectionCard>

        {/* WHY IT PERSISTS */}
        <SectionCard
          eyebrow="Why This Assumption Persists"
          title="Throughput and invisibility"
        >
          <ul>
            <li>Fixed cooling times maximize throughput</li>
            <li>Internal gradients are not directly observable</li>
            <li>Downstream defects are averaged within tolerance</li>
            <li>Low scrap rates are misinterpreted as validation</li>
          </ul>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Falsification Protocol"
          title="Minimal plant-ready experiment"
        >
          <ul>
            <li>Standard PP part (~4 mm wall)</li>
            <li>All parameters fixed except cooling time</li>
            <li>Three conditions: nominal, −20%, +20%</li>
            <li>30 parts per condition</li>
          </ul>

          <p>No sensors. No tooling changes. No instrumentation dependency.</p>
        </SectionCard>

        {/* READOUT */}
        <SectionCard
          eyebrow="Single Primary Readout"
          title="One artifact, consistently measured"
        >
          <ul>
            <li>Warpage magnitude/direction</li>
            <li>Sink depth</li>
            <li>Shrink differential</li>
            <li>Optical banding</li>
          </ul>

          <p>
            Multiple metrics are not admissible. One signal must carry the test.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-900">PASS</h2>
            <p className="mt-4 text-sm">
              No systematic trend across cooling-time variation.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-900">FAIL</h2>
            <p className="mt-4 text-sm">
              Reproducible defect shifts with cooling time.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-zinc-50">
          <p className="text-2xl font-semibold">
            What can be shifted by control is not suppressed by assumption.
          </p>
          <p className="mt-4 text-zinc-300">
            If a process parameter produces reproducible product asymmetry, the
            symmetry assumption is no longer admissible for control decisions.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          Part of the{" "}
          <Link href="/edge-of-practice">
            Edge of Practice short-cycle experiment index
          </Link>
        </p>
      </div>
    </main>
  );
}
