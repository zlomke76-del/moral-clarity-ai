import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Interfacial Micro-Damping in PC/ABS Bilayers — Short-Cycle Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether mechanically layered polycarbonate and ABS exhibit interface-driven micro-damping and improved fatigue resistance without compatibilizers, fillers, or chemistry changes.",
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

export default function PCABSInterfacialMicroDampingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Interface Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Interfacial Micro-Damping in Mechanically Layered Polycarbonate and ABS
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Mechanical layering is admissible as a fatigue-resistance mechanism
            only if the PC/ABS interface measurably dissipates cyclic energy and
            delays crack initiation or propagation relative to monolithic
            controls—without compatibilizers, fillers, or chemistry changes.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Interface-driven micro-damping is <strong>admissible</strong> only
              if a mechanically layered PC/ABS bilayer survives cyclic loading
              with greater energy dissipation and no early delamination or
              accelerated cracking relative to neat PC and neat ABS. If the
              interface adds no dissipation or fails first, the claim is
              non-admissible.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Fatigue resistance is governed by bulk composition, not interface structure"
        >
          <p>
            The civilizational assumption under test is that mechanical
            durability and fatigue resistance in polycarbonate/ABS systems are
            governed primarily by bulk blending ratios and chemical
            compatibilization rather than by physical interface structure.
          </p>
        </SectionCard>

        {/* WHY LOAD-BEARING */}
        <SectionCard
          eyebrow="Why This Assumption Is Load-Bearing"
          title="Blend-centric design dominates PC/ABS durability logic"
        >
          <p>
            PC/ABS systems are widely used in automotive interiors, electronics
            housings, safety equipment, and structural enclosures. Design
            decisions emphasize blend optimization for impact toughness and
            processability, while fatigue performance is treated as a secondary
            bulk property.
          </p>

          <p>
            If interface-driven dissipation is ignored, designers remain locked
            into chemistry-based solutions that increase cost, complicate
            recyclability, and obscure long-horizon fatigue prediction.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Mechanically layered bilayer without chemical rescue"
        >
          <ul>
            <li>Polycarbonate directly bonded to ABS</li>
            <li>No compatibilizers, adhesives, or fillers permitted</li>
            <li>Bonding achieved only by co-extrusion, thermal pressing, or controlled melt fusion</li>
            <li>Bond quality sufficient to prevent immediate handling delamination</li>
          </ul>

          <p>
            The system is constrained to physical layering alone. Any chemical
            compatibilization invalidates the test.
          </p>
        </SectionCard>

        {/* HYPOTHESIS */}
        <SectionCard
          eyebrow="Mechanism Hypothesis"
          title="Compliance mismatch creates interfacial energy dissipation"
        >
          <p>
            The governing hypothesis is that the compliance mismatch between
            polycarbonate and ABS generates controlled interfacial micro-damping
            under cyclic mechanical loading.
          </p>

          <p>
            This interface is proposed to dissipate mechanical energy, slowing
            fatigue crack initiation and propagation relative to either material
            alone.
          </p>
        </SectionCard>

        {/* TEST PROTOCOL */}
        <SectionCard
          eyebrow="Minimal Test Protocol"
          title="Bilayer versus monolithic fatigue comparison"
        >
          <ul>
            <li>
              <strong>Specimen:</strong> Laminated bilayer sheet, e.g. 1 mm PC + 1 mm ABS
            </li>
            <li>
              <strong>Controls:</strong> Monolithic PC and monolithic ABS sheets of equal total thickness
            </li>
            <li>
              <strong>Loading:</strong> Cyclic three-point bend fatigue at moderate amplitude
            </li>
            <li>
              <strong>Cycle count:</strong> At least 10⁵ cycles
            </li>
            <li>
              <strong>Duration:</strong> Continuous or intermittent cycling over one week
            </li>
            <li>
              <strong>Measurements:</strong> Crack initiation, crack propagation rate, interfacial integrity, DMA-based energy dissipation
            </li>
          </ul>

          <p>
            The protocol is only admissible if the bilayer and controls remain
            geometrically comparable and are tested under the same loading
            history.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Energy dissipation gain without interface-first failure"
        >
          <p>
            The governing variable is the coexistence of two conditions:
            increased mechanical energy dissipation and preserved interfacial
            integrity under cyclic loading.
          </p>

          <ul>
            <li>Higher dissipation with intact interface = candidate pass</li>
            <li>Higher dissipation with early delamination = non-admissible</li>
            <li>No dissipation gain = non-admissible mechanism</li>
          </ul>

          <p>
            Slower failure is non-admissible if it is achieved only through a
            weak, sacrificial interface that loses structural continuity.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the claim"
        >
          <p>The claim fails if any of the following are observed:</p>

          <ul>
            <li>Visible interfacial delamination prior to fatigue failure</li>
            <li>Through-thickness crack propagation in fewer cycles than either neat PC or neat ABS</li>
            <li>No measurable increase in mechanical energy dissipation relative to monolithic controls</li>
          </ul>

          <p>
            If the interface fails first or contributes no measurable damping,
            then interface structure is not the governing durability mechanism.
          </p>
        </SectionCard>

        {/* WHAT BREAKS IF FALSE */}
        <SectionCard
          eyebrow="What Breaks If False"
          title="Bulk composition remains primary"
        >
          <p>
            If the assumption is true and the claim fails, then mechanical
            interface effects remain secondary to bulk composition. Reliance on
            chemical compatibilization and blend tuning for fatigue resistance
            remains justified.
          </p>
        </SectionCard>

        {/* WHAT CHANGES IF TRUE */}
        <SectionCard
          eyebrow="What Changes If It Holds"
          title="Physical layering becomes a viable fatigue pathway"
        >
          <p>
            If the claim holds, a purely physical route to improving fatigue
            resistance becomes viable through mechanical layering alone,
            challenging blend-centric design paradigms.
          </p>

          <p>
            The interface then becomes an admissible engineered dissipation zone
            rather than a defect to be eliminated.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm text-emerald-900 dark:text-emerald-100">
              The bilayer shows measurable energy dissipation gain and improved
              fatigue behavior relative to both monolithic controls without
              early interfacial delamination.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm text-rose-900 dark:text-rose-100">
              The interface delaminates early, the bilayer fails faster than a
              control, or no measurable dissipation gain appears.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            An interface is admissible only if it absorbs more than it breaks.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            A layered system is not tougher because two materials were placed
            together. It is tougher only if the interface measurably dissipates
            cyclic energy without becoming the dominant failure path.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <em>Status:</em> Final · Immutable
        </p>
      </div>
    </main>
  );
}
