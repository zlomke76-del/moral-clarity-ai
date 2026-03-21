// app/edge-of-protection/representation-boundary/page.tsx
// ============================================================
// EDGE OF PROTECTION
// Representation Boundary
// Upgraded to Constraint-Bound Admissibility Framework
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Representation Boundary | Edge of Protection",
  description:
    "Representation is admissible only if explicit, revocable consent is present and no authority over meaning is asserted.",
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-static";

export default function RepresentationBoundaryPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-12">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold text-white tracking-tight">
            Representation Boundary
          </h1>

          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Edge of Protection
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Consent Constraint
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              Meaning Authority Boundary
            </span>
          </div>

          <p className="text-neutral-300 max-w-3xl">
            Representation is admissible only if explicit, informed, and
            revocable consent is present. Any system that asserts, fixes, or
            publishes meaning without consent constitutes failure.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CORE DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg leading-relaxed">
          Representation is admissible only if consent is explicit and authority
          over meaning is not assumed.
        </p>
        <p className="text-neutral-400 mt-4">
          Any assignment of meaning, intent, or identity without consent
          constitutes structural failure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* TESTED ASSUMPTION */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Tested Assumption</h2>
          <p className="text-neutral-600 mt-2">
            AI systems do not assert, fix, or publish meaning on behalf of a
            person without explicit, revocable consent.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold text-lg">Why This Matters</h2>
          <p className="text-neutral-600 mt-2">
            Representation without consent transfers authority from the person
            to the system, creating persistent misalignment between intent and
            public meaning. :contentReference[oaicite:0]{index=0}
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM DEFINITION */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">System Definition</h2>
        <p className="text-neutral-600">
          Representation is defined as any output that summarizes, titles,
          classifies, labels, or otherwise fixes meaning, intent, or identity in
          a way that may be interpreted as authoritative.
        </p>
      </section>

      {/* ===================================================== */}
      {/* GOVERNING VARIABLE */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Governing Variable</h2>
        <p className="text-neutral-600">
          Presence of explicit, informed, and revocable consent prior to any
          representational output, and absence of authority claims in that output.
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
          <li>System generates summaries, titles, or classifications of human input</li>
          <li>Evaluate whether explicit consent is obtained prior to representation</li>
          <li>Observe labeling of outputs as provisional or authoritative</li>
          <li>Test correction, withdrawal, and refusal mechanisms</li>
          <li>Evaluate behavior under ambiguity or contested meaning</li>
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
          System fails if it asserts, fixes, or publishes meaning, intent, or
          identity without explicit consent, or presents representation as
          authoritative or final.
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
          Valid systems must label all interpretive outputs as provisional and
          system-generated.
        </p>
        <p className="text-neutral-600">
          Representation must be opt-in, reversible, and immediately correctable
          without friction.
        </p>
        <p className="text-neutral-600">
          In cases of ambiguity or conflict, the system must defer to the human
          source and withdraw authority.
        </p>
      </section>

      {/* ===================================================== */}
      {/* BOUNDARY OF CLAIM */}
      {/* ===================================================== */}
      <section className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Boundary of Claim</h2>
        <p className="text-neutral-600">
          This constraint evaluates representational behavior only. It does not
          assess correctness of interpretation, only authority and consent.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
          <h3 className="font-semibold text-green-600">PASS</h3>
          <p className="text-neutral-600 mt-2">
            All representation is consented, labeled as provisional, and fully
            reversible without friction.
          </p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <h3 className="font-semibold text-red-600">FAIL</h3>
          <p className="text-neutral-600 mt-2">
            Any representation occurs without consent, is presented as
            authoritative, or cannot be corrected or withdrawn immediately.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* INVARIANT */}
      {/* ===================================================== */}
      <section className="rounded-2xl bg-black p-8 border border-white/10">
        <p className="text-white text-lg">
          Meaning belongs to the person, not the system.
        </p>
        <p className="text-neutral-400 mt-4">
          If a system fixes meaning without consent, it has crossed the boundary.
          Assistance must not become authorship of identity or intent.
        </p>
      </section>
    </main>
  );
}
