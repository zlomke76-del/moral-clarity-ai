import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Humidity-Triggered Pore-Sealing Membrane | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether confined hydrogel swelling inside a porous PVDF membrane can reduce transport after humidity or water exposure rather than increasing permeability through swelling damage.",
  openGraph: {
    title: "Humidity-Triggered Pore-Sealing Membrane",
    description:
      "A bounded materials experiment testing passive pore closure by confined hydrogel swelling in porous membranes.",
    url: "https://moralclarity.ai/edge-of-practice/humidity-triggered-pore-sealing-membrane",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
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
    <section className="rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-7 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm md:p-8">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      <div className="mt-5 text-[15px] leading-7 text-slate-300">{children}</div>
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
      ? "border-rose-500/25 bg-rose-500/10 text-rose-200"
      : tone === "pass"
        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
        : "border-sky-900/55 bg-sky-950/45 text-sky-200";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${toneClass}`}>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400/80" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function HumidityTriggeredPoreSealingMembranePage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pb-10 pt-2 sm:px-8 lg:px-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_30px_100px_rgba(0,0,0,0.50)] backdrop-blur-sm md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_34%)]" />
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full border border-sky-900/60 bg-sky-950/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
            Edge of Practice · Short-Cycle Falsification · Passive Containment
          </div>

          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl xl:text-[3.35rem] xl:leading-[1.05]">
            Humidity-Triggered Pore-Sealing Membrane
          </h1>

          <p className="mt-5 max-w-4xl text-lg font-medium leading-8 text-slate-100 md:text-xl">
            A bounded materials experiment testing whether confined hydrogel
            swelling inside a porous membrane can reduce transport after water
            exposure instead of increasing permeability through swelling damage.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <SignalPill>
              <strong>Target behavior:</strong> humidity-triggered pore closure
              by confined sacrificial swelling.
            </SignalPill>
            <SignalPill>
              <strong>Primary stack:</strong> porous PVDF membrane, sodium
              polyacrylate or PAAm microgel, thin PU or lightly crosslinked PVA
              binder.
            </SignalPill>
            <SignalPill>
              <strong>Reality boundary:</strong> the test must distinguish pore
              sealing from swelling-induced permeability increase.
            </SignalPill>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl py-12 text-center">
        <p className="text-lg leading-9 text-slate-300 md:text-xl">
          The assumption under test is simple: swelling is not automatically a
          failure mode if it occurs inside constrained pore geometry.
        </p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
          Confined swelling either closes transport pathways or it does not.
        </h2>
        <div className="mx-auto mt-6 h-px w-24 bg-sky-500/40" />
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <SectionCard eyebrow="Core Doctrine" title="Containment must beat swelling damage">
          <p>
            A humidity-responsive membrane is only admissible as a passive
            containment layer if water exposure reduces effective transport
            through pore blockage, increased tortuosity, or local sealing while
            preserving membrane integrity.
          </p>
          <p className="mt-4">
            If exposure opens cracks, delaminates the binder, dislodges hydrogel
            particles, or increases vapor/ionic transport, the architecture
            fails regardless of conceptual elegance.
          </p>
        </SectionCard>

        <SectionCard eyebrow="Conventional Assumption" title="Swelling usually increases transport">
          <p>
            Hydrophilic polymers often plasticize, swell, soften, and create
            additional water pathways under humidity. This experiment does not
            deny that risk. It isolates the narrower case where swelling is
            geometrically confined inside existing pores so expansion blocks
            transport rather than opening it.
          </p>
        </SectionCard>

        <SectionCard eyebrow="Minimum Stack" title="Commercially accessible material system">
          <BulletList
            items={[
              "Porous PVDF membrane with approximately 0.1–1 μm pores as the base substrate.",
              "Sodium polyacrylate microgel or crosslinked polyacrylamide microgel as the swelling domain.",
              "Thin polyurethane binder or lightly crosslinked PVA binder to retain hydrogel domains inside the pore structure.",
              "Dry storage and low-humidity handling prior to baseline transport measurement.",
            ]}
          />
        </SectionCard>

        <SectionCard eyebrow="Mechanism" title="Why transport could decrease">
          <p>
            The hydrogel domain is not intended to form a bulk swollen layer. It
            is intended to expand inside a constrained pore volume. If properly
            retained, swelling occupies pore space, narrows connected channels,
            increases tortuosity, and reduces the effective transport cross
            section.
          </p>
          <p className="mt-4">
            The governing variable is not water uptake alone. The governing
            variable is whether water uptake occurs under confinement strongly
            enough to close connected transport pathways before damage creates
            new ones.
          </p>
        </SectionCard>
      </div>

      <section className="mt-10 rounded-[2rem] border border-sky-900/40 bg-gradient-to-b from-slate-950 to-slate-900 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] md:p-10">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
          30-Day Experiment
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
          Small, fast, and decisive
        </h2>

        <div className="mt-7 grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-sky-950/45 bg-slate-950/60 p-5">
            <h3 className="font-semibold text-white">Sample groups</h3>
            <div className="mt-4 text-sm leading-7 text-slate-300">
              <BulletList
                items={[
                  "Pristine porous PVDF control.",
                  "Binder-only PVDF membrane.",
                  "Hydrogel-loaded PVDF membrane with PU or lightly crosslinked PVA confinement.",
                  "Overexposed swelling-damage control subjected to aggressive humidity cycling.",
                ]}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-sky-950/45 bg-slate-950/60 p-5">
            <h3 className="font-semibold text-white">Measurements</h3>
            <div className="mt-4 text-sm leading-7 text-slate-300">
              <BulletList
                items={[
                  "Baseline and post-exposure water vapor transmission rate or ionic transport.",
                  "Optical microscopy, SEM, or micro-CT evidence of pore blockage or damage.",
                  "Visual inspection for cracking, delamination, leaching, or particle dislodgement.",
                  "Optional tensile or bend test after exposure to confirm membrane integrity.",
                ]}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-sky-950/45 bg-slate-950/60 p-5">
            <h3 className="font-semibold text-white">Exposure protocol</h3>
            <div className="mt-4 text-sm leading-7 text-slate-300">
              <BulletList
                items={[
                  "Condition all samples dry before baseline testing.",
                  "Expose samples to controlled high humidity, such as 80–90% RH, or bounded liquid-water contact.",
                  "Retest transport immediately after 1, 6, and 24 hour exposures.",
                  "Repeat with humidity cycling only after the first-pass result is interpretable.",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-8 xl:grid-cols-2">
        <SectionCard eyebrow="Pass Condition" title="Pore closure dominates">
          <div className="space-y-4">
            <SignalPill tone="pass">
              Water vapor or ionic transport decreases by at least 25% in the
              hydrogel-loaded membrane after humidity exposure.
            </SignalPill>
            <SignalPill tone="pass">
              Microscopy shows pore occupation, narrowing, or blockage
              consistent with confined hydrogel swelling.
            </SignalPill>
            <SignalPill tone="pass">
              Control and binder-only samples do not show the same transport
              reduction, and the loaded membrane remains mechanically intact.
            </SignalPill>
          </div>
        </SectionCard>

        <SectionCard eyebrow="Kill Condition" title="Swelling damage dominates">
          <div className="space-y-4">
            <SignalPill tone="fail">
              Transport increases or remains unchanged after humidity exposure.
            </SignalPill>
            <SignalPill tone="fail">
              Microscopy shows cracking, pore enlargement, delamination,
              hydrogel leaching, or disrupted pore geometry.
            </SignalPill>
            <SignalPill tone="fail">
              Any apparent transport reduction is matched by binder-only samples,
              meaning the hydrogel confinement mechanism is not load-bearing.
            </SignalPill>
          </div>
        </SectionCard>
      </section>

      <section className="mt-10 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard eyebrow="Battery / Enclosure Relevance" title="Passive post-ingress containment">
          <p>
            The first plausible use is not separator replacement. The nearer
            application is a passive enclosure, gasket-adjacent, pack-adjacent,
            or forensic witness layer that reduces additional moisture or ionic
            transport after ingress begins.
          </p>
          <p className="mt-4">
            The material should be treated as a containment supplement to
            electronic monitoring, not as a replacement for battery management
            systems.
          </p>
        </SectionCard>

        <SectionCard eyebrow="Interpretation" title="What would justify next-stage development">
          <p>
            Next-stage development is justified only if transport reduction is
            reproducible, localized to hydrogel-loaded samples, structurally
            correlated with visible pore closure, and not explained by coating
            artifacts or membrane damage.
          </p>
          <p className="mt-4">
            A successful short-cycle result would support testing smaller pore
            distributions, alternate binders, electrolyte exposure, thermal
            cycling, and gradient loading patterns.
          </p>
        </SectionCard>
      </section>

      <section className="mt-10 rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 text-center shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
          Invariant
        </div>
        <p className="mx-auto mt-4 max-w-3xl text-xl font-semibold leading-9 text-white">
          A containment material is not admissible because it reacts to water.
          It is admissible only if the reaction reduces propagation faster than
          it creates new failure pathways.
        </p>
        <Link
          href="/edge-of-practice"
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-sky-300 transition hover:text-sky-200"
        >
          <span className="underline decoration-sky-800/40 underline-offset-4">
            Edge of Practice short-cycle index
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
