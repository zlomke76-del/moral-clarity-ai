import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Edge Canon — Invariant Admissibility Framework | Edge of Practice — Moral Clarity AI",
  description:
    "The governing admissibility framework for all Edge of Practice entries, defining invariant structure, failure signatures, and non-admissible reasoning.",
  openGraph: {
    title: "Edge Canon — Invariant Admissibility Framework",
    description:
      "Defines the invariant grammar governing all Edge of Practice constraint artifacts.",
    url: "https://moralclarity.ai/edge-of-practice/canon",
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

export default function EdgeCanonPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex gap-2 flex-wrap">
                <SignalPill>Edge of Practice</SignalPill>
                <SignalPill tone="fail">Canonical Constraint</SignalPill>
                <SignalPill>RCS Kernel</SignalPill>
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Edge Canon
              </h1>

              <p className="mt-6 text-lg text-zinc-700 dark:text-zinc-300 max-w-3xl">
                All Edge of Practice entries are valid only if they resolve to
                invariant structure. Interpretation, optimization, and narrative
                reasoning are non-admissible unless grounded in invariant
                observables.
              </p>

              <div className="mt-8 rounded-2xl border bg-black text-white p-6">
                <div className="text-xs uppercase tracking-widest text-zinc-400 mb-2">
                  Core Doctrine
                </div>
                <p className="text-lg">
                  A claim is <strong>non-admissible</strong> if it cannot be
                  expressed as an invariant structure with a falsifiable failure
                  signature.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 text-white p-10 space-y-4">
              <div>
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Valid only if
                </div>
                <p className="text-sm">
                  The system reduces to symmetry, conserved quantities, invariant
                  observables, and a discrete failure signature.
                </p>
              </div>

              <div className="border border-rose-400/20 bg-rose-500/10 p-4 rounded-xl">
                <div className="text-xs uppercase text-rose-300 mb-1">
                  Invalid when
                </div>
                <p className="text-sm text-rose-100">
                  Claims rely on averages, proxies, optimization goals, or
                  narrative explanation.
                </p>
              </div>

              <div>
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Governing scale
                </div>
                <p className="text-sm">
                  Invariant structure and spectral observables.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* REDUCTION */}
        <SectionCard
          eyebrow="Canonical Reduction"
          title="All entries must reduce to four elements"
        >
          <ol>
            <li>
              <strong>Symmetry Group (G)</strong> — transformations under which
              invariance is claimed
            </li>
            <li>
              <strong>Conserved Quantity (Q)</strong> — quantity preserved under G
            </li>
            <li>
              <strong>Invariant Spectrum (S)</strong> — observables that cannot be
              transformed away
            </li>
            <li>
              <strong>Failure Signature</strong> — categorical change in S
            </li>
          </ol>

          <p>
            If any element is missing, the entry is non-admissible.
          </p>
        </SectionCard>

        {/* DISALLOWED */}
        <SectionCard
          eyebrow="Non-Admissible Reasoning"
          title="What is explicitly excluded"
        >
          <ul>
            <li>Mean or averaged behavior</li>
            <li>Proxy metrics without invariant grounding</li>
            <li>Optimization or performance claims</li>
            <li>Interpretation without falsifiable structure</li>
            <li>Gradualist reasoning ignoring thresholds</li>
          </ul>

          <p>
            If a claim survives only through smoothing or aggregation, it is
            invalid.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Definition"
          title="Failure is spectral, not gradual"
        >
          <ul>
            <li>Step changes or discontinuities</li>
            <li>Percolation or system-spanning connectivity</li>
            <li>Emergence of extreme invariant values</li>
            <li>Knees or threshold transitions</li>
          </ul>

          <p>
            A single valid failure signature invalidates the entire assumption.
          </p>
        </SectionCard>

        {/* SOLACE */}
        <SectionCard
          eyebrow="Enforcement Layer"
          title="Role of Solace"
        >
          <p>
            Solace enforces admissibility. She does not optimize, interpret, or
            invent.
          </p>

          <ul>
            <li>Freezes assumptions</li>
            <li>Identifies symmetry claims</li>
            <li>Isolates conserved quantities</li>
            <li>Rejects non-invariant observables</li>
            <li>Evaluates failure on invariant spectra only</li>
          </ul>

          <p>
            Any reasoning step that violates invariant structure is refused.
          </p>
        </SectionCard>

        {/* SCOPE */}
        <SectionCard
          eyebrow="Scope"
          title="Domain independence"
        >
          <p>
            This framework applies across materials, biology, AI, governance,
            and infrastructure systems.
          </p>

          <p>
            Domain specifics vary. The invariant grammar does not.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">
              PASS
            </h2>
            <p className="mt-4 text-sm">
              The system resolves to invariant structure and defines a clear,
              falsifiable failure signature.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <h2 className="text-2xl font-semibold text-rose-800 dark:text-rose-200">
              FAIL
            </h2>
            <p className="mt-4 text-sm">
              The system depends on interpretation, averages, or non-invariant
              reasoning.
            </p>
          </div>
        </section>

        {/* INVARIANT */}
        <section className="bg-zinc-950 text-white p-10 rounded-2xl">
          <p className="text-2xl font-semibold">
            Truth must survive transformation.
          </p>
          <p className="mt-4 text-zinc-300">
            If a claim disappears under symmetry, it was never valid. Only
            invariant structure is admissible.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          This page governs all entries in the{" "}
          <Link href="/edge-of-practice">
            Edge of Practice index
          </Link>.
        </p>
      </div>
    </main>
  );
}
