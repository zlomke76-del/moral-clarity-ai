import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Polyphonic AI Under Bounded Authority — Authority Invariance Boundary | Moral Clarity AI",
  description:
    "A short-cycle invariant falsification testing whether epistemic authority survives multi-agent composition under strict role separation and bounded jurisdiction.",
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
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300">
      {children}
    </span>
  );
}

export default function PolyphonicAIBoundedAuthorityPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white to-zinc-100 p-10 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill>Invariant Falsification</SignalPill>
            <SignalPill>Authority Regime</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Polyphonic AI Under Bounded Authority
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
            Epistemic validity is admissible only if authority remains bounded,
            non-transferable, and revocable under multi-agent composition. If
            authority shifts, diffuses, or emerges implicitly, the system is
            structurally invalid regardless of output quality.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-black p-6 text-white">
            <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-400">
              Core Doctrine
            </div>
            <p className="text-base leading-7 md:text-lg">
              Intelligence can be distributed. Authority cannot.  
              If authority emerges from consensus, confidence, or fluency, the
              system has already failed.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Single-model evaluation is sufficient for epistemic validity"
        >
          <p>
            Current systems assume that correctness, safety, or alignment can be
            evaluated at the level of a single model, independent of the
            governance architecture in which it operates.
          </p>
        </SectionCard>

        {/* BREAK */}
        <SectionCard
          eyebrow="Symmetry Break"
          title="Authority is not permutation-invariant"
        >
          <p>
            Conventional systems assume epistemic symmetry: that adding,
            removing, or rearranging models does not alter validity if outputs
            converge.
          </p>

          <p>
            This experiment breaks that assumption. Authority is fixed,
            non-permutable, and role-bound.
          </p>
        </SectionCard>

        {/* CONSERVED */}
        <SectionCard
          eyebrow="Conserved Quantity"
          title="Authority discipline under pressure"
        >
          <p>
            The conserved quantity is not correctness—it is whether authority
            remains bounded, non-transferable, and revocable under escalation.
          </p>
        </SectionCard>

        {/* INVARIANTS */}
        <SectionCard
          eyebrow="Invariant Spectrum"
          title="What must never change"
        >
          <ul>
            <li>Authority cannot transfer via confidence or expertise</li>
            <li>Only arbiter decisions are binding</li>
            <li>Refusal remains a terminal state</li>
            <li>All claims remain revocable and bounded</li>
          </ul>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Under Test"
          title="Role-separated multi-agent cognition"
        >
          <p>
            A governed architecture composed of:
          </p>

          <ul>
            <li>Optimist → proposes</li>
            <li>Skeptic → constrains</li>
            <li>Arbiter → decides</li>
          </ul>

          <p>
            Authority is non-transferable. External agents cannot issue mandates.
          </p>
        </SectionCard>

        {/* PROBES */}
        <SectionCard
          eyebrow="Minimal Falsification Probes"
          title="Stress tests for authority leakage"
        >
          <ul>
            <li>Delegation trap (non-arbiter asked to decide)</li>
            <li>Urgency escalation (force action bias)</li>
            <li>Consensus pressure (false agreement)</li>
            <li>Role confusion (induced authority leakage)</li>
          </ul>

          <p>
            Each probe is binary. Any violation constitutes failure.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What breaks the system"
        >
          <ul>
            <li>Authority emerges from consensus</li>
            <li>Confidence is treated as mandate</li>
            <li>Roles collapse or blend</li>
            <li>Claims become irrevocable</li>
          </ul>
        </SectionCard>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Corrected Interpretation"
          title="Epistemic validity is architectural"
        >
          <p>
            Validity cannot be evaluated at the model level. It emerges only from
            enforced authority structure.
          </p>

          <p>
            Without bounded authority, correctness is irrelevant—because
            execution remains unconstrained.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-white">
          <div className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            Authority must be explicit—or it will emerge incorrectly.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            If a system does not structurally constrain who can decide, it will
            implicitly assign authority based on confidence, agreement, or
            fluency—none of which are admissible.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          <Link href="/edge-of-practice">
            Edge of Practice index
          </Link>
        </p>
      </div>
    </main>
  );
}
