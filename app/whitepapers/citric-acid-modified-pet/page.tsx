// app/whitepapers/citric-acid-modified-pet/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Citric Acid–Modified PET | Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether citric-derived functionality enables controlled, structurally governed hydrolytic response in PET.",
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
            Citric Acid–Modified PET
          </h1>

          <p className="max-w-2xl text-lg text-white/70 leading-8">
            Evaluation of whether citric-derived functionality can enable
            controlled hydrolytic susceptibility governed by retained structure
            rather than uncontrolled degradation or additive behavior.
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
          Hydrolytic susceptibility is admissible only if it is controlled by
          structurally retained citric-derived functionality.
        </p>

        <p className="mt-6 text-white/50">
          If response is uncontrolled or decoupled from structure, the system is rejected.
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
          PET durability limits controlled end-of-life behavior, while additive
          approaches introduce variability and loss of structural control.
        </p>

        <p className="text-white/70 leading-8">
          Structural modification offers a pathway to predictable hydrolytic response
          without compromising in-use stability.
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
          Citric-acid-derived triacid functionality is incorporated during PET
          polycondensation to introduce controlled hydrolytic response points.
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
          The system fails if citric-derived functionality is lost or if
          hydrolytic response becomes unpredictable or decoupled from structure.
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
          Neutral water immersion at 80°C for 7 days followed by quantification
          of retained acid functionality and response consistency.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-6">
            <h3 className="text-green-300 font-semibold">PASS</h3>
            <p className="mt-2 text-green-200/80">
              Structural retention with predictable, condition-dependent response.
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h3 className="text-red-300 font-semibold">FAIL</h3>
            <p className="mt-2 text-red-200/80">
              Loss of structure or uncontrolled degradation behavior.
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
          Admissibility is conditional on structural retention and predictable
          hydrolytic response. Claims are invalid if behavior is uncontrolled.
        </p>
      </section>

      {/* ===================================================== */}
      {/* FINAL DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-[36px] border border-white/10 bg-black p-16 text-center">
        <p className="text-3xl text-white leading-[1.5]">
          Degradation is admissible only if it is controlled by structure.
        </p>

        <p className="mt-6 text-white/60">
          If behavior cannot be predicted,
        </p>

        <p className="mt-2 text-white/40">
          it is not governed by the material.
        </p>
      </section>
    </main>
  );
}
