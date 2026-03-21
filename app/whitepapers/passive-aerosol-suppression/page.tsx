// app/whitepapers/passive-aerosol-suppression/page.tsx
// ============================================================
// WHITE PAPER (UPGRADED TO CONSTRAINT FRAME)
// Passive Aerosol Persistence Suppression — NO-GO
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Passive Aerosol Persistence Suppression | Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether passive materials or geometry can reduce aerosol persistence at room scale without power, filtration, or chemistry.",
  robots: { index: true, follow: true },
};

export default function PassiveAerosolSuppressionWhitepaper() {
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
            <span className="rounded-full border border-red-400/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-red-300">
              NO-GO
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Passive Aerosol Persistence Suppression
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-white/75">
            Evaluation of whether passive materials or geometry can reduce
            aerosol persistence at room scale without power, filtration, or
            chemistry.
          </p>
        </div>
      </section>

      {/* CORE DOCTRINE */}
      <section className="rounded-2xl border border-white/10 bg-black p-8">
        <p className="text-xl text-white leading-8">
          Aerosol suppression is admissible only if persistence is reduced under
          real-world room conditions without reliance on active systems.
        </p>
        <p className="mt-3 text-white/60">
          If effects collapse outside controlled environments, the system fails.
        </p>
      </section>

      {/* TESTED ASSUMPTION + WHY */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Tested Assumption
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            Passive materials or geometry can meaningfully reduce aerosol
            suspension time at room scale.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold text-white">
            Why This Matters
          </h2>
          <p className="mt-3 text-white/70 leading-7">
            If true, passive systems could offer low-cost mitigation for airborne
            disease and particulate exposure. If false, they introduce false
            confidence and displace effective interventions.
          </p>
        </div>
      </section>

      {/* SYSTEM DEFINITION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          System Definition
        </h2>
        <p className="text-white/70 leading-8">
          A passive material or geometric configuration intended to reduce
          airborne aerosol persistence without airflow, filtration, ionization,
          or chemical interaction.
        </p>
      </section>

      {/* GOVERNING VARIABLE */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Governing Variable
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Measurable reduction in aerosol half-life under realistic indoor
          conditions dominated by convection, human activity, and environmental
          variability.
        </p>
      </section>

      {/* BOUNDARY SETUP */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Boundary Setup
        </h2>
        <ul className="list-disc pl-6 text-white/70 space-y-2">
          <li>Matched rooms differing only by passive intervention</li>
          <li>No active airflow, filtration, or ionization</li>
          <li>Repeated aerosol decay measurements (0.3–10 μm)</li>
          <li>Controlled temperature and humidity</li>
          <li>Occupied versus unoccupied conditions</li>
        </ul>
      </section>

      {/* FALSIFICATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Binary Falsification Threshold
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          FAIL if no statistically significant, reproducible reduction in aerosol
          half-life is observed beyond environmental variability.
        </p>
      </section>

      {/* OPERATIONAL INTERPRETATION */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Operational Interpretation
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Minor local effects may appear in controlled chambers, but are
          dominated by convection, humidity, and human activity in real-world
          environments. Passive mechanisms do not scale.
        </p>
      </section>

      {/* BOUNDARY OF CLAIM */}
      <section className="rounded-xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-2xl font-semibold text-white">
          Boundary of Claim
        </h2>
        <p className="mt-3 text-white/70 leading-8">
          Effects are admissible only in small, controlled, low-disturbance
          environments. Any claim of room-scale aerosol suppression constitutes
          failure.
        </p>
      </section>

      {/* PASS / FAIL */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-8">
          <h3 className="text-lg font-semibold text-green-300">PASS</h3>
          <p className="mt-3 text-green-200/80 leading-7">
            Measurable reduction in aerosol half-life persists under real-world
            room conditions.
          </p>
        </div>

        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8">
          <h3 className="text-lg font-semibold text-red-300">FAIL</h3>
          <p className="mt-3 text-red-200/80 leading-7">
            Effects are local, transient, or disappear outside controlled
            laboratory environments.
          </p>
        </div>
      </section>

      {/* INVARIANT */}
      <section className="rounded-2xl border border-white/10 bg-black p-10">
        <p className="text-2xl text-white leading-9">
          If it does not scale, it does not solve the problem.
        </p>
        <p className="mt-4 text-white/60 leading-7">
          Local effects without room-level impact are not admissible as
          mitigation.
        </p>
      </section>
    </main>
  );
}
