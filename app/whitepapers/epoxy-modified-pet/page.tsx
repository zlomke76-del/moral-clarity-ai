// app/whitepapers/epoxy-modified-pet/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Epoxy-Modified PET | Constraint Assessment | Moral Clarity AI",
  description:
    "A constraint-bound evaluation of whether epoxy functionality can remain structurally stable under hydrolytic stress.",
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
            Epoxy-Modified PET
          </h1>

          <p className="max-w-2xl text-lg text-white/70 leading-8">
            Evaluation of whether epoxy-functional diacids can be structurally
            incorporated into PET to enable durable adhesion and barrier
            performance without functional loss under chemical stress.
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
          Adhesion and barrier enhancement are admissible only if epoxy
          functionality remains structurally intact under hydrolytic stress.
        </p>

        <p className="mt-6 text-white/50">
          If epoxy groups degrade under chemical exposure, the system is rejected.
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
          PET adhesion and barrier performance are often enhanced through
          coatings or multilayer systems, introducing complexity and failure pathways.
        </p>

        <p className="text-white/70 leading-8">
          Structural modification offers a route to intrinsic performance without
          external systems.
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
          Glycidyl-functional diacids are incorporated into PET during
          polycondensation to embed epoxy functionality within the polymer structure.
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
          The system fails if epoxy functionality is lost or degraded under
          hydrolytic exposure.
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
          Exposure to 1M HCl for 24 hours followed by quantification of retained epoxy groups.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-6">
            <h3 className="text-green-300 font-semibold">PASS</h3>
            <p className="mt-2 text-green-200/80">
              ≥90% epoxy functionality retained.
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <h3 className="text-red-300 font-semibold">FAIL</h3>
            <p className="mt-2 text-red-200/80">
              &lt;90% retention after hydrolysis.
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
          Admissibility is conditional on epoxy retention under chemical stress.
          Adhesion and barrier claims are invalid if structural survivability fails.
        </p>
      </section>

      {/* ===================================================== */}
      {/* FINAL DOCTRINE */}
      {/* ===================================================== */}
      <section className="rounded-[36px] border border-white/10 bg-black p-16 text-center">
        <p className="text-3xl text-white leading-[1.5]">
          If the reactive structure does not survive chemistry,
          <br />
          the material does not gain function.
        </p>

        <p className="mt-6 text-white/60">
          Chemistry does not enhance structure.
        </p>

        <p className="mt-2 text-white/40">
          It tests it.
        </p>
      </section>
    </main>
  );
}
