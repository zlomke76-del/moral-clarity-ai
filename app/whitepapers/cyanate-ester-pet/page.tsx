// app/whitepapers/cyanate-ester-pet/page.tsx
// ============================================================
// WHITE PAPER
// Cyanate Ester–PET Copolymer
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cyanate Ester–PET Copolymer | Moral Clarity AI",
  description:
    "A regime-bounded white paper examining whether aromatic cyanate ester functionality can be structurally incorporated into PET to enable elevated thermal durability without functional loss.",
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
            Cyanate Ester–PET Copolymer
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600">
            A bounded materials investigation into whether aromatic cyanate
            ester functionality can be structurally incorporated into PET to
            improve thermal durability and dimensional stability without loss
            of functional integrity under high-temperature exposure.
          </p>
        </header>

        {/* ABSTRACT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Abstract</h2>
          <p className="leading-8 text-neutral-700">
            This paper evaluates the admissibility of incorporating aromatic
            cyanate ester groups into polyethylene terephthalate (PET) as a
            route to enhanced thermal resistance. The central constraint is
            functional retention under heat. Thermal durability is admissible
            only if the cyanate-derived structure remains intact after
            high-temperature exposure.
          </p>
          <p className="leading-8 text-neutral-700">
            If functional groups degrade or are lost under thermal stress, the
            system fails as a structurally enhanced material and reverts to
            baseline PET behavior.
          </p>
        </section>

        {/* PROBLEM CONTEXT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Context</h2>
          <p className="leading-8 text-neutral-700">
            PET is widely used for its mechanical strength and processability,
            but its performance degrades under elevated temperatures, limiting
            its use in high-heat environments such as transportation,
            electronics, and infrastructure systems.
          </p>
          <p className="leading-8 text-neutral-700">
            Conventional approaches to improving thermal resistance often rely
            on fillers, blends, or coatings, introducing complexity and
            potential failure modes.
          </p>
          <p className="leading-8 text-neutral-700">
            A structurally modified PET incorporating thermally stable
            functional groups offers a potential route to intrinsic heat
            resistance without reliance on external reinforcement systems.
          </p>
        </section>

        {/* THESIS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conceptual Thesis</h2>
          <p className="leading-8 text-neutral-700">
            Introducing aromatic cyanate ester functionality into PET at low
            molar fractions may enable formation of thermally stable triazine
            structures, improving resistance to heat-induced deformation and
            degradation.
          </p>
          <p className="leading-8 text-neutral-700">
            This concept is admissible only if the cyanate-derived structure is
            retained after thermal exposure and contributes to measurable
            stability.
          </p>
        </section>

        {/* FUNCTIONALIZATION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Functionalization Strategy</h2>
          <p className="leading-8 text-neutral-700">
            Aromatic cyanate ester monomers are introduced into PET during
            synthesis at low molar fractions. Under appropriate conditions,
            these groups can form crosslinked triazine structures that are
            thermally stable.
          </p>
          <p className="leading-8 text-neutral-700">
            This is a constrained structural hypothesis. It does not assume
            improved thermal performance unless functional retention is
            demonstrated under stress.
          </p>
        </section>

        {/* FAILURE CONDITION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Primary Failure Condition</h2>
          <p className="leading-8 text-neutral-700">
            The system fails if cyanate-derived functionality degrades or is
            lost under high-temperature exposure, as indicated by measurable
            reduction in cyano-related spectral features.
          </p>
          <p className="leading-8 text-neutral-700">
            Functional loss indicates that thermal resistance is not
            structurally supported and cannot be treated as a durable property.
          </p>
        </section>

        {/* ADMISSIBILITY TEST */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Admissibility Test</h2>
          <p className="leading-8 text-neutral-700">
            Thermal exposure at 250°C for 1 hour is used as the governing stress
            condition, followed by infrared (IR) analysis to quantify retention
            of cyano-related functional groups.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>FAIL:</strong> greater than 10% loss of cyano-related IR
            signal after exposure.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>PASS:</strong> cyano-related functionality remains within
            90% of baseline, indicating structural retention under thermal
            stress.
          </p>
          <p className="leading-8 text-neutral-700">
            This threshold defines survivability, not peak performance.
          </p>
        </section>

        {/* PROJECTED CAPABILITY */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projected Capability</h2>
          <p className="leading-8 text-neutral-700">
            If retention holds, cyanate-modified PET may exhibit improved
            dimensional stability, mechanical integrity, and resistance to
            thermal deformation in high-temperature environments.
          </p>
          <p className="leading-8 text-neutral-700">
            This could support longer-lived components in transportation,
            infrastructure, and electronics where heat exposure is a limiting
            factor.
          </p>
          <p className="leading-8 text-neutral-700">
            These capabilities are conditional and invalid if the retention
            requirement fails.
          </p>
        </section>

        {/* NON-CLAIMS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Non-Claims</h2>
          <p className="leading-8 text-neutral-700">
            This paper does not claim validated thermal performance across all
            environments, manufacturability at scale, regulatory approval, or
            superiority over existing high-performance polymers.
          </p>
          <p className="leading-8 text-neutral-700">
            It defines a constrained candidate system and the condition under
            which thermal durability becomes materially credible.
          </p>
        </section>

        {/* CONCLUSION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="leading-8 text-neutral-700">
            Cyanate ester–modified PET is admissible only if functional groups
            survive high-temperature exposure as part of the material
            structure.
          </p>
          <p className="leading-8 text-neutral-700">
            If retention falls below threshold, the concept fails as a durable
            thermal enhancement. If retention holds, it becomes a viable
            candidate for elevated-temperature PET applications.
          </p>
        </section>

        {/* INVARIANT */}
        <section className="border-t pt-8">
          <p className="text-xl leading-8">
            Thermal durability is admissible only if the structure survives heat.
          </p>
          <p className="mt-2 text-neutral-600">
            If the functional group degrades under temperature, the improvement
            does not belong to the material.
          </p>
        </section>
      </article>
    </main>
  );
}
