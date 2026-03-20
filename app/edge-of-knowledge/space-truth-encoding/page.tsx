import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Passive Truth-Encoding Materials for Space Mission Integrity | Truth Persistence Boundary",
  description:
    "A constraint establishing that cumulative degradation must be irreversibly encoded in material state, or the system becomes epistemically unsafe.",
  openGraph: {
    title: "Passive Truth-Encoding Materials for Space Mission Integrity",
    description:
      "Truth must persist physically when telemetry and institutions cannot be trusted.",
    url: "https://moralclarity.ai/space-truth-encoding",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function SpaceTruthEncodingPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Truth Persistence Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Passive Truth-Encoding Materials for Space Mission Integrity
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          When telemetry fails, truth must persist in matter—not interpretation.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Truth persistent · Irreversible · Non-erasable · Institution-independent
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Boundary">
        <p>
          This system defines a constraint: cumulative exposure must be
          irreversibly encoded into material state in regimes where monitoring,
          telemetry, or institutional interpretation are unreliable.
        </p>

        <p className="text-red-300">
          If truth can be lost, averaged, or denied, the system is epistemically unsafe.
        </p>
      </Section>

      {/* PROBLEM */}
      <Section title="Problem: Invisible Accumulation">
        <p>
          Space systems degrade cumulatively through radiation, thermal cycling,
          micro-impacts, and vacuum exposure. These effects are often invisible
          until catastrophic failure.
        </p>

        <p className="text-red-300">
          When degradation is not physically recorded, decision-making becomes vulnerable to optimism, delay, and denial.
        </p>
      </Section>

      {/* CONCEPT */}
      <Section title="Truth Encoding Principle">
        <p>
          The material itself becomes the record of exposure.
        </p>

        <ul className="list-disc pl-6">
          <li>Intrinsic encoding within the bulk material</li>
          <li>No sensors, power, or telemetry required</li>
          <li>Irreversible, path-dependent state changes</li>
          <li>Erasure requires material destruction</li>
        </ul>

        <p className="text-red-300">
          Measurement can fail. Matter cannot forget.
        </p>
      </Section>

      {/* MECHANISMS */}
      <Section title="Physical Mechanisms">
        <ul className="list-disc pl-6">
          <li>Radiation-induced color centers</li>
          <li>Lattice damage and embrittlement</li>
          <li>Microfracture networks</li>
          <li>Irreversible phase transitions</li>
          <li>Vacuum-driven chemical shifts</li>
        </ul>

        <p>
          These mechanisms encode exposure cumulatively and non-resettably.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Mapping">
        <p className="font-semibold text-white">Valid:</p>
        <ul className="list-disc pl-6">
          <li>Long-duration, deep-space missions</li>
          <li>Telemetry-limited or failure-prone systems</li>
          <li>Environments with strong institutional bias or delay risk</li>
        </ul>

        <p className="font-semibold text-white mt-4">Fails:</p>
        <ul className="list-disc pl-6">
          <li>Short-duration missions</li>
          <li>High-fidelity, redundant monitoring systems</li>
          <li>Contexts requiring precise real-time measurement</li>
        </ul>
      </Section>

      {/* FAILURE */}
      <Section title="Failure Modes">
        <ul className="list-disc pl-6">
          <li>Encoded signals do not correlate with degradation</li>
          <li>Exposure history can be masked or erased</li>
          <li>Signals are ambiguous or uninterpretable</li>
          <li>Truth arrives too late to inform action</li>
        </ul>

        <p className="text-red-300">
          If truth cannot be trusted, encoding fails.
        </p>
      </Section>

      {/* DISTINCTION */}
      <Section title="Boundary Distinction">
        <p>This system is not:</p>
        <ul className="list-disc pl-6">
          <li>A sensor</li>
          <li>A monitoring system</li>
          <li>A predictive model</li>
        </ul>

        <p className="text-red-300">
          It enforces truth—not interpretation.
        </p>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Exposure-preserving transformations</p>
        <p><strong>Q:</strong> True cumulative degradation</p>
        <p><strong>S:</strong> Material-encoded state</p>

        <p className="text-red-300">
          Failure: Q cannot be reconstructed from S
        </p>
      </Section>

      {/* CLAIM */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any system operating under cumulative risk must demonstrate that
          degradation truth is physically preserved and non-erasable.
        </p>

        <p className="text-red-300">
          Systems that rely solely on telemetry or interpretation are not sufficient in these regimes.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          In environments where failure is delayed and oversight is imperfect,
          truth must be enforced by physics. Systems that allow degradation to
          remain invisible are not merely incomplete—they are structurally unsafe.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Truth-bound · Irreversible · Non-erasable · Institution-independent · Versioned
      </div>
    </main>
  );
}
