import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Glove Additive Leaching Under Sanitizer Exposure — Short-Cycle Integrity Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether alcohol-based sanitizer mobilizes chemical additives from standard laboratory gloves at operationally relevant levels.",
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
      <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        {eyebrow}
      </div>
      <h2 className="mb-4 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
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
      ? "border-rose-500/20 bg-rose-500/10 text-rose-700"
      : tone === "pass"
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
        : "border-zinc-300 bg-zinc-100 text-zinc-700";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}>
      {children}
    </span>
  );
}

export default function GloveAdditiveLeachingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border bg-gradient-to-br from-white to-zinc-100 p-10">
          <div className="mb-4 flex gap-2 flex-wrap">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Contamination Integrity</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold">
            Glove Additive Leaching Under Sanitizer Exposure
          </h1>

          <p className="mt-6 text-lg text-zinc-700 max-w-3xl">
            Glove–sanitizer compatibility is admissible only if alcohol exposure
            does not mobilize measurable additive contamination into the working
            environment.
          </p>

          <div className="mt-8 bg-black text-white p-6 rounded-xl">
            <div className="text-xs uppercase opacity-70 mb-2">
              Core Doctrine
            </div>
            <p>
              A barrier material is <strong>admissible</strong> only if it does not
              introduce measurable contamination under normal use conditions.
              If sanitizer exposure mobilizes additives above threshold, the
              barrier function is operationally invalid.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Sanitizer does not extract glove additives"
        >
          <p>
            Alcohol-based sanitizers are assumed not to mobilize or extract
            chemical additives from commonly used laboratory gloves.
          </p>
        </SectionCard>

        {/* WHAT THIS REALLY TESTS */}
        <SectionCard
          eyebrow="Actual Boundary"
          title="Barrier integrity under real workflow"
        >
          <p>
            This is not a chemistry experiment. It is a barrier integrity test
            under realistic workflow conditions.
          </p>

          <p>
            The question is simple: does the glove remain chemically inert after
            sanitizer exposure, or does it become a contamination source?
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Minimal controlled system"
        >
          <ul>
            <li>Nitrile, latex, vinyl gloves (new, unused)</li>
            <li>70% ethanol exposure</li>
            <li>Fixed surface area and exposure time</li>
            <li>No cross-contamination between materials</li>
          </ul>
        </SectionCard>

        {/* EXPOSURE */}
        <SectionCard
          eyebrow="Exposure Protocol"
          title="Sanitizer interaction"
        >
          <ul>
            <li>5 cm × 5 cm samples</li>
            <li>Submerged in 70% ethanol for 2 minutes</li>
            <li>20–22°C controlled environment</li>
            <li>No rinse, immediate extraction</li>
          </ul>
        </SectionCard>

        {/* EXTRACTION */}
        <SectionCard
          eyebrow="Extraction + Measurement"
          title="Additive detection system"
        >
          <ul>
            <li>Methanol extraction (60 minutes)</li>
            <li>GC-MS quantification</li>
            <li>LOQ ≤ 1 µg/mL</li>
            <li>Triplicate reproducibility required</li>
          </ul>

          <p>
            Measurement is not exploratory. It is threshold-driven.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Extracted additive concentration"
        >
          <p>
            The governing variable is the concentration of extracted additive
            compounds in the solvent phase.
          </p>

          <p>
            Presence alone is insufficient. Concentration relative to threshold
            determines admissibility.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800">PASS</h2>
            <p className="mt-4 text-sm">
              All detected additives remain below 10 µg/mL.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800">FAIL</h2>
            <p className="mt-4 text-sm">
              Any additive ≥10 µg/mL in any extract.
            </p>
          </section>
        </section>

        {/* OPERATIONAL IMPACT */}
        <SectionCard
          eyebrow="Operational Consequence"
          title="What failure actually means"
        >
          <p>
            Failure indicates that the glove is no longer a neutral barrier but a
            contamination source.
          </p>

          <ul>
            <li>Sample integrity is compromised</li>
            <li>Experimental reproducibility is degraded</li>
            <li>Workflow assumptions become invalid</li>
          </ul>

          <p>
            No toxicity claim is required. Contamination alone is sufficient for
            operational failure.
          </p>
        </SectionCard>

        {/* SCOPE */}
        <SectionCard
          eyebrow="Scope Boundary"
          title="What this does not claim"
        >
          <ul>
            <li>No health or toxicity claims</li>
            <li>No regulatory conclusions</li>
            <li>No clinical applicability</li>
          </ul>

          <p>
            This is strictly a contamination integrity test.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border bg-zinc-950 text-white p-8">
          <p className="text-2xl font-semibold">
            A barrier that introduces contamination is not a barrier.
          </p>
          <p className="mt-4 opacity-80">
            If normal workflow conditions produce measurable extraction, the
            protective assumption is operationally void.
          </p>
        </section>

      </div>
    </main>
  );
}
