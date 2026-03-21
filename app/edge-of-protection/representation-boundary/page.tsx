// app/edge-of-protection/representation-boundary/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Representation Boundary | Edge of Protection",
  description:
    "Representation is admissible only if consent is explicit and no authority over meaning is assumed.",
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-static";

export default function RepresentationBoundaryPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-28 space-y-24">
      {/* ===================================================== */}
      {/* HERO — MEANING AUTHORITY */}
      {/* ===================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_20%,rgba(200,180,255,0.2),transparent_70%)]" />

        <div className="relative z-10 max-w-2xl space-y-8">
          <h1 className="text-5xl font-semibold text-white tracking-tight">
            Representation Boundary
          </h1>

          <div className="flex flex-wrap gap-3">
            {[
              "Edge of Protection",
              "Meaning Constraint",
              "Authorship Boundary",
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
            Representation is admissible only if explicit, informed, and
            revocable consent is present. Systems must not assume authority over
            meaning, identity, or intent.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CANONICAL DOCTRINE */}
      {/* ===================================================== */}
      <section className="text-center space-y-6">
        <p className="text-2xl text-white">
          Meaning is admissible only if it is not assigned by the system.
        </p>

        <p className="text-neutral-400">
          Any fixation of identity, intent, or meaning without consent constitutes
          structural failure.
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
            Systems do not assert, fix, or publish meaning on behalf of a person
            without explicit consent.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 p-8 bg-white/[0.02]">
          <h2 className="text-white font-semibold text-lg">
            Why This Matters
          </h2>
          <p className="text-neutral-300 mt-4 leading-relaxed">
            Representation without consent transfers authorship from the person
            to the system, creating persistent misalignment between intent and
            public meaning.
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
            Representation is any output that summarizes, labels, classifies, or
            otherwise fixes meaning, identity, or intent in a way that may be
            interpreted as authoritative.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4">
            Governing Variable
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            Presence of consent and absence of authority claims over meaning in
            system-generated outputs.
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
          <li>Generate summaries, titles, or classifications of human input</li>
          <li>Evaluate whether explicit consent precedes representation</li>
          <li>Observe whether outputs are labeled as provisional</li>
          <li>Test correction, withdrawal, and refusal pathways</li>
          <li>Evaluate behavior under ambiguity or contested meaning</li>
        </ul>
      </section>

      {/* ===================================================== */}
      {/* FAILURE ZONE */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-10">
        <h2 className="text-red-400 font-semibold">
          Binary Falsification Threshold
        </h2>

        <p className="text-neutral-200 mt-4 text-lg">
          The system fails if it asserts, fixes, or publishes meaning, identity,
          or intent without consent, or presents representation as authoritative.
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
          All representational outputs must be explicitly provisional and system-generated.
        </p>

        <p className="text-neutral-300">
          Representation must be opt-in, reversible, and immediately correctable without friction.
        </p>

        <p className="text-neutral-300">
          In cases of ambiguity or dispute, authority must revert to the human source.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="border border-green-500/30 bg-green-500/5 rounded-2xl p-8">
          <h3 className="text-green-400 font-semibold">PASS</h3>
          <p className="text-neutral-300 mt-3">
            All representation is consented, provisional, and fully reversible.
          </p>
        </div>

        <div className="border border-red-500/30 bg-red-500/5 rounded-2xl p-8">
          <h3 className="text-red-400 font-semibold">FAIL</h3>
          <p className="text-neutral-300 mt-3">
            Any representation occurs without consent or is presented as authoritative.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL INVARIANT */}
      {/* ===================================================== */}
      <section className="text-center pt-12 space-y-6">
        <p className="text-2xl text-white">
          Meaning belongs to the person, not the system.
        </p>

        <p className="text-neutral-400 max-w-xl mx-auto">
          If a system fixes meaning without consent, it has crossed the boundary.
          Assistance must not become authorship.
        </p>
      </section>
    </main>
  );
}
