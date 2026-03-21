import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "UV-C Shadow Persistence — Line-of-Sight Sterility Boundary | Moral Clarity AI",
  description:
    "A geometry-controlled falsification testing whether UV-C sterilization fails under line-of-sight constraints due to shadow-protected survival zones.",
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
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}>
      {children}
    </span>
  );
}

export default function UvSterilizationShadowsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Geometric Constraint</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Persistence of Bacteria in UV-C Shadow Regions
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            UV-C sterilization is admissible as complete only if microbial
            inactivation is independent of geometry. If viable organisms persist
            in shadowed regions under standard exposure, sterility becomes
            line-of-sight constrained rather than exposure-defined.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white dark:border-white/10">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              UV sterilization does not fail by dose—it fails by geometry.  
              If light cannot reach a surface, sterility cannot be assumed.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Exposure implies sterility"
        >
          <p>
            The assumption is that UV-C exposure at validated intensity and time
            ensures complete inactivation of surface bacteria regardless of
            object geometry.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Structural Failure"
          title="Sterility is line-of-sight constrained"
        >
          <p>
            UV-C radiation propagates directionally and does not penetrate
            opaque materials or reach geometrically shadowed regions.
          </p>

          <p>
            This creates protected survival zones where organisms remain viable
            despite compliant exposure conditions.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Geometric visibility to radiation"
        >
          <p>
            The governing variable is not dose, but whether each surface region
            has direct line-of-sight exposure to the UV source.
          </p>

          <ul>
            <li>Visible surface → high inactivation probability</li>
            <li>Shadowed surface → survival-protected region</li>
          </ul>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Minimal Falsification"
          title="Shadow vs exposed comparison"
        >
          <ul>
            <li>Defined shadow geometries using matte objects</li>
            <li>Controlled UV-C exposure (254 nm, fixed intensity/time)</li>
            <li>Identical inoculation across exposed and shadowed regions</li>
            <li>CFU recovery and quantification</li>
          </ul>

          <p>
            Only geometry differs. All other variables are held constant.
          </p>
        </SectionCard>

        {/* FAILURE CONDITION */}
        <SectionCard
          eyebrow="Binary Boundary"
          title="What breaks the assumption"
        >
          <p>
            <strong>Pass:</strong> Zero CFU across all regions regardless of geometry.
          </p>

          <p>
            <strong>Fail:</strong> ≥1 CFU detected in any shadowed region.
          </p>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Sterility requires coverage, not exposure"
        >
          <p>
            Sterilization cannot be defined solely by time and intensity. It
            requires complete geometric coverage of all surfaces.
          </p>

          <p>
            Exposure metrics without spatial completeness are insufficient to
            guarantee sterility.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white dark:border-white/10">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            A surface cannot be sterilized if it cannot be seen.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Sterility is not a function of exposure alone. It is a function of
            exposure plus visibility. Geometry defines the true boundary.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <em>Status:</em> Final · Immutable
        </p>
      </div>
    </main>
  );
}
