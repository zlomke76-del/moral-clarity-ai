// app/whitepapers/biguanide-diacid-antimicrobial-pet/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Biguanide-Functional Antimicrobial PET | Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether antimicrobial functionality is structurally retained in PET without dependence on leaching.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24 space-y-16">
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className="rounded-[32px] border border-white/10 bg-black p-12">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 uppercase tracking-[0.18em]">
              White Paper
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 uppercase tracking-[0.18em]">
              Constraint Assessment
            </span>
            <span className="rounded-full border border-yellow-400/30 px-3 py-1 text-xs text-yellow-300 uppercase tracking-[0.18em]">
              STATUS: CONDITIONAL
            </span>
          </div>

          <h1 className="text-5xl text-white font-semibold tracking-tight">
            Biguanide-Functional Antimicrobial PET
          </h1>

          <p className="max-w-2xl text-lg text-white/70 leading-8">
            Evaluation of whether antimicrobial behavior can be structurally
            anchored in PET without reliance on leaching or mobile additives.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SYSTEM CONSTRAINT */}
      {/* ===================================================== */}
      <section className="rounded-[36px] border border-white/10 bg-black p-14 text-center">
        <h2 className="text-xs uppercase tracking-[0.25em] text-white/40 mb-6">
          System Constraint
        </h2>

        <p className="text-3xl text-white max-w-3xl mx-auto leading-[1.5]">
          Antimicrobial function is admissible only if it remains after extraction
          as a property of the material itself.
        </p>

        <p className="mt-6 text-white/50">
          If activity depends on extractable species, the system is rejected.
        </p>
      </section>

      {/* ===================================================== */}
      {/* CONTEXT */}
      {/* ===================================================== */}
      <section className="max-w-3xl space-y-6">
        <h2 className="text-2xl text-white font-semibold">
          Problem Context
        </h2>

        <p className="text-white/70 leading-8">
          Conventional antimicrobial systems rely on mobile active agents,
          leading to depletion, migration, and loss of function over time.
        </p>

        <p className="text-white/70 leading-8">
          Structural anchoring offers a potential path to persistent activity
          without release-based mechanisms.
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
          Biguanide-functional diacids are incorporated during PET synthesis to
          create covalently anchored antimicrobial sites.
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
          The system fails if antimicrobial activity diminishes after extraction
          or if functional groups are lost.
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
          Soxhlet extraction followed by antimicrobial assay and functional retention analysis.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-6">
            <h3 className="text-green-300 font-semibold">PASS</h3>
            <p className="mt-2 text-green-200/80">
              Activity persists with ≥90% functional retention and no leaching.
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h3 className="text-red-300 font-semibold">FAIL</h3>
            <p className="mt-2 text-red-200/80">
              Activity declines or depends on extractable species.
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
          Admissibility is conditional on antimicrobial persistence without
          extractable contribution. Claims are invalid if function depends on release.
        </p>
      </section>

      {/* ===================================================== */}
      {/* FINAL DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-[36px] border border-white/10 bg-black p-16 text-center">
        <p className="text-3xl text-white leading-[1.5]">
          If activity depends on what leaves,
          <br />
          it was never part of the material.
        </p>

        <p className="mt-6 text-white/60">
          Function must be owned.
        </p>

        <p className="mt-2 text-white/40">
          Not borrowed.
        </p>
      </section>
    </main>
  );
}
