// app/edge-of-knowledge/irreversible-gradient-ratcheting-composites/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Irreversible Gradient-Ratcheting Composites (IGRC) | Moral Clarity AI",
  description:
    "A trajectory-dependent claim boundary where irreversible interfacial evolution invalidates endpoint-only durability and improvement claims.",
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function IGRCPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Trajectory-Dependent Claim Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Irreversible Gradient-Ratcheting Composites (IGRC)
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Structural evolution is irreversible and path-dependent. Endpoint equivalence is invalid.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Trajectory required · Endpoint invalid · Irreversible state accumulation
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Statement">
        <p>
          IGRC defines a class of composite architectures in which sustained
          environmental gradients irreversibly increase internal structural
          order through interfacial mechanochemistry.
        </p>

        <p className="text-red-300">
          Structural state is a function of exposure trajectory—not endpoint condition.
        </p>
      </Section>

      {/* DOCTRINE */}
      <Section title="Doctrine Constraint">
        <p>
          Durability or improvement claims are valid only if internal state
          evolution is tracked as a function of gradient exposure history.
        </p>

        <p className="text-red-300">
          Endpoint-equivalent treatments cannot reproduce trajectory-dependent states.
        </p>
      </Section>

      {/* ARCHITECTURE */}
      <Section title="Architectural Requirements">
        <ul className="list-disc pl-6">
          <li>Semi-crystalline or partially ordered matrix</li>
          <li>Mechanically anisotropic secondary phase</li>
          <li>Irreversible mechanochemical interfacial linkages</li>
          <li>No reversible or externally actuated mechanisms</li>
        </ul>
      </Section>

      {/* MECHANISM */}
      <Section title="Governing Mechanism">
        <ul className="list-disc pl-6">
          <li>Localized interfacial bond rupture</li>
          <li>Irreversible re-bonding in new topology</li>
          <li>Directional alignment and trapping</li>
        </ul>

        <p className="text-red-300">
          Each activation event ratchets internal structure irreversibly.
        </p>
      </Section>

      {/* STATE */}
      <Section title="State Representation (MTI-1)">
        <ul className="list-disc pl-6">
          <li>ψ_if — irreversible interfacial bond density</li>
          <li>Φ_al — alignment order parameter</li>
          <li>Λ_cr — ordered domain fraction</li>
        </ul>

        <p className="text-red-300">
          These must evolve monotonically with exposure trajectory.
        </p>
      </Section>

      {/* NON-COMMUTATIVE */}
      <Section title="Non-Commutativity Constraint">
        <p>
          Identical endpoints reached via different gradient histories produce
          different internal states.
        </p>

        <p className="text-red-300">
          If states are reproducible by endpoint treatment, IGRC is invalid.
        </p>
      </Section>

      {/* FAILURE */}
      <Section title="Failure Condition">
        <p>
          Failure initiates at the interface if ratcheting is absent or unstable.
        </p>
      </Section>

      {/* FALSIFICATION */}
      <Section title="Decisive Falsification">
        <p>
          The system fails if:
        </p>

        <ul className="list-disc pl-6">
          <li>No irreversible state evolution occurs</li>
          <li>State variables are endpoint-reproducible</li>
          <li>Trajectory dependence is absent</li>
        </ul>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Gradient-preserving transformations</p>
        <p><strong>Q:</strong> Material mass and chemistry</p>
        <p><strong>S:</strong> Irreversible internal state spectrum</p>

        <p className="text-red-300">
          Failure: S is endpoint-reproducible or non-monotonic
        </p>
      </Section>

      {/* CLAIM BOUNDARY */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Durability, improvement, or safety claims that are not expressed as a
          function of trajectory over S are invalid.
        </p>

        <p className="text-red-300">
          Properties do not exist independently of history in this regime.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Improvement is not a property. It is a trajectory. Any claim that
          ignores path-dependent state accumulation exceeds its epistemic authority.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Trajectory-bound · Irreversible · Versioned
      </div>
    </main>
  );
}
