import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Thermal Cycling Stability in PC with Short Glass Fiber — Extended Cycle Temporal Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "An Extended Cycle constraint artifact testing whether short untreated glass fiber in polycarbonate mitigates thermal fatigue through interfacial micro-slip under repeated thermal cycling.",
  robots: { index: true, follow: true },
};

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        {eyebrow}
      </div>
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-7 text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </section>
  );
}

function SignalPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "fail" | "pass";
}) {
  const toneClass =
    tone === "fail"
      ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
      : tone === "pass"
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        : "border-zinc-300/70 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function PCGlassThermalPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex flex-wrap gap-2">
                <SignalPill>Extended Cycle</SignalPill>
                <SignalPill tone="pass">Temporal Boundary</SignalPill>
                <SignalPill>Thermal Fatigue</SignalPill>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
                Thermal Cycling Stability in PC with Short Glass Fiber
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Short untreated glass fiber is admissible as a thermal-fatigue
                moderating inclusion only if repeated thermal cycling delays crack
                initiation or reduces modulus drift relative to neat
                polycarbonate rather than accelerating whitening, fracture, or
                stiffness loss.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50 dark:border-white/10 dark:bg-black">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  Thermal-fatigue mitigation is <strong>admissible</strong> only
                  if interfacial micro-slip dissipates cycling stress over time.
                  Earlier cracking, whitening, or modulus degradation than neat
                  PC renders the claim non-admissible.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 p-10 text-zinc-50 space-y-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                Boundary Summary
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Valid only if
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Crack onset is delayed or modulus drift is reduced relative to
                  neat PC across the full thermal cycling regime.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                  Invalid when
                </div>
                <p className="text-sm leading-6 text-rose-100">
                  Whitening, cracking, or modulus loss appears earlier or more
                  severely than in neat PC under matched cycling.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Governing variable
                </div>
                <p className="text-sm leading-6 text-zinc-200">
                  Time-resolved response to repeated thermal strain, not single
                  exposure behavior or initial stiffness alone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Bulk expansion mismatch dominates damage"
        >
          <p>
            The assumption under test is that thermal cycling damage in
            polycarbonate is dominated by bulk thermal expansion mismatch.
          </p>

          <p>
            This page asks whether short untreated glass fiber instead creates a
            controlled interfacial micro-slip regime that dissipates strain and
            delays cumulative thermal-fatigue damage over time.
          </p>
        </SectionCard>

        {/* WHY EXTENDED CYCLE */}
        <SectionCard
          eyebrow="Why This Is Extended Cycle"
          title="Cycling history is the unresolved variable"
        >
          <p>
            This is not a short-cycle question about one or two thermal shocks.
            The governing issue is whether repeated excursions across a large
            temperature window progressively build or dissipate damage.
          </p>

          <p>
            Entry into this branch is justified only because the decisive
            failure modes emerge through accumulated thermal history rather than
            immediate falsification.
          </p>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Experimental Regime"
          title="Minimal admissible test"
        >
          <p>
            Subject polycarbonate containing 10 wt% short untreated glass fiber
            to 500–1,000 thermal cycles between −20 °C and 80 °C while
            monitoring crack initiation and modulus drift against neat PC.
          </p>

          <ul>
            <li>Material: PC + 10 wt% short untreated glass fiber</li>
            <li>Cycle window: −20 °C ↔ 80 °C</li>
            <li>Duration: 500–1,000 cycles</li>
            <li>Primary readouts: crack initiation, whitening, modulus drift</li>
          </ul>

          <p>
            No compatibilizers, coatings, or interfacial rescue strategies are
            admissible inside the governed system.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Cycle-resolved interfacial strain behavior"
        >
          <p>
            The governing variable is whether repeated thermal expansion and
            contraction are dissipated through bounded interfacial slip or
            converted into cumulative damage.
          </p>

          <ul>
            <li>Delayed crack onset = candidate stress dissipation</li>
            <li>Reduced modulus drift = candidate cycling stability</li>
            <li>Early whitening = candidate microdamage onset</li>
          </ul>

          <p>
            Initial stiffness or single-cycle appearance is non-admissible if
            repeated thermal history reverses the claim.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the claim"
        >
          <p>
            The claim fails if any of the following occurs relative to neat PC:
          </p>

          <ul>
            <li>Earlier cracking</li>
            <li>Earlier or greater whitening</li>
            <li>Greater modulus degradation</li>
          </ul>

          <p>
            In Extended Cycle, delayed thermal-fatigue damage is not secondary
            noise. It is the primary falsification object.
          </p>
        </SectionCard>

        {/* PASS */}
        <SectionCard
          eyebrow="Pass Criterion"
          title="What counts as temporal survival"
        >
          <p>
            The claim passes only if crack onset is delayed or modulus drift is
            reduced relative to neat PC across the full thermal cycling regime.
          </p>

          <p>
            This does not establish universal utility. It establishes only that
            repeated cycling has not yet invalidated the micro-slip mitigation
            hypothesis.
          </p>
        </SectionCard>

        {/* BELOW EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="What conventional composite logic may miss"
        >
          <p>
            Conventional materials reasoning often treats glass fiber in PC as a
            simple expansion-mismatch problem likely to intensify thermal-fatigue
            stress.
          </p>

          <ul>
            <li>Bulk mismatch may not be the only governing damage pathway</li>
            <li>Interfacial motion may dissipate strain rather than amplify it</li>
            <li>Repeated thermal history may reveal bounded slip unavailable to static models</li>
          </ul>

          <p>
            This does not prove broad superiority. It defines a legitimate
            temporal boundary question.
          </p>
        </SectionCard>

        {/* STATUS */}
        <SectionCard eyebrow="Status" title="Current cycle state">
          <p>
            <strong>Final · Mid-Cycle</strong>
          </p>

          <p>
            This status marks the entry as fixed in governed form while the
            dominant unresolved variable remains cumulative thermal cycling
            across the defined temperature window.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              Boundary Judgment
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50">
              PASS
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-emerald-900 dark:text-emerald-100">
              <p>
                Crack onset is delayed or modulus drift is reduced relative to
                neat PC across 500–1,000 thermal cycles.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-rose-700 dark:text-rose-300">
              Boundary Judgment
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-rose-950 dark:text-rose-50">
              FAIL
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-rose-900 dark:text-rose-100">
              <p>
                Cracking, whitening, or modulus degradation appears earlier or
                more severely than in neat PC, indicating that interfacial
                micro-slip does not mitigate the dominant cycling damage pathway.
              </p>
            </div>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-zinc-50 shadow-sm dark:border-white/10">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            Thermal stability is admissible only if it survives cycling.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            A polycarbonate system is not stabilized by surviving a temperature
            range once. It is stabilized only if repeated thermal excursions do
            not progressively break the claim.
          </p>
        </section>
      </div>
    </main>
  );
}
