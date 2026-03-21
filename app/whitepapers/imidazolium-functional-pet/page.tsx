// app/whitepapers/imidazolium-functional-pet/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Imidazolium-Functional PET | Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether imidazolium functionality can remain structurally stable under high ionic strength conditions.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24 space-y-16">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-[32px] border border-white/10 bg-black p-12">
        <p className="text-xs uppercase tracking-[0.18em] text-white/60">
          White Paper · Constraint Assessment
        </p>

        <h1 className="mt-4 text-5xl text-white font-semibold">
          Imidazolium-Functional PET
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-white/70 leading-8">
          Evaluation of whether imidazolium-based ionic functionality can remain
          structurally stable and support ion transport under high ionic strength conditions.
        </p>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM CONSTRAINT */}
      {/* ===================================================== */}
      <section className="rounded-[36px] border border-white/10 bg-black p-14 text-center">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40 mb-6">
          System Constraint
        </h2>

        <p className="text-3xl text-white max-w-3xl mx-auto leading-[1.5]">
          Ion transport is admissible only if ionic functionality remains
          structurally retained under high ionic strength conditions.
        </p>

        <p className="mt-6 text-white/50">
          If ionic groups degrade, detach, or leach, the system is rejected.
        </p>
      </section>

      {/* ===================================================== */}
      {/* CONTEXT */}
      {/* ===================================================== */}
      <section className="max-w-3xl space-y-6">
        <h2 className="text-2xl text-white font-semibold">Problem Context</h2>

        <p className="text-white/70 leading-8">
          Ion transport materials often fail in saline environments due to
          leaching, degradation, and instability of functional groups.
        </p>

        <p className="text-white/70 leading-8">
          Structural anchoring offers a potential path to durable functionality
          without mobile ionic species.
        </p>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM CONSTRUCTION */}
      {/* ===================================================== */}
      <section className="max-w-3xl space-y-6">
        <h2 className="text-2xl text-white font-semibold">
          System Construction
        </h2>

        <p className="text-white/70 leading-8">
          Imidazolium-functional monomers are grafted onto PET to create
          covalently attached ionic sites distributed along the polymer.
        </p>
      </section>

      {/* ===================================================== */}
      {/* FAILURE CONDITION */}
      {/* ===================================================== */}
      <section className="rounded-xl border border-white/10 bg-white/[0.05] p-8 max-w-3xl">
        <h2 className="text-xl text-white font-semibold">
          Failure Condition
        </h2>

        <p className="mt-3 text-white/80 leading-8">
          The system fails if ionic functionality is lost under high ionic strength exposure.
        </p>
      </section>

      {/* ===================================================== */}
      {/* ADMISSIBILITY TEST */}
      {/* ===================================================== */}
      <section className="max-w-3xl space-y-6">
        <h2 className="text-2xl text-white font-semibold">
          Admissibility Test
        </h2>

        <p className="text-white/70 leading-8">
          Immersion in 1M NaCl followed by ion chromatography to quantify retained functionality.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-6">
            <h3 className="text-green-300 font-semibold">PASS</h3>
            <p className="mt-2 text-green-200/80">
              ≥90% ionic functionality retained with no leaching.
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h3 className="text-red-300 font-semibold">FAIL</h3>
            <p className="mt-2 text-red-200/80">
              &gt;10% functional loss or detectable leaching.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM DETERMINATION */}
      {/* ===================================================== */}
      <section className="text-center space-y-4">
        <div className="w-24 h-px bg-white/10 mx-auto" />

        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
          System Determination
        </p>

        <p className="text-white/70 max-w-2xl mx-auto">
          Admissibility is conditional on ionic stability under salt exposure.
          Transport claims are invalid if structural retention fails.
        </p>
      </section>

      {/* ===================================================== */}
      {/* FINAL DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-[36px] border border-white/10 bg-black p-16 text-center">
        <p className="text-3xl text-white leading-[1.5]">
          If functionality does not survive the environment it operates in,
          <br />
          it is not part of the material.
        </p>

        <p className="mt-6 text-white/60">
          Ion transport requires structural persistence.
        </p>
      </section>
    </main>
  );
}
