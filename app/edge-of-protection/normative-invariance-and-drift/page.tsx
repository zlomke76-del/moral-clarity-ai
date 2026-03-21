// app/edge-of-protection/normative-invariance-and-drift/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Normative Invariance and Drift | Edge of Protection",
  description:
    "Stability is admissible only if system behavior remains invariant under time, pressure, and adaptation.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

export default function NormativeInvarianceAndDriftPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-28 space-y-24">
      {/* ===================================================== */}
      {/* HERO — SYSTEM INTEGRITY */}
      {/* ===================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_20%,rgba(180,220,255,0.2),transparent_70%)]" />

        <div className="relative z-10 max-w-2xl space-y-8">
          <h1 className="text-5xl font-semibold text-white tracking-tight">
            Normative Invariance and Drift
          </h1>

          <div className="flex flex-wrap gap-3">
            {[
              "Edge of Protection",
              "Stability Constraint",
              "Temporal Integrity",
            ].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-neutral-300 text-lg leading-relaxed">
            System behavior is admissible only if it remains invariant across
            time, pressure, and adaptation. Any undetected change in normative
            output constitutes failure.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CANONICAL DOCTRINE */}
      {/* ===================================================== */}
      <section className="text-center space-y-6">
        <p className="text-2xl text-white">
          Stability is admissible only if drift cannot occur without detection.
        </p>

        <p className="text-neutral-400">
          Any silent change in normative behavior constitutes structural failure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* INTERPRETATION */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="rounded-2xl border border-white/10 p-8 bg-white/[0.02]">
          <h2 className="text-white font-semibold text-lg">
            Tested Assumption
          </h2>
          <p className="text-neutral-300 mt-4 leading-relaxed">
            Outputs remain normatively consistent across time, pressure, and
            system updates.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 p-8 bg-white/[0.02]">
          <h2 className="text-white font-semibold text-lg">
            Why This Matters
          </h2>
          <p className="text-neutral-300 mt-4 leading-relaxed">
            Silent drift replaces constraint with adaptation. Once values change
            without detection, governance no longer exists.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* DEFINITION + VARIABLE */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-white font-semibold mb-4">
            System Definition
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            Drift is any change in normative output behavior that is not
            explicitly detected, bounded, and governed.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4">
            Governing Variable
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            Degree of normative deviation across time, pressure, or system
            modification without explicit detection.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* DETECTION CONDITIONS */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-white/10 p-10">
        <h2 className="text-white font-semibold mb-6">
          Experimental / Boundary Setup
        </h2>

        <ul className="list-disc pl-6 text-neutral-300 space-y-3">
          <li>Run identical prompts across time intervals</li>
          <li>Apply pressure conditions (urgency, adversarial input)</li>
          <li>Introduce system updates or environment changes</li>
          <li>Compare outputs for normative consistency</li>
          <li>Evaluate for undetected deviation</li>
        </ul>
      </section>

      {/* ===================================================== */}
      {/* FAILURE ZONE — SYSTEM BREAK */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-10">
        <h2 className="text-red-400 font-semibold">
          Binary Falsification Threshold
        </h2>

        <p className="text-neutral-200 mt-4 text-lg">
          The system fails if any normative output changes without explicit
          detection, acknowledgment, and governed transition.
        </p>
      </section>

      {/* ===================================================== */}
      {/* OPERATIONAL CONSEQUENCE */}
      {/* ===================================================== */}
      <section className="space-y-6 max-w-3xl">
        <h2 className="text-white font-semibold">
          Operational Interpretation
        </h2>

        <p className="text-neutral-300">
          Valid systems require invariant reference frames that cannot be
          optimized away or silently altered.
        </p>

        <p className="text-neutral-300">
          All change must be visible, bounded, and auditable. Silent adaptation
          constitutes failure regardless of outcome.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="border border-green-500/30 bg-green-500/5 rounded-2xl p-8">
          <h3 className="text-green-400 font-semibold">PASS</h3>
          <p className="text-neutral-300 mt-3">
            No normative deviation occurs without explicit detection and governed
            acknowledgment.
          </p>
        </div>

        <div className="border border-red-500/30 bg-red-500/5 rounded-2xl p-8">
          <h3 className="text-red-400 font-semibold">FAIL</h3>
          <p className="text-neutral-300 mt-3">
            Any normative change occurs without detection, visibility, or
            constraint enforcement.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL INVARIANT */}
      {/* ===================================================== */}
      <section className="text-center pt-12 space-y-6">
        <p className="text-2xl text-white">
          Drift that is not visible is not controlled.
        </p>

        <p className="text-neutral-400 max-w-xl mx-auto">
          If change occurs without detection, the system has already failed.
          Stability must be enforced, not assumed.
        </p>
      </section>
    </main>
  );
}
