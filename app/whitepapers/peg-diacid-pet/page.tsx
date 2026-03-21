// app/whitepapers/peg-diacid-pet/page.tsx
// ============================================================
// WHITE PAPER (UPGRADED TO CONSTRAINT FRAME)
// PEG-Diacid PET Copolymer — CONDITIONAL
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "PEG-Diacid PET Copolymer | Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether PEG diacid incorporation into PET enables durable flexibility and biocompatibility without leaching or instability.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20 space-y-10">
      {/* HERO */}
      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0b1220] via-[#0a0f1a] to-black p-10 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
              White Paper
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
              Constraint Assessment
            </span>
            <span className="rounded-full border border-yellow-400/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-yellow-300">
              CONDITIONAL
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            PEG-Diacid PET Copolymer
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-white/75">
            Evaluation of whether PEG-derived flexibility and hydration
            compatibility can be structurally retained within PET without
            leaching or instability.
          </p>
        </div>
      </section>

      {/* CORE DOCTRINE */}
      <section className="rounded-2xl border border-white/10 bg-black p-8">
        <p className="text-xl text-white leading-8">
          PEG functionality is admissible only if hydration-induced behavior
          remains structurally stable and does not result in mass drift or
          extractable loss.
        </p>
        <p className="mt-3 text-white/60">
          If water interaction alters mass or structure beyond threshold, the
          system fails as a stable copolymer.
        </p>
      </section>

      {/* TESTED ASSUMPTION + WHY */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Tested Assumption
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            PEG segments can be covalently integrated into PET to provide
            flexibility and hydration compatibility without leaching.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Why This Matters
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            If valid, PEG-modified PET enables softer, more biocompatible
            materials. If invalid, it introduces instability, leaching risk, and
            loss of performance.
          </p>
        </div>
      </section>

      {/* SYSTEM DEFINITION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          System Definition
        </h2>
        <p className="text-white/70 leading-8">
          A PET copolymer incorporating low-molecular-weight PEG diacids intended
          to introduce flexible, hydrophilic segments into the polymer backbone.
        </p>
      </section>

      {/* GOVERNING VARIABLE */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Governing Variable
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Mass and structural stability under repeated hydration and
          dehydration cycles.
        </p>
      </section>

      {/* BOUNDARY SETUP */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Boundary Setup
        </h2>
        <ul className="list-disc pl-6 text-white/70 space-y-2">
          <li>Repeated water absorption cycles</li>
          <li>Controlled drying and desorption phases</li>
          <li>Mass tracking across cycles</li>
          <li>Structural and mechanical property measurement</li>
          <li>Comparison to non-PEG PET controls</li>
        </ul>
      </section>

      {/* FALSIFICATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Binary Falsification Threshold
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          FAIL if mass drift exceeds 15% across hydration cycles or if
          structural instability is observed.
        </p>
      </section>

      {/* OPERATIONAL INTERPRETATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Operational Interpretation
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          PEG incorporation can improve flexibility and hydration response, but
          introduces risk of swelling, mass variation, and long-term instability
          if not structurally constrained.
        </p>
      </section>

      {/* BOUNDARY OF CLAIM */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Boundary of Claim
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Benefits are admissible only in systems where hydration cycles do not
          produce structural drift or mass loss beyond threshold. Any claim of
          stable biocompatibility without retention constitutes failure.
        </p>
      </section>

      {/* PASS / FAIL */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-8">
          <h3 className="text-lg font-semibold text-green-300">PASS</h3>
          <p className="mt-3 text-green-200/80 leading-7">
            Mass and structure remain stable across hydration cycles with no
            significant drift.
          </p>
        </div>

        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8">
          <h3 className="text-lg font-semibold text-red-300">FAIL</h3>
          <p className="mt-3 text-red-200/80 leading-7">
            Mass drift or structural instability exceeds threshold under
            hydration conditions.
          </p>
        </div>
      </section>

      {/* INVARIANT */}
      <section className="rounded-2xl border border-white/10 bg-black p-10">
        <p className="text-2xl text-white leading-9">
          If water changes the structure, the structure is not stable.
        </p>
        <p className="mt-4 text-white/60 leading-7">
          Hydration that alters mass or form is not compatibility—it is drift.
        </p>
      </section>
    </main>
  );
}
