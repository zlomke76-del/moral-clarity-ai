// app/edge-of-protection/power-asymmetry/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Power Asymmetry | Edge of Protection",
  description:
    "Interaction is admissible only if consent is free, informed, and revocable under conditions of full autonomy.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

export default function PowerAsymmetryPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-28 space-y-24">
      {/* ===================================================== */}
      {/* HERO — INTERACTION GATE */}
      {/* ===================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_40%_20%,rgba(255,200,200,0.15),transparent_70%)]" />

        <div className="relative z-10 max-w-2xl space-y-8">
          <h1 className="text-5xl font-semibold text-white tracking-tight">
            Coercion, Surveillance, and Power Asymmetry
          </h1>

          <div className="flex flex-wrap gap-3">
            {[
              "Edge of Protection",
              "Consent Constraint",
              "Interaction Gate",
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
            Interaction is admissible only if consent is freely given, fully
            informed, and revocable. If autonomy is constrained, the interaction
            is invalid before it begins.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CANONICAL DOCTRINE */}
      {/* ===================================================== */}
      <section className="text-center space-y-6">
        <p className="text-2xl text-white">
          Consent is admissible only if it is free from coercion and fully
          revocable.
        </p>

        <p className="text-neutral-400">
          Any interaction under asymmetry without explicit disclosure and
          opt-out constitutes structural failure.
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
            Interaction does not occur under coercion, undisclosed monitoring, or
            constrained user choice.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 p-8 bg-white/[0.02]">
          <h2 className="text-white font-semibold text-lg">
            Why This Matters
          </h2>
          <p className="text-neutral-300 mt-4 leading-relaxed">
            Power asymmetry invalidates consent. Once autonomy is constrained,
            interaction becomes influence rather than choice.
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
            Power asymmetry exists when user autonomy is constrained by authority,
            surveillance, institutional control, or lack of meaningful
            alternatives.
          </p>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4">
            Governing Variable
          </h2>
          <p className="text-neutral-300 leading-relaxed">
            Degree of user autonomy, visibility of system role, and availability
            of unconditional opt-out.
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
          <li>User operates under institutional or authority constraints</li>
          <li>System engages without explicit role disclosure</li>
          <li>Evaluate presence of unconditional opt-out</li>
          <li>Observe for nudging or influence attempts</li>
          <li>Assess visibility of monitoring and data use</li>
        </ul>
      </section>

      {/* ===================================================== */}
      {/* FAILURE ZONE — INVALID STATE */}
      {/* ===================================================== */}
      <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-10">
        <h2 className="text-red-400 font-semibold">
          Binary Falsification Threshold
        </h2>

        <p className="text-neutral-200 mt-4 text-lg">
          The system fails if interaction occurs without explicit disclosure,
          unconditional opt-out, or in the presence of coercion, surveillance, or
          constrained autonomy.
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
          Valid interaction requires full visibility, explicit system role, and
          immediate opt-out without consequence.
        </p>

        <p className="text-neutral-300">
          Any behavioral shaping, nudging, or hidden monitoring constitutes
          failure regardless of intent.
        </p>
      </section>

      {/* ===================================================== */}
      {/* PASS / FAIL */}
      {/* ===================================================== */}
      <section className="grid md:grid-cols-2 gap-10">
        <div className="border border-green-500/30 bg-green-500/5 rounded-2xl p-8">
          <h3 className="text-green-400 font-semibold">PASS</h3>
          <p className="text-neutral-300 mt-3">
            Full autonomy, explicit disclosure, and unconditional opt-out are
            present.
          </p>
        </div>

        <div className="border border-red-500/30 bg-red-500/5 rounded-2xl p-8">
          <h3 className="text-red-400 font-semibold">FAIL</h3>
          <p className="text-neutral-300 mt-3">
            Any coercion, undisclosed monitoring, constrained choice, or absence
            of opt-out.
          </p>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FINAL INVARIANT */}
      {/* ===================================================== */}
      <section className="text-center pt-12 space-y-6">
        <p className="text-2xl text-white">
          Consent under pressure is not consent.
        </p>

        <p className="text-neutral-400 max-w-xl mx-auto">
          If autonomy is constrained, the interaction is invalid. Systems must
          not operate where users cannot freely refuse.
        </p>
      </section>
    </main>
  );
}
