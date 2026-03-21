// app/whitepapers/citric-acid-modified-pet/page.tsx
// ============================================================
// WHITE PAPER
// Citric Acid–Modified PET
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Citric Acid–Modified PET | Moral Clarity AI",
  description:
    "A regime-bounded white paper examining whether citric-acid-derived functionality can be structurally incorporated into PET to enable controlled hydrolytic susceptibility without additive dependence.",
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
            Citric Acid–Modified PET
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600">
            A bounded materials investigation into whether citric-acid-derived
            functionality can be structurally incorporated into PET to enable
            controlled hydrolytic susceptibility under defined end-of-life
            conditions without reliance on additives or degradable fillers.
          </p>
        </header>

        {/* ABSTRACT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Abstract</h2>
          <p className="leading-8 text-neutral-700">
            This paper evaluates the admissibility of incorporating
            citric-acid-derived comonomers into polyethylene terephthalate (PET)
            as a route to controlled hydrolytic susceptibility. The central
            constraint is not degradability in general, but controlled structural
            response under defined conditions.
          </p>
          <p className="leading-8 text-neutral-700">
            Hydrolytic susceptibility is admissible only if the modifying
            structure remains part of the material and produces predictable
            behavior under stress without relying on extractable or transient
            components.
          </p>
        </section>

        {/* PROBLEM CONTEXT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Context</h2>
          <p className="leading-8 text-neutral-700">
            PET is widely valued for durability and resistance to degradation.
            However, this same persistence contributes to long-lived waste and
            challenges in chemical recycling.
          </p>
          <p className="leading-8 text-neutral-700">
            Conventional approaches to modifying degradation behavior often rely
            on additives or blends that introduce variability, migration risk,
            or loss of structural control over time.
          </p>
          <p className="leading-8 text-neutral-700">
            A structurally modified PET that enables controlled hydrolytic
            susceptibility offers a potential pathway toward predictable
            end-of-life behavior without abandoning material integrity during use.
          </p>
        </section>

        {/* THESIS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conceptual Thesis</h2>
          <p className="leading-8 text-neutral-700">
            Incorporating citric-acid-derived triacid functionality into PET at
            low molar fractions may introduce controlled points of hydrolytic
            susceptibility within the polymer network.
          </p>
          <p className="leading-8 text-neutral-700">
            This concept is admissible only if the citric-derived structure is
            retained after extraction and produces a predictable, condition-
            dependent response rather than uncontrolled degradation.
          </p>
        </section>

        {/* FUNCTIONALIZATION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Functionalization Strategy</h2>
          <p className="leading-8 text-neutral-700">
            Citric-acid-derived triacid monomers are introduced during PET
            polycondensation at low molar fractions. The objective is to embed
            hydrolytically responsive functionality directly into the polymer
            backbone while preserving processability and baseline performance.
          </p>
          <p className="leading-8 text-neutral-700">
            This is a constrained structural hypothesis. It does not assume
            degradability as a benefit unless it is controllable, predictable,
            and structurally retained.
          </p>
        </section>

        {/* FAILURE CONDITION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Primary Failure Condition</h2>
          <p className="leading-8 text-neutral-700">
            The system fails if citric-derived functionality is lost during
            extraction or if hydrolytic response becomes uncontrolled or
            decoupled from structural retention.
          </p>
          <p className="leading-8 text-neutral-700">
            Loss of acid content or unpredictable degradation behavior invalidates
            the concept as a controlled end-of-life material.
          </p>
        </section>

        {/* ADMISSIBILITY TEST */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Admissibility Test</h2>
          <p className="leading-8 text-neutral-700">
            Neutral water immersion at 80°C for 7 days is used as the governing
            stress condition, followed by quantitative analysis of retained acid
            functionality.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>FAIL:</strong> significant loss of acid content or evidence
            that hydrolytic response is driven by extractable or unstable
            components.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>PASS:</strong> structural retention of citric-derived
            functionality with predictable hydrolytic response under defined
            conditions.
          </p>
          <p className="leading-8 text-neutral-700">
            This test defines control, not degradation rate.
          </p>
        </section>

        {/* PROJECTED CAPABILITY */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projected Capability</h2>
          <p className="leading-8 text-neutral-700">
            If retention and control hold, citric-acid-modified PET may enable
            materials with tunable hydrolytic susceptibility, supporting more
            predictable chemical recycling pathways or controlled degradation
            under specified conditions.
          </p>
          <p className="leading-8 text-neutral-700">
            The value lies in controlled response, not accelerated breakdown.
          </p>
          <p className="leading-8 text-neutral-700">
            These capabilities are conditional and invalid if the retention or
            control requirement fails.
          </p>
        </section>

        {/* NON-CLAIMS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Non-Claims</h2>
          <p className="leading-8 text-neutral-700">
            This paper does not claim biodegradability, environmental safety
            across all contexts, regulatory approval, recyclability superiority,
            or commercial readiness.
          </p>
          <p className="leading-8 text-neutral-700">
            It defines a constrained candidate system and the condition under
            which controlled hydrolytic behavior becomes materially credible.
          </p>
        </section>

        {/* CONCLUSION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="leading-8 text-neutral-700">
            Citric-acid-modified PET is admissible only if hydrolytic
            susceptibility arises from retained structure and remains
            predictable under defined conditions.
          </p>
          <p className="leading-8 text-neutral-700">
            If functionality is lost or behavior becomes uncontrolled, the
            concept fails as a structurally governed material. If retention and
            control hold, it becomes a viable candidate for end-of-life
            engineering in PET systems.
          </p>
        </section>

        {/* INVARIANT */}
        <section className="border-t pt-8">
          <p className="text-xl leading-8">
            Degradation is admissible only if it is controlled by structure.
          </p>
          <p className="mt-2 text-neutral-600">
            If the response cannot be predicted or retained, it does not belong
            to the material.
          </p>
        </section>
      </article>
    </main>
  );
}
