// app/whitepapers/biguanide-diacid-antimicrobial-pet/page.tsx
// ============================================================
// WHITE PAPER
// Biguanide Diacid–Functional Antimicrobial PET
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Biguanide Diacid–Functional Antimicrobial PET | Moral Clarity AI",
  description:
    "A regime-bounded white paper examining whether covalently anchored biguanide functionality can produce extraction-stable antimicrobial PET without leaching.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <article className="space-y-10">
        {/* HEADER */}
        <header className="space-y-4 border-b pb-8">
          <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
            White Paper · Anchored PET Candidate
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Biguanide Diacid–Functional Antimicrobial PET
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600">
            A bounded materials investigation into whether biguanide
            functionality can be covalently anchored into PET to produce
            antimicrobial behavior that is structurally retained rather than
            dependent on leaching or mobile additives.
          </p>
        </header>

        {/* ABSTRACT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Abstract</h2>
          <p className="leading-8 text-neutral-700">
            This paper evaluates the admissibility of incorporating
            biguanide-functional diacids into polyethylene terephthalate (PET)
            as a route to antimicrobial surface behavior. The central constraint
            is not activity, but retention. Antimicrobial function is admissible
            only if it is structurally anchored and survives extraction without
            measurable loss of functional integrity.
          </p>
          <p className="leading-8 text-neutral-700">
            The governing condition is binary: if antimicrobial behavior depends
            on extractable species, the system fails as an anchored material and
            reverts to an additive-based mechanism.
          </p>
        </section>

        {/* PROBLEM CONTEXT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Context</h2>
          <p className="leading-8 text-neutral-700">
            Biguanides are widely recognized for antimicrobial activity, but
            their conventional use introduces a structural weakness: reliance on
            mobility. Migration, leaching, and depletion over time undermine
            durability and introduce potential exposure concerns.
          </p>
          <p className="leading-8 text-neutral-700">
            For PET to support antimicrobial behavior without these liabilities,
            the active functionality must be covalently retained and persist
            under extraction, thermal, and use conditions.
          </p>
        </section>

        {/* THESIS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conceptual Thesis</h2>
          <p className="leading-8 text-neutral-700">
            Incorporating biguanide-functional diacids into PET during synthesis
            may enable antimicrobial functionality that is structurally anchored
            rather than mobile. This creates the possibility of durable surface
            activity without reliance on additive release.
          </p>
          <p className="leading-8 text-neutral-700">
            This concept is admissible only if antimicrobial performance
            persists after extraction stress and is not dependent on residual or
            releasable species.
          </p>
        </section>

        {/* FUNCTIONALIZATION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Functionalization Strategy</h2>
          <p className="leading-8 text-neutral-700">
            Biguanide-bearing diacids are introduced during PET polymerization
            at low molar fractions. The objective is to integrate antimicrobial
            functionality directly into the polymer backbone or pendant chain
            positions while preserving PET’s processability and structural
            integrity.
          </p>
          <p className="leading-8 text-neutral-700">
            This approach is not presented as a manufacturing claim. It is a
            constrained structural hypothesis subject to retention-based
            validation.
          </p>
        </section>

        {/* FAILURE CONDITION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Primary Failure Condition</h2>
          <p className="leading-8 text-neutral-700">
            The system fails if antimicrobial behavior diminishes following
            extraction or if measurable loss of functional groups is detected.
          </p>
          <p className="leading-8 text-neutral-700">
            Any dependency on leachable species invalidates the concept as an
            anchored antimicrobial material.
          </p>
        </section>

        {/* ADMISSIBILITY TEST */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Admissibility Test</h2>
          <p className="leading-8 text-neutral-700">
            Soxhlet extraction is used as the governing stress condition,
            followed by antimicrobial assay and functional retention analysis.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>FAIL:</strong> Antimicrobial performance decreases or
            functional retention falls below 90% after extraction.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>PASS:</strong> Antimicrobial behavior persists with ≥90%
            functional retention and no evidence of extractable active species.
          </p>
        </section>

        {/* PROJECTED CAPABILITY */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projected Capability</h2>
          <p className="leading-8 text-neutral-700">
            If retention holds, the material may enable antimicrobial PET
            surfaces that maintain functionality without depletion, migration,
            or additive release. This represents a shift from consumable
            antimicrobial systems to structurally persistent ones.
          </p>
          <p className="leading-8 text-neutral-700">
            These capabilities are conditional and invalid if the retention
            threshold fails.
          </p>
        </section>

        {/* NON-CLAIMS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Non-Claims</h2>
          <p className="leading-8 text-neutral-700">
            This paper does not claim validated antimicrobial efficacy across
            organisms, regulatory approval, toxicological clearance, or
            commercial readiness.
          </p>
          <p className="leading-8 text-neutral-700">
            It defines a candidate system and the constraint conditions under
            which it becomes materially credible.
          </p>
        </section>

        {/* CONCLUSION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="leading-8 text-neutral-700">
            Biguanide-functional PET is admissible only if antimicrobial
            behavior survives extraction as a function of retained structure.
          </p>
          <p className="leading-8 text-neutral-700">
            If retention fails, the system collapses into an additive-dependent
            model and loses its claim as an anchored antimicrobial material.
          </p>
        </section>

        {/* INVARIANT */}
        <section className="border-t pt-8">
          <p className="text-xl leading-8">
            Antimicrobial function is admissible only if it remains after
            extraction.
          </p>
          <p className="mt-2 text-neutral-600">
            If activity depends on what leaves the material, the material has
            already failed.
          </p>
        </section>
      </article>
    </main>
  );
}
