// app/whitepapers/zwitterion-modified-pet/page.tsx
// ============================================================
// WHITE PAPER (UPGRADED TO CONSTRAINT FRAME)
// Zwitterion-Modified PET — CONDITIONAL
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Zwitterion-Modified PET | Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether zwitterionic PET systems provide durable anti-fouling performance under extraction and environmental stress.",
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
            Zwitterion-Modified PET
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-white/75">
            Evaluation of whether zwitterionic functionalization of PET enables
            durable anti-fouling and biofilm resistance under extraction and
            environmental stress.
          </p>
        </div>
      </section>

      {/* CORE DOCTRINE */}
      <section className="rounded-2xl border border-white/10 bg-black p-8">
        <p className="text-xl text-white leading-8">
          Anti-fouling behavior is admissible only if zwitterionic functionality
          remains structurally retained and surface properties persist under
          environmental and extraction stress.
        </p>
        <p className="mt-3 text-white/60">
          If functional groups shift, degrade, or detach, the system fails as a
          durable low-fouling surface.
        </p>
      </section>

      {/* TESTED ASSUMPTION + WHY */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Tested Assumption
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            Zwitterionic groups can be covalently incorporated into PET to
            provide persistent hydration layers and resist fouling and biofilm
            formation.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Why This Matters
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            If valid, surfaces can resist contamination and reduce cleaning
            burden. If invalid, performance degrades and fouling risk returns
            under real-world conditions.
          </p>
        </div>
      </section>

      {/* SYSTEM DEFINITION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          System Definition
        </h2>
        <p className="text-white/70 leading-8">
          A PET-based material incorporating sulfobetaine or similar zwitterionic
          groups through grafting or copolymerization to produce a hydrated,
          charge-balanced surface.
        </p>
      </section>

      {/* GOVERNING VARIABLE */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Governing Variable
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Retention of surface chemistry (S/N ratio) and anti-fouling behavior
          after thermal and aqueous extraction.
        </p>
      </section>

      {/* BOUNDARY SETUP */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Boundary Setup
        </h2>
        <ul className="list-disc pl-6 text-white/70 space-y-2">
          <li>Hot water extraction at ≥85°C</li>
          <li>XPS surface composition analysis (S/N ratio)</li>
          <li>Biofouling or protein adsorption testing pre/post extraction</li>
          <li>Repeated exposure cycles</li>
          <li>Comparison to untreated PET baseline</li>
        </ul>
      </section>

      {/* FALSIFICATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Binary Falsification Threshold
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          FAIL if greater than 10% shift in S/N ratio is observed after
          extraction or if anti-fouling performance declines measurably.
        </p>
      </section>

      {/* OPERATIONAL INTERPRETATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Operational Interpretation
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Zwitterionic surfaces can resist fouling through hydration layer
          formation, but effectiveness depends on graft stability, density, and
          resistance to environmental degradation.
        </p>
      </section>

      {/* BOUNDARY OF CLAIM */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Boundary of Claim
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Anti-fouling claims are admissible only where surface chemistry and
          performance persist under realistic conditions. Any claim of permanent
          resistance without retention evidence constitutes failure.
        </p>
      </section>

      {/* PASS / FAIL */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-8">
          <h3 className="text-lg font-semibold text-green-300">PASS</h3>
          <p className="mt-3 text-green-200/80 leading-7">
            Surface chemistry and anti-fouling behavior remain stable under
            extraction and environmental exposure.
          </p>
        </div>

        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8">
          <h3 className="text-lg font-semibold text-red-300">FAIL</h3>
          <p className="mt-3 text-red-200/80 leading-7">
            Functional loss, surface degradation, or fouling increases under
            realistic conditions.
          </p>
        </div>
      </section>

      {/* INVARIANT */}
      <section className="rounded-2xl border border-white/10 bg-black p-10">
        <p className="text-2xl text-white leading-9">
          If the surface state cannot persist, the function cannot persist.
        </p>
        <p className="mt-4 text-white/60 leading-7">
          Anti-fouling is defined by stability, not initial performance.
        </p>
      </section>
    </main>
  );
}
