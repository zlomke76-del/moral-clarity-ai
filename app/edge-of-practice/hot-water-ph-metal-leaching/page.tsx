import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Domestic Hot Water pH vs Metal Leaching — Short-Cycle Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether realistic domestic hot water pH variation produces measurable increases in metal leaching from common plumbing materials.",
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
    <section className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm">
      <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
        {eyebrow}
      </div>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="space-y-4 text-[15px] leading-7 text-zinc-700">
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

export default function HotWaterPhMetalLeachingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border bg-gradient-to-br from-white to-zinc-100 p-10">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Infrastructure Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold">
            Domestic Hot Water pH vs Metal Leaching
          </h1>

          <p className="mt-6 text-lg max-w-3xl text-zinc-700">
            Domestic hot water systems are admissible only if realistic pH
            variation does not produce measurable increases in metal leaching
            relative to neutral baseline conditions.
          </p>

          <div className="mt-8 bg-black text-white p-6 rounded-xl">
            <div className="text-xs uppercase opacity-70 mb-2">
              Core Doctrine
            </div>
            <p>
              A water system is <strong>admissible</strong> only if normal pH
              variation does not materially change leaching behavior. If modest
              pH shifts produce measurable metal increases, the stability
              assumption is operationally invalid.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Domestic pH variation does not affect leaching"
        >
          <p>
            The assumption under test is that modest, realistic pH variation in
            household hot water does not meaningfully alter metal leaching from
            plumbing materials over short time scales.
          </p>
        </SectionCard>

        {/* WHY LOAD-BEARING */}
        <SectionCard
          eyebrow="Why This Assumption Is Load-Bearing"
          title="Water systems are treated as chemically stable"
        >
          <p>
            Domestic water infrastructure, plumbing standards, and household use
            patterns assume that water chemistry variation within normal ranges
            does not materially change metal exposure behavior.
          </p>

          <p>
            This assumption underlies trust in fixtures, piping, and daily water
            use without continuous monitoring.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Hot water in contact with plumbing metals"
        >
          <ul>
            <li>Materials: copper and galvanized steel</li>
            <li>Water: deionized baseline with controlled pH adjustment</li>
            <li>Environment: sealed exposure at 60 °C</li>
            <li>Duration: 24 hours</li>
          </ul>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Falsification Protocol"
          title="Minimal controlled exposure"
        >
          <ul>
            <li>pH conditions: 6.5, 7.5, 8.5</li>
            <li>Neutral control: ~7.0</li>
            <li>Exposure: 24 hours at 60 °C</li>
            <li>Separate vessels for each material and condition</li>
          </ul>

          <p>
            No flow dynamics, aging, or corrosion acceleration are introduced.
            The test isolates pH as the governing variable.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Metal concentration relative to neutral baseline"
        >
          <p>
            The governing variable is the change in dissolved metal
            concentration (µg/L) relative to neutral control conditions.
          </p>

          <p>
            Absolute concentration is not the primary signal. Differential
            increase determines admissibility.
          </p>
        </SectionCard>

        {/* MEASUREMENT */}
        <SectionCard
          eyebrow="Measurement System"
          title="Trace metal quantification"
        >
          <ul>
            <li>ICP-MS analysis for Cu, Pb, Zn, Fe</li>
            <li>Calibration against known standards</li>
            <li>Procedural blanks to confirm baseline</li>
          </ul>

          <p>
            Measurement must resolve differences at the µg/L scale.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800">PASS</h2>
            <p className="mt-4 text-sm">
              No pH condition increases metal concentration by ≥10 µg/L relative
              to neutral control.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800">FAIL</h2>
            <p className="mt-4 text-sm">
              Any pH condition increases metal concentration by ≥10 µg/L.
            </p>
          </section>
        </section>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Operational Interpretation"
          title="What failure means"
        >
          <p>
            Failure indicates that ordinary pH variation alone can shift the
            system into a higher leaching regime without any physical disturbance
            or infrastructure change.
          </p>

          <p>
            The system is not chemically stable—it is conditionally stable.
          </p>
        </SectionCard>

        {/* SCOPE */}
        <SectionCard
          eyebrow="Scope Boundary"
          title="What this does not claim"
        >
          <ul>
            <li>No health or toxicity conclusions</li>
            <li>No regulatory exceedance claims</li>
            <li>No system-wide extrapolation</li>
          </ul>

          <p>
            The result applies only to the defined materials, pH range, and
            exposure window.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border bg-zinc-950 text-white p-8">
          <p className="text-2xl font-semibold">
            Stability is admissible only if chemistry does not shift outcomes.
          </p>
          <p className="mt-4 opacity-80">
            If normal pH variation changes leaching behavior, the system is not
            inherently stable—it is parameter-dependent.
          </p>
        </section>

      </div>
    </main>
  );
}
