import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Thermal Indicator Paint for Food Safety | Historical Signal Integrity Boundary",
  description:
    "A constraint establishing that thermal exposure must be irreversibly signaled in low-monitoring environments, or risk remains epistemically hidden.",
  openGraph: {
    title: "Thermal Indicator Paint for Food Safety",
    description:
      "Past thermal risk must remain visible—even when monitoring fails.",
    url: "https://moralclarity.ai/edge-of-knowledge/thermal-indicator-paint",
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

export default function ThermalIndicatorPaintPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Post-Exposure Visibility Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Thermal Indicator Paint for Food Safety
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Past thermal risk must remain visible—even when monitoring fails.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Irreversible signal · Post-event truth · No guarantee · Visibility over precision
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Boundary">
        <p>
          This system defines a constraint: thermal exposure must be irreversibly
          signaled in environments where monitoring is unreliable or absent.
        </p>

        <p className="text-red-300">
          If past risk cannot be made visible, the system is epistemically unsafe.
        </p>
      </Section>

      {/* PROBLEM */}
      <Section title="Problem: Hidden Thermal Abuse">
        <p>
          Cold-chain failures often occur without detection due to infrastructure
          gaps, monitoring breakdowns, or ignored data.
        </p>

        <p className="text-red-300">
          When exposure is not recorded physically, unsafe food can appear indistinguishable from safe food.
        </p>
      </Section>

      {/* PRINCIPLE */}
      <Section title="Historical Signal Principle">
        <p>
          The system records whether a threshold has been exceeded—not how or when.
        </p>

        <p className="text-red-300">
          Binary history is sufficient to invalidate safety assumptions.
        </p>
      </Section>

      {/* MECHANISM */}
      <Section title="Physical Mechanism">
        <p>
          Irreversible thermochromic or phase-change chemistries provide
          permanent visual indication once a threshold is exceeded.
        </p>

        <ul className="list-disc pl-6">
          <li>No power or electronics required</li>
          <li>Non-resettable state change</li>
          <li>Persistent, user-visible signal</li>
        </ul>
      </Section>

      {/* CONSTRAINT */}
      <Section title="Signal Integrity Constraint">
        <ul className="list-disc pl-6">
          <li>Signal must trigger reliably at defined threshold</li>
          <li>Signal must persist for decision-making</li>
          <li>Signal must not be reversible or maskable</li>
        </ul>

        <p className="text-red-300">
          Weak, ambiguous, or erasable signals invalidate the system.
        </p>
      </Section>

      {/* CRITICAL TRUTH */}
      <Section title="Critical Limitation">
        <p className="text-red-300">
          Absence of signal is not evidence of safety.
        </p>

        <p>
          The system detects certain threshold violations but does not capture
          duration, cumulative exposure, or sub-threshold risk.
        </p>
      </Section>

      {/* FAILURE */}
      <Section title="Failure Modes">
        <ul className="list-disc pl-6">
          <li>Indicator fails to trigger at threshold</li>
          <li>Environmental factors cause false positives</li>
          <li>Signal is ignored or misinterpreted</li>
          <li>System shifts responsibility to end users</li>
        </ul>

        <p className="text-red-300">
          Visibility without action does not reduce harm.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Mapping">
        <p className="font-semibold text-white">Valid:</p>
        <ul className="list-disc pl-6">
          <li>Low-resource cold-chain environments</li>
          <li>Situations lacking reliable monitoring</li>
        </ul>

        <p className="font-semibold text-white mt-4">Fails:</p>
        <ul className="list-disc pl-6">
          <li>High-precision temperature control systems</li>
          <li>Contexts requiring full exposure history</li>
        </ul>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Threshold-preserving transformations</p>
        <p><strong>Q:</strong> Thermal exposure event</p>
        <p><strong>S:</strong> Indicator state</p>

        <p className="text-red-300">
          Failure: Q occurs without S transition
        </p>
      </Section>

      {/* CLAIM */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any system operating without reliable monitoring must demonstrate
          irreversible signaling of past exposure.
        </p>

        <p className="text-red-300">
          Systems that allow exposure to remain invisible are not acceptable.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Food safety is not defined by what is measured—it is defined by what
          cannot be hidden. Systems that fail to record past exposure allow risk
          to disappear. In such environments, truth must be made visible or harm
          becomes inevitable.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Post-event · Signal-bound · Non-admissible silence · Versioned
      </div>
    </main>
  );
}
