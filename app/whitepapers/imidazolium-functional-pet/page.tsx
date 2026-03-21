// app/whitepapers/imidazolium-functional-pet/page.tsx
// ============================================================
// WHITE PAPER
// Imidazolium-Functional PET Graft
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imidazolium-Functional PET Graft | Moral Clarity AI",
  description:
    "A regime-bounded white paper examining whether imidazolium functionality can be structurally anchored into PET to enable stable ion transport without leaching under high ionic strength conditions.",
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
            Imidazolium-Functional PET Graft
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600">
            A bounded materials investigation into whether imidazolium-based
            ionic functionality can be covalently grafted onto PET to enable
            stable ion-selective transport without functional loss under high
            ionic strength conditions.
          </p>
        </header>

        {/* ABSTRACT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Abstract</h2>
          <p className="leading-8 text-neutral-700">
            This paper evaluates the admissibility of grafting imidazolium
            functionality onto polyethylene terephthalate (PET) as a route to
            ion-selective transport in membranes and sensing systems. The
            governing constraint is salt stability. Ion transport is admissible
            only if ionic functionality remains structurally retained after
            exposure to high ionic strength environments.
          </p>
          <p className="leading-8 text-neutral-700">
            If ionic groups degrade, detach, or leach under salt exposure, the
            system fails as an anchored transport material and reverts to an
            additive-dependent mechanism.
          </p>
        </section>

        {/* PROBLEM CONTEXT */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Context</h2>
          <p className="leading-8 text-neutral-700">
            Ion-selective transport materials are critical for water purification,
            energy systems, and sensing technologies. Many existing systems rely
            on mobile ionic species or weakly retained functional groups,
            resulting in degradation, leaching, and reduced lifetime.
          </p>
          <p className="leading-8 text-neutral-700">
            High ionic strength environments, such as saline or brine conditions,
            accelerate these failure modes, challenging long-term functionality.
          </p>
          <p className="leading-8 text-neutral-700">
            A structurally anchored ionic system offers a potential route to
            stable transport behavior without consumable or migratory chemistry.
          </p>
        </section>

        {/* THESIS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conceptual Thesis</h2>
          <p className="leading-8 text-neutral-700">
            Grafting imidazolium-functional monomers onto PET via free-radical
            processes may enable fixed ionic sites capable of supporting ion
            transport while remaining covalently bound to the polymer.
          </p>
          <p className="leading-8 text-neutral-700">
            This concept is admissible only if ionic functionality remains
            intact and measurable after prolonged exposure to high ionic
            strength conditions.
          </p>
        </section>

        {/* FUNCTIONALIZATION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Functionalization Strategy</h2>
          <p className="leading-8 text-neutral-700">
            Imidazolium methacrylate monomers are melt-grafted onto PET using
            free-radical initiation at low functional loading. The objective is
            to create covalently attached ionic sites distributed along the
            polymer structure.
          </p>
          <p className="leading-8 text-neutral-700">
            This is a constrained structural hypothesis. It assumes no transport
            benefit unless functional retention is demonstrated under salt
            stress.
          </p>
        </section>

        {/* FAILURE CONDITION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Primary Failure Condition</h2>
          <p className="leading-8 text-neutral-700">
            The system fails if ionic functionality is lost under high ionic
            strength exposure, as indicated by measurable loss of counterion or
            functional group presence.
          </p>
          <p className="leading-8 text-neutral-700">
            Functional loss indicates that ion transport is not structurally
            supported and cannot be treated as a durable material property.
          </p>
        </section>

        {/* ADMISSIBILITY TEST */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Admissibility Test</h2>
          <p className="leading-8 text-neutral-700">
            Immersion in 1M NaCl is used as the governing stress condition,
            followed by ion chromatography to quantify retained ionic
            functionality.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>FAIL:</strong> greater than 10% bromide (counterion) loss
            after exposure.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>PASS:</strong> ionic functionality remains within 90% of
            baseline, with no evidence of leaching or detachment.
          </p>
          <p className="leading-8 text-neutral-700">
            This threshold defines structural retention, not transport
            efficiency.
          </p>
        </section>

        {/* PROJECTED CAPABILITY */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projected Capability</h2>
          <p className="leading-8 text-neutral-700">
            If retention holds, imidazolium-functional PET may enable membranes
            and devices capable of stable ion transport in high-salinity
            environments without degradation or leaching.
          </p>
          <p className="leading-8 text-neutral-700">
            This could support applications in desalination, electrochemical
            systems, and environmental sensing.
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
            This paper does not claim validated ion selectivity across all ions,
            membrane performance benchmarks, regulatory approval, or
            manufacturability at scale.
          </p>
          <p className="leading-8 text-neutral-700">
            It defines a constrained candidate system and the condition under
            which stable ionic functionality becomes materially credible.
          </p>
        </section>

        {/* CONCLUSION */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="leading-8 text-neutral-700">
            Imidazolium-functional PET is admissible only if ionic functionality
            survives high ionic strength exposure as part of the material
            structure.
          </p>
          <p className="leading-8 text-neutral-700">
            If functional loss exceeds threshold, the concept fails as a durable
            ion-transport system. If retention holds, it becomes a viable
            candidate for advanced separation and sensing technologies.
          </p>
        </section>

        {/* INVARIANT */}
        <section className="border-t pt-8">
          <p className="text-xl leading-8">
            Ion transport is admissible only if the ionic structure survives salt.
          </p>
          <p className="mt-2 text-neutral-600">
            If functionality is lost in the environment it is meant to operate in,
            it does not belong to the material.
          </p>
        </section>
      </article>
    </main>
  );
}
