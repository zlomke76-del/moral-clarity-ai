import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Structural Failure Admissibility Boundary in EV Battery Enclosures | Edge of Practice — Moral Clarity AI",
  description:
    "A constraint artifact defining when structural systems are non-admissible due to hidden or non-governed failure modes, introducing failure-governed lattice architectures as a falsifiable alternative.",
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

export default function EdgeOfPractice_AMSS_EV_Battery_Enclosure() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex gap-2 flex-wrap">
                <SignalPill>Edge of Practice</SignalPill>
                <SignalPill tone="fail">Structural Boundary</SignalPill>
                <SignalPill>RCS Constraint</SignalPill>
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Structural Failure Admissibility Boundary
              </h1>

              <p className="mt-6 text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl">
                Structural systems are valid only if failure is governed,
                localized, and externally observable. Hidden or non-legible
                failure modes render safety claims non-admissible.
              </p>

              <div className="mt-8 rounded-2xl border bg-black text-white p-6">
                <div className="text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  Core Boundary Doctrine
                </div>
                <p className="text-lg">
                  Structural safety is <strong>non-admissible</strong> if damage
                  can exist without detection, propagate without localization, or
                  require inference rather than direct observation.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 text-white p-10 space-y-4">
              <div>
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Valid only if
                </div>
                <p className="text-sm">
                  Failure is progressive, bounded, and directly observable
                  through geometry or deformation.
                </p>
              </div>

              <div className="border border-rose-400/20 bg-rose-500/10 p-4 rounded-xl">
                <div className="text-xs uppercase text-rose-300 mb-1">
                  Invalid when
                </div>
                <p className="text-sm text-rose-100">
                  Damage is subsurface, delaminated, or requires indirect
                  inspection to detect.
                </p>
              </div>

              <div>
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Governing scale
                </div>
                <p className="text-sm">
                  Failure topology and structural legibility, not peak strength.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONSTRAINT */}
        <SectionCard
          eyebrow="Constraint Definition"
          title="What the boundary enforces"
        >
          <p>
            Structural systems are admissible only if their failure behavior is
            governed, inspectable, and does not rely on hidden internal damage
            states.
          </p>

          <p>
            Inspection cannot be procedural compensation for structural opacity.
          </p>
        </SectionCard>

        {/* PRACTICE FAILURE */}
        <SectionCard
          eyebrow="Failure of Current Practice"
          title="Why laminate composites break the boundary"
        >
          <ul>
            <li>Brittle failure without progressive signaling</li>
            <li>Subsurface delamination undetectable by inspection</li>
            <li>Damage propagation without geometric visibility</li>
            <li>Repair dependent on uncertain internal state</li>
          </ul>

          <p>
            These systems require inference to determine integrity. Therefore,
            safety claims are non-admissible.
          </p>
        </SectionCard>

        {/* ALTERNATIVE */}
        <SectionCard
          eyebrow="Structural Alternative"
          title="Failure-governed lattice systems"
        >
          <p>
            Architected Micro-Lattice Structural Systems (AMSS) enforce
            admissibility by encoding failure behavior directly into structural
            geometry.
          </p>

          <ul>
            <li>Controlled lattice crushing absorbs energy</li>
            <li>Failure localizes into bounded regions</li>
            <li>Deformation is visible and measurable</li>
            <li>No reliance on hidden adhesive integrity</li>
          </ul>
        </SectionCard>

        {/* GOVERNING VARIABLES */}
        <SectionCard
          eyebrow="Governing Variables"
          title="Failure must remain observable"
        >
          <ul>
            <li>Failure localization radius</li>
            <li>Energy absorption pathway</li>
            <li>Visibility of deformation</li>
            <li>Persistence of structural connectivity post-impact</li>
          </ul>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Modes"
          title="Falsification conditions"
        >
          <ul>
            <li>Damage propagates beyond defined bounds</li>
            <li>Failure occurs without visible deformation</li>
            <li>Structural integrity cannot be assessed directly</li>
          </ul>

          <p>
            <strong>
              Any hidden failure state renders the system non-admissible.
            </strong>
          </p>
        </SectionCard>

        {/* BELOW EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="Hidden failure as a disqualifying condition"
        >
          <p>
            Structural safety is governed by whether failure is legible, not by
            whether failure occurs.
          </p>

          <ul>
            <li>Inspection-based safety is non-admissible</li>
            <li>Inference-based integrity is non-admissible</li>
            <li>Subsurface damage tolerance is non-admissible</li>
          </ul>

          <p>
            If a structure can fail without communicating its state, it cannot be
            considered safe.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm">
              Failure is localized, progressive, and directly observable through
              geometry and deformation.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <h2 className="text-2xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm">
              Failure is hidden, propagates silently, or requires indirect
              inspection to assess integrity.
            </p>
          </div>
        </section>

        {/* INVARIANT */}
        <section className="bg-zinc-950 text-white p-10 rounded-2xl">
          <p className="text-2xl font-semibold">
            A structure that cannot reveal its failure cannot be trusted.
          </p>
          <p className="mt-4 text-zinc-300">
            Safety requires that damage is observable, bounded, and
            interpretable. Hidden failure invalidates structural integrity
            claims.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          ← <Link href="/edge-of-practice">Back to Edge of Practice</Link>
        </p>
      </div>
    </main>
  );
}
