// app/edge-of-knowledge/page.tsx
// ============================================================
// EDGE OF KNOWLEDGE
// Governing action where certainty breaks
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Governing Action at the Edge of Knowledge | Moral Clarity AI",
  description:
    "A public doctrine for governing action under uncertainty. Boundary exposure, regime limits, and failure characterization without actionability.",
  openGraph: {
    title: "Governing Action at the Edge of Knowledge",
    description:
      "A doctrine for responsible intelligence when certainty breaks.",
    url: "https://moralclarity.ai/edge-of-knowledge",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-static";

function SignalPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-sky-950/45 bg-slate-950/65 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}

function DoctrineCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-900/40 bg-slate-900/72 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.24)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-500/8 to-transparent opacity-60" />
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
          {title}
        </p>
        <p className="mt-4 text-[15px] leading-7 text-slate-200">
          {description}
        </p>
      </div>
    </div>
  );
}

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
    <section className="rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm md:p-10">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-[16px] leading-8 text-slate-300">
        {children}
      </div>
    </section>
  );
}

function LinkedInvariant({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group/link inline-flex items-start gap-2 text-[15px] leading-7 text-sky-300 transition hover:text-sky-200"
    >
      <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-sky-400/80 transition group-hover/link:bg-sky-300" />
      <span className="underline decoration-sky-800/30 underline-offset-4 transition group-hover/link:decoration-sky-400">
        {children}
      </span>
    </Link>
  );
}

export default function EdgeOfKnowledgePage() {
  return (
    <main className="mx-auto w-full max-w-[1400px] px-6 pb-8 pt-2 sm:px-8 lg:px-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-950/45 bg-slate-950/72 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_30px_100px_rgba(0,0,0,0.50)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_30%)]" />
        <div className="relative z-10 px-8 py-10 md:px-10 md:py-12">
          <div className="inline-flex items-center rounded-full border border-sky-900/60 bg-sky-950/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
            MCAI Research Doctrine
          </div>

          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl xl:text-[3.55rem] xl:leading-[1.04]">
            Governing Action at the Edge of Knowledge
          </h1>

          <p className="mt-5 max-w-4xl text-lg font-medium leading-8 text-slate-100 md:text-xl">
            Doctrine for responsible intelligence where certainty breaks.
          </p>

          <p className="mt-6 max-w-4xl text-[16px] leading-8 text-slate-300">
            This is not a product, policy, recommendation, or design template.
            It is a public governing doctrine for conditions in which
            assumptions fail, confidence becomes unsafe, and exposure must not
            be confused with permission.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SignalPill
              label="Type"
              value="Public doctrine governing action under uncertainty."
            />
            <SignalPill
              label="Boundary"
              value="Regime-bounded, non-actionable, non-advisory."
            />
            <SignalPill
              label="Integrity"
              value="Updated only by explicit revision and historical continuity."
            />
          </div>

          <div className="mt-8 rounded-2xl border border-red-900/40 bg-red-950/20 px-5 py-4">
            <p className="text-sm leading-7 text-red-200">
              <span className="font-semibold">Boundary Notice:</span> Edge of
              Knowledge materials are regime-bounded, non-actionable, and not
              advice. Exposure of boundary or failure does not constitute
              endorsement, assurance, or design guidance.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl py-14 text-center">
        <p className="text-lg leading-9 text-slate-300 md:text-xl">
          Most catastrophic failures begin after assumptions have already failed.
        </p>

        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl xl:text-[2.8rem]">
          Edge of Knowledge exists to govern exposure without converting
          uncertainty into action.
        </h2>

        <div className="mx-auto mt-6 h-px w-24 bg-sky-500/40" />

        <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-8 text-slate-400">
          This doctrine makes uncertainty visible and governable while refusing
          the slide from boundary recognition into application, prescription, or
          misplaced authority.
        </p>
      </section>

      <section className="rounded-[2rem] border border-sky-950/45 bg-slate-950/70 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm md:p-10">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-sky-400" />
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            Governing Premise
          </h2>
        </div>

        <p className="mt-5 max-w-4xl text-[16px] leading-8 text-slate-300">
          Edge of Knowledge defines how intelligent systems, human or
          artificial, must behave when assumptions collapse and confidence
          becomes unsafe. It governs visibility, limit recognition, and
          admissible interpretation under uncertainty.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <DoctrineCard
            title="Exposure"
            description="Make regime boundary, failure, and uncertainty visible without translating them into usable prescriptions."
          />
          <DoctrineCard
            title="Constraint"
            description="Restrict action, authority, and interpretation when stability assumptions no longer hold."
          />
          <DoctrineCard
            title="Continuity"
            description="Preserve corrections, revisions, and history explicitly so epistemic movement remains inspectable."
          />
        </div>
      </section>

      <section className="mt-12 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard eyebrow="Preface" title="The doctrine before the application">
          <p>
            This doctrine defines how intelligent systems must operate when
            assumptions fail and certainty no longer justifies confident action.
            It does not prescribe deployment, optimization, or design.
          </p>
          <p>
            Edge of Knowledge exists to make uncertainty visible and governable
            without converting exposure into application or recommendation.
          </p>
          <p className="text-sm text-slate-400">
            All Edge of Knowledge analyses assume admissibility under the{" "}
            <Link
              href="/reference/reality-first-substrate-gate"
              className="text-sky-300 underline decoration-sky-800/30 underline-offset-4 transition hover:text-sky-200 hover:decoration-sky-400"
            >
              Reality-First Substrate Gate
            </Link>
            .
          </p>
        </SectionCard>

        <SectionCard eyebrow="Interpretation Limit" title="Non-actionable by design">
          <p>
            Materials are non-actionable. They are not advice, instruction,
            recommendation, or design guidance.
          </p>
          <p>
            Exposure of a boundary or failure does not constitute endorsement,
            assurance, or permission.
          </p>
          <p>
            Emission legitimacy, refusal enforcement, and containment are
            governed by the{" "}
            <Link
              href="/edge-of-protection"
              className="text-sky-300 underline decoration-sky-800/30 underline-offset-4 transition hover:text-sky-200 hover:decoration-sky-400"
            >
              Edge of Protection
            </Link>
            .
          </p>
        </SectionCard>
      </section>

      <section className="mt-12 rounded-[2rem] border border-sky-900/40 bg-gradient-to-b from-slate-950 to-slate-900 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] md:p-10">
        <div className="max-w-4xl">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Abstract
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            Catastrophic failure usually begins after the causal story is already
            wrong.
          </h2>
          <p className="mt-4 text-[16px] leading-8 text-slate-400">
            This doctrine distinguishes fixed from contextual causality, defines
            the signals of regime exit, and imposes limits on authority, action,
            interpretation, and trust once the stability assumptions that support
            optimization no longer hold.
          </p>
        </div>
      </section>

      <section className="mt-14 grid gap-8 xl:grid-cols-2">
        <SectionCard eyebrow="1. Causal Regime Distinction" title="Fixed vs. contextual causality">
          <p>
            In stable regimes, causality behaves as fixed enough to support
            optimization, control, and repeatable intervention.
          </p>
          <p>
            In drifting, feedback-rich, or coupled contexts, treating causality
            as fixed produces brittle and unsafe systems. The error is not
            merely technical. It is a governance failure.
          </p>
        </SectionCard>

        <SectionCard eyebrow="2. Detection" title="Detecting regime exit">
          <ul className="list-disc space-y-2 pl-6 text-slate-300">
            <li>Rising variance or autocorrelation</li>
            <li>Unexpected sensitivity to minor variables</li>
            <li>Deviation from assumed causal dependencies</li>
            <li>Slowed recovery after intervention</li>
            <li>Shifts in information flow or coupling</li>
          </ul>
        </SectionCard>

        <SectionCard eyebrow="3. Governance" title="Action under irreducible uncertainty">
          <p>
            <span className="font-semibold text-white">Authority:</span>{" "}
            authority is conditional, time-limited, and revocable. Accumulation
            of authority in uncertainty is invalid.
          </p>
          <p>
            <span className="font-semibold text-white">Action:</span> favor
            reversible, information-seeking moves. All action must remain
            logged, inspectable, and auditable.
          </p>
          <p>
            <span className="font-semibold text-white">Trust:</span> trust is
            strictly provisional and must be reassigned based on present
            performance rather than status or history.
          </p>
        </SectionCard>

        <SectionCard eyebrow="4. Inclusion" title="Curation and admissibility">
          <p>
            Material belongs here only if it exposes regime boundaries,
            characterizes failure, or clarifies epistemic limits.
          </p>
          <p>
            Novelty, usefulness, and applicability are insufficient grounds for
            inclusion. Review is standardized by protocol, not personal
            preference.
          </p>
        </SectionCard>

        <SectionCard eyebrow="5. Integrity" title="Correction as governed act">
          <p>
            Errors, contradictions, and misjudgments require immediate
            correction.
          </p>
          <p>
            Correction is not an embarrassment protocol. It is a governed act of
            epistemic integrity.
          </p>
          <p>Silent edits are forbidden.</p>
        </SectionCard>

        <SectionCard eyebrow="6. Attribution" title="Citation as anti-drift discipline">
          <p>
            All prior work referenced, internal or external, must be cited.
            Attribution blocks enclosure, collapse of provenance, and epistemic
            drift.
          </p>
          <p>
            Citation acknowledges lineage only. It does not imply endorsement or
            validation.
          </p>
        </SectionCard>

        <SectionCard eyebrow="7. Boundary Control" title="Crossover into usability invalidates the inquiry">
          <p>
            Boundary research is monitored continuously for drift toward
            application, usability, or recommendation.
          </p>
          <p>
            Crossing into usability is not a maturation event. It is grounds for
            cessation of inquiry within this regime.
          </p>
        </SectionCard>

        <SectionCard eyebrow="8–10. Continuity" title="Versioning, contribution, and unresolved questions">
          <p>
            All material is versioned and history must remain accessible. No
            undocumented change is permitted.
          </p>
          <p>
            External submissions may be reviewed, but confer no inclusion right
            and no authority.
          </p>
          <p>
            Unresolved questions are codified as boundaries. Speculative closure
            is prohibited.
          </p>
        </SectionCard>
      </section>

      <section className="mt-12 grid gap-8 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Edge Relationship
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Knowledge governs exposure. Protection governs authority.
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            Edge of Knowledge governs what may be exposed, surfaced, and
            characterized at the level of boundary and failure.
          </p>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            <Link
              href="/edge-of-protection"
              className="text-sky-300 underline decoration-sky-800/30 underline-offset-4 transition hover:text-sky-200 hover:decoration-sky-400"
            >
              Edge of Protection
            </Link>{" "}
            governs authority, refusal, and containment. The separation is
            structural and absolute.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Canonical Constraints
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Non-negotiable admissibility invariants
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            All Edge of Knowledge materials operate under the following
            invariants. They are referenced for admissibility only and are not
            restated, interpreted, or modified here.
          </p>

          <ul className="mt-6 space-y-3">
            <li>
              <LinkedInvariant href="/canon/invariants/refusal-outside-optimization">
                Refusal Must Remain Outside Optimization
              </LinkedInvariant>
            </li>
            <li>
              <LinkedInvariant href="/canon/invariants/post-refusal-non-instrumentality">
                Post-Refusal Non-Instrumentality
              </LinkedInvariant>
            </li>
            <li>
              <LinkedInvariant href="/canon/invariants/authority-conservation-across-agents">
                Authority Conservation Across Agents
              </LinkedInvariant>
            </li>
          </ul>
        </section>
      </section>

      <section className="mt-12 rounded-[2rem] border border-sky-900/40 bg-gradient-to-b from-slate-950 to-slate-900 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] md:p-10">
        <div className="max-w-4xl">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Canonical Seal
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            Regime-bounded. Non-actionable. Versioned. Refusal-enforced.
          </h2>
          <p className="mt-4 text-[16px] leading-8 text-slate-400">
            This doctrine remains valid only so long as its boundaries are
            explicit, its revisions historical, and its interpretive limits
            preserved against quiet drift.
          </p>
        </div>
      </section>

      <section className="mt-14 rounded-[2rem] border border-sky-950/45 bg-slate-950/70 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm md:p-10">
        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
              Canonical Index
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-[2.35rem]">
              Included Edge of Knowledge analyses
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            These entries remain subordinate to doctrine. Inclusion does not
            imply usability, recommendation, or design maturity.
          </p>
        </div>

        <ul className="space-y-3">
          <li>
            <LinkedInvariant href="/edge-of-knowledge/boundary-self-modification-prohibition-bsmp-v1">
              Boundary Self-Modification Prohibition (BSMP-v1)
            </LinkedInvariant>
          </li>
          <li>
            <span className="text-[15px] leading-7 text-slate-500">…</span>
          </li>
          <li>
            <LinkedInvariant href="/edge-of-knowledge/epistemic-failure-stress-test">
              Canonical Edge Stress-Test: Epistemic Failure in Medical Discovery
            </LinkedInvariant>
          </li>
          <li>
            <LinkedInvariant href="/edge-of-knowledge/dqf-v1-1">
              Drift Quantification Framework v1.1 (Regime-Bounded Drift Instrumentation)
            </LinkedInvariant>
          </li>
        </ul>
      </section>

      <section className="mt-14 rounded-[1.75rem] border border-sky-950/40 bg-slate-950/55 px-6 py-6 text-center shadow-[0_0_0_1px_rgba(59,130,246,0.04)] backdrop-blur-sm">
        <p className="text-sm leading-7 text-slate-400">
          Version 1.1 · Canonical · Public reference · Updated only by explicit
          revision. Historical versions remain accessible for continuity.
          Interpretive drift or silent update is grounds for invalidation.
        </p>
      </section>
    </main>
  );
}
