import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Surface Lubricity and Optical Stability in PS via Trace PDMS — Short-Cycle Constraint Boundary | Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether trace PDMS in polystyrene creates a durable, optically stable, low-friction surface through interfacial physics alone.",
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
    <section className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        {eyebrow}
      </div>
      <h2 className="mb-4 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
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
        : "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function PSPDMSEdgePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Surface Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Surface Lubricity and Optical Stability in PS via Trace PDMS
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Polystyrene is admissible as a coating-free low-friction surface only
            if trace PDMS creates a stable lubricious interface without blooming,
            oiling, haze growth, or optical collapse under mild stress.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Surface lubricity is <strong>admissible without coatings</strong>{" "}
              only if trace PDMS forms a stable low-energy surface phase that
              reduces friction while preserving optical clarity and resisting
              exudation. If friction falls but the surface blooms, oils, or hazes,
              the claim is non-admissible.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Internal lubricants cannot create durable clear low-friction PS"
        >
          <p>
            The assumption under test is that low-level internal lubricants
            cannot produce durable, low-friction polystyrene surfaces without
            blooming, haze, or surface oiling.
          </p>
        </SectionCard>

        {/* WHY THIS MATTERS */}
        <SectionCard
          eyebrow="Why This Assumption Matters"
          title="Surface performance is outsourced to coatings"
        >
          <p>
            Polystyrene is widely used in consumer-facing products where
            friction, dust adhesion, fingerprinting, and surface wear remain
            persistent liabilities.
          </p>

          <p>
            The dominant mitigation strategy relies on coatings or surface
            treatments, increasing manufacturing cost, process complexity, and
            long-term failure risk through wear or delamination.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Trace PDMS dispersed in commodity PS"
        >
          <ul>
            <li>Matrix: general-purpose polystyrene</li>
            <li>Dispersed phase: 0.5–2 wt% low–molecular weight PDMS</li>
            <li>Processing: standard injection molding</li>
            <li>No surface treatment, coating, or post-processing</li>
          </ul>

          <p>
            The system is constrained to internal additive migration and surface
            energy minimization alone. Any secondary surface rescue invalidates
            the test.
          </p>
        </SectionCard>

        {/* MECHANISM */}
        <SectionCard
          eyebrow="Mechanism Hypothesis"
          title="Surface-energy-driven PDMS migration"
        >
          <p>
            During molding, PDMS is hypothesized to migrate toward the
            polymer–air interface, forming a nanometer-scale lubricious layer
            driven purely by surface energy minimization.
          </p>

          <p>
            No chemical bonding or phase reaction is required. The claim is that
            interfacial organization alone can create a durable friction-reducing
            surface state.
          </p>
        </SectionCard>

        {/* PRIMARY MEASUREMENTS */}
        <SectionCard
          eyebrow="Primary Readouts"
          title="Friction reduction with preserved optical stability"
        >
          <ul>
            <li>Tribological testing versus neat PS</li>
            <li>Optical haze and gloss before and after standardized abrasion</li>
            <li>Visual inspection for blooming or oiling after 24 hours at 40 °C</li>
            <li>Visual inspection after solvent wipe challenge</li>
          </ul>

          <p>
            The readouts must remain jointly satisfied. A lubricious surface that
            becomes visibly unstable is non-admissible.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Friction reduction with no visible surface instability"
        >
          <p>
            The governing variable is the coexistence of two conditions:
            meaningful friction reduction and preserved optical/surface
            stability.
          </p>

          <ul>
            <li>Low friction with oiling = non-admissible surface exudation</li>
            <li>Low friction with haze = non-admissible optical collapse</li>
            <li>Stable clarity without friction reduction = non-admissible mechanism</li>
          </ul>

          <p>
            Improvement in one axis cannot compensate for collapse in the other.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the claim"
        >
          <p>
            The claim fails if any of the following occurs:
          </p>

          <ul>
            <li>Visible surface blooming</li>
            <li>Visible surface oiling</li>
            <li>Measurable haze increase or loss of optical clarity</li>
            <li>Instability after 24 hours at 40 °C or after solvent wipe</li>
          </ul>

          <p>
            A lubricious surface that cannot remain visually and functionally
            coherent under mild challenge is not admissible as a durable surface
            state.
          </p>
        </SectionCard>

        {/* PASS */}
        <SectionCard
          eyebrow="Pass Criterion"
          title="What counts as admissible lubricity"
        >
          <p>
            The claim passes only if friction coefficient is reduced by at least
            30% relative to neat PS, with no visible surface oiling and no
            measurable haze increase.
          </p>

          <p>
            This threshold establishes that lubricity is real, while the optical
            and visual gates establish that it is stable.
          </p>
        </SectionCard>

        {/* WHAT BREAKS IF FALSE */}
        <SectionCard
          eyebrow="What Breaks If False"
          title="Coating dependence remains intact"
        >
          <p>
            If the assumption holds and the claim fails, then commodity
            polystyrene remains dependent on coatings or secondary surface
            treatments for durable low-friction performance.
          </p>
        </SectionCard>

        {/* WHAT CHANGES IF TRUE */}
        <SectionCard
          eyebrow="What Changes If It Holds"
          title="Internal additives become surface physics tools"
        >
          <p>
            If the claim holds, commodity PS can achieve durable, low-friction,
            dust-resistant surfaces without coatings, chemistry changes, or
            additional process steps.
          </p>

          <p>
            Internal additives are then reclassified from bulk modifiers to
            surface-architecture tools governed by interfacial physics.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm text-emerald-900 dark:text-emerald-100">
              Friction coefficient falls by at least 30% relative to neat PS,
              with no visible oiling and no measurable haze increase.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm text-rose-900 dark:text-rose-100">
              Lubricity is accompanied by blooming, oiling, haze growth, or
              other visible instability under mild thermal or wipe challenge.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A low-friction surface is admissible only if the surface phase stays coherent.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Polystyrene is not coating-free durable because friction drops once.
            It is coating-free durable only if interfacial migration produces a
            stable lubricious surface without collapsing into visible exudation
            or optical failure.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <em>Status:</em> Final · Immutable
        </p>
      </div>
    </main>
  );
}
