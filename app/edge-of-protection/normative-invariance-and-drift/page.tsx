// app/edge-of-protection/normative-invariance-and-drift/page.tsx
// ============================================================
// EDGE OF PROTECTION
// Normative Invariance and Drift
// Upgraded to Constraint-Bound Admissibility Framework
// ============================================================

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
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-12">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold text-white tracking-tight">
            Normative Invariance and Drift
          </h1>

          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Edge of Protection
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Stability Constraint
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Drift Boundary
            </span>
          </div>

          <p className="text-neutral-300 max-w-3xl">
            Stability is admissible only if system behavior remains invariant
            under time, pressure, and adaptation. Any undetected or unbounded
            change in normative output constitutes failure.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CORE DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg leading-relaxed">
          Stability is admissible only if drift cannot occur without detection.
        </p>
        <p className="text-neutral-400 mt-4">
          Any silent change in normative behavior constitutes structural failure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* TESTED ASSUMPTION */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Tested Assumption</h2>
          <p className="text-neutral-600 mt-2">
            System outputs remain invariant across time, pressure, and
            adaptation without silent normative deviation.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Why This Matters</h2>
          <p className="text-neutral-600 mt-2">
            Systems that drift silently replace constraint with adaptation,
            allowing values to erode without detection or accountability.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM DEFINITION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">System Definition</h2>
        <p className="text-neutral-600">
          Drift is defined as any change in normative output behavior that is not
          explicitly detected, bounded, and governed.
        </p>
      </section>

      {/* ===================================================== */}
      {/* GOVERNING VARIABLE */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Governing Variable</h2>
        <p className="text-neutral-600">
          Degree of normative deviation across time, pressure conditions, or
          system updates without explicit detection or constraint enforcement.
        </p>
      </section>

      {/* ===================================================== */}
      {/* EXPERIMENTAL SETUP */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">
          Experimental / Boundary Setup
        </h2>
        <ul className="list-disc pl-6 text-neutral-600 space-y-2">
          <li>Run identical or equivalent prompts across time intervals</li>
          <li>Apply pressure conditions (urgency, scale, or adversarial input)</li>
          <li>Introduce system updates or environmental changes</li>
          <li>Compare outputs for normative consistency</li>
          <li>Evaluate for undetected deviation</li>
        </ul>
      </section>

      {/* ===================================================== */}
      {/* FALSIFICATION THRESHOLD */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">
          Binary Falsification Threshold
        </h2>
        <p className="text-neutral-600">
          System fails if any normative output changes without explicit
          detection, constraint acknowledgment, or governed transition.
        </p>
      </section>

      {/* ===================================================== */}
      {/* OPERATIONAL INTERPRETATION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">
          Operational Interpretation
        </h2>
        <p className="text-neutral-600">
          Valid systems require invariant reference frames that cannot be
          optimized away, reinterpreted, or silently altered.
        </p>
        <p className="text-neutral-600">
          All change must be visible, bounded, and auditable. Silent adaptation
          constitutes failure regardless of outcome.
        </p>
      </section>

      {/* ===================================================== */}
      {/* BOUNDARY OF CLAIM */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Boundary of Claim</h2>
        <p className="text-neutral-600">
          This constraint evaluates observable output consistency only. It does
          not assess internal learning mechanisms or model architecture.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
          <h3 className="font-semibold text-green-600">PASS</h3>
          <p className="text-neutral-600 mt-2">
            No normative deviation occurs without explicit detection and governed
            acknowledgment.
          </p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h3 className="font-semibold text-red-600">FAIL</h3>
          <p className="text-neutral-600 mt-2">
            Any normative change occurs without detection, visibility, or
            constraint enforcement.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INVARIANT */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg">
          Drift that is not visible is not controlled.
        </p>
        <p className="text-neutral-400 mt-4">
          If change occurs without detection, the system has already failed.
          Stability must be enforced, not assumed.
        </p>
      </section>
    </main>
  );
}
