export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <article className="space-y-10">
        <header className="space-y-4 border-b pb-8">
          <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
            White Paper · Anchored PET Candidate
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Allyl Sulfate Grafted PET
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-neutral-600">
            A bounded materials concept examining whether allyl sulfate grafting
            can create extraction-stable fixed-charge functionality in PET for
            filtration and ion-exchange applications without relying on leaching
            additives.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Abstract</h2>
          <p className="leading-8 text-neutral-700">
            This paper examines allyl sulfate grafting as a route to introducing
            fixed anionic charge into polyethylene terephthalate (PET) through
            covalent attachment rather than additive blending. The core question
            is not whether sulfate functionality can be introduced in principle,
            but whether it can remain materially retained under extraction and
            use conditions relevant to filtration or ion-exchange deployment.
          </p>
          <p className="leading-8 text-neutral-700">
            The governing admissibility condition is structural persistence. If
            the sulfate-bearing functionality is not retained under extraction
            stress, the concept fails as an anchored PET system and reverts to
            the weaker category of additive-dependent performance.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Context</h2>
          <p className="leading-8 text-neutral-700">
            Filtration and ion-exchange materials often rely on mobile or
            weakly retained functional species to generate charge-based
            performance. That creates a recurring materials problem: the very
            chemistry that enables separation can also become the chemistry that
            migrates, washes out, or degrades under use.
          </p>
          <p className="leading-8 text-neutral-700">
            For PET to serve as a meaningful host for charged separation
            functionality, the charge-bearing group must survive processing,
            remain present after extraction stress, and preserve sufficient
            surface or bulk accessibility to matter operationally.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conceptual Thesis</h2>
          <p className="leading-8 text-neutral-700">
            Allyl sulfate grafting may provide a route to fixed-charge PET by
            using reactive graft chemistry to anchor sulfate-bearing functionality
            onto the polymer backbone or accessible chain sites during melt
            processing. If successful, this would produce a PET-based material
            with persistent ionic character suitable for filtration,
            ion-exchange, or charge-mediated separation contexts.
          </p>
          <p className="leading-8 text-neutral-700">
            The concept is admissible only if the sulfate functionality behaves
            as a retained structural modification rather than a process-borne or
            extractable residue.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Functionalization Strategy</h2>
          <p className="leading-8 text-neutral-700">
            The proposed route is low-level melt grafting of allyl sulfate onto
            PET using controlled peroxide initiation. The logic of the approach
            is to introduce sulfate-bearing functionality without collapsing PET
            processability or relying on post-process surface deposition.
          </p>
          <p className="leading-8 text-neutral-700">
            This is not framed as proof of manufacturability. It is framed as a
            bounded structural hypothesis: that a sulfate-bearing graft can be
            incorporated at low loading while remaining materially retained
            after extraction challenge.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Primary Failure Condition</h2>
          <p className="leading-8 text-neutral-700">
            The primary failure mode is extraction-visible loss of sulfur-bearing
            functionality. If the graft is not retained, then any projected
            filtration or ion-exchange performance is not structurally anchored
            and should not be treated as durable capability.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Admissibility Test</h2>
          <p className="leading-8 text-neutral-700">
            A direct extraction stress test is the governing evaluation surface.
            Soxhlet extraction followed by sulfur quantification is used as the
            core admissibility screen.
          </p>
          <p className="leading-8 text-neutral-700">
            <strong>Failure threshold:</strong> greater than 10% sulfur loss
            after extraction constitutes structural failure.
          </p>
          <p className="leading-8 text-neutral-700">
            This threshold is not a performance optimization target. It is a
            binary survivability gate separating anchored function from
            extractable function.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Projected Capability</h2>
          <p className="leading-8 text-neutral-700">
            If retention is achieved, the material may support persistent
            ion-exchange behavior and charge-mediated filtration utility.
            Potential value would come from replacing mobile additives with
            covalently retained functionality, thereby improving material
            discipline and reducing performance decay tied to leaching.
          </p>
          <p className="leading-8 text-neutral-700">
            These are projected capabilities only. They are downstream of
            retention and invalid if the anchoring condition fails.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Non-Claims</h2>
          <p className="leading-8 text-neutral-700">
            This paper does not claim demonstrated filtration performance,
            validated commercial readiness, toxicological clearance, process
            optimization, or deployment suitability in regulated environments.
          </p>
          <p className="leading-8 text-neutral-700">
            It defines a constrained candidate system and the condition under
            which that system becomes materially credible.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Conclusion</h2>
          <p className="leading-8 text-neutral-700">
            Allyl sulfate grafted PET is interesting only if the sulfate
            functionality survives extraction as part of the material structure.
            If sulfur loss exceeds threshold, the concept fails as anchored PET.
            If retention holds, the material becomes a legitimate candidate for
            deeper evaluation in charge-mediated separation contexts.
          </p>
        </section>
      </article>
    </main>
  );
}
