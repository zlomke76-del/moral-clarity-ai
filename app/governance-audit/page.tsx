// app/governance-audit/page.tsx
// ============================================================
// MORAL CLARITY GOVERNANCE AUDIT™
// Elevated public-facing positioning page
// Non-advisory · Regime-bounded · Updated only by explicit revision
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Moral Clarity Governance Audit™ | Moral Clarity AI",
  description:
    "A regime-bounded governance diagnostic identifying where systems pass governance, compliance, and validation checks while still producing outcomes that reality cannot support.",
  openGraph: {
    title: "Moral Clarity Governance Audit™",
    description:
      "Where governance passes, but reality fails.",
    url: "https://moralclarity.ai/governance-audit",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-static";

const EXAMINATION_AREAS = [
  {
    title: "Incentive Corruption",
    body: "Where reward structures favor denial, speed, plausible deniability, or continuity over correction.",
  },
  {
    title: "Detection Failure",
    body: "Whether early warnings can surface, whether they are legible when they do, and whether they are permitted to matter.",
  },
  {
    title: "Authority Breakdown",
    body: "Where responsibility exists in theory but not in execution, and where no actor can reliably stop unsafe continuation.",
  },
  {
    title: "Procedural Entrenchment",
    body: "Where process substitutes for judgment and blocks adaptation even when the system is visibly degrading.",
  },
  {
    title: "Action Threshold Collapse",
    body: "Where decisions arrive too late, too fast, or not at all under actual pressure.",
  },
  {
    title: "Meta-Failure of Knowledge Systems",
    body: "Where meaning, interpretation, evidence, and enforcement no longer converge.",
  },
];

const CORE_DIAGNOSTIC = [
  "Act on states that are incomplete, degraded, inferred, or no longer current",
  "Produce outcomes that exceed what the underlying conditions can actually support",
  "Pass governance, compliance, and validation checks while still failing in reality",
  "Continue execution when the state cannot carry the consequence of what has been set in motion",
];

const NOT_THIS = [
  "Not an AI safety checklist",
  "Not an ethics or values workshop",
  "Not a compliance certification",
  "Not a technical model review",
  "Not a validation that the system merely appears correct",
];

const DELIVERABLES = [
  "A written audit identifying where systems produce outcomes that are not supportable by the conditions they depend on, even when governance and validation appear intact",
  "A 60-minute executive debrief focused on what can be governed, what requires redesign, and what must be explicitly refused",
];

const WHEN_IT_MATTERS = [
  "When systems are partially or fully opaque",
  "When incentives are misaligned or adversarial",
  "When responsibility is distributed or unclear",
  "When performance metrics appear healthy but confidence is eroding",
];

export default function GovernanceAuditPage() {
  return (
    <main className="relative overflow-hidden bg-[#020817]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.14),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_22%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-7xl space-y-8 px-6 py-16 md:px-8 lg:px-10 lg:py-20">
        {/* HERO */}
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#2a0d10]/95 via-[#12141b]/92 to-black/92 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-end">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-red-100/85">
                  Moral Clarity Governance Audit™
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Regime-Bounded
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Diagnostic
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                  Where governance passes, but reality fails
                </h1>
                <p className="max-w-4xl text-lg leading-8 text-white/82">
                  A short-cycle, high-signal diagnostic for organizations that
                  need to know whether governance still functions when systems
                  begin to produce outcomes that pass every check, but are not
                  supported by the conditions they depend on.
                </p>
              </div>

              <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.08] p-5">
                <p className="text-sm leading-7 text-red-100/90">
                  <span className="font-semibold">Boundary Notice:</span> This
                  offering is regime-bounded and diagnostic in nature. It does
                  not provide compliance certification, technical assurance, or
                  operational guarantees.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://calendly.com/zlomke76/governance-drift-audit-intake-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Book a Governance &amp; Drift Audit Intake Call
                  <span className="ml-2">↗</span>
                </a>

                <Link
                  href="/edge-of-knowledge"
                  className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white/82 transition hover:border-white/20 hover:bg-white/[0.07]"
                >
                  View Canonical Context
                  <span className="ml-2">→</span>
                </Link>
              </div>

              <p className="text-sm leading-7 text-white/50">
                A $500 deposit is required to reserve an intake slot and is
                applied to the final audit fee.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Focus
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Failures that remain invisible while governance still appears
                  to hold.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Output
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Drift vectors, blind spots, accountability gaps, and points
                  where valid decisions become invalid outcomes.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Boundary
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Diagnostic only. No certification, no assurance, no implied
                  prevention claim.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT THIS IS / POSITION */}
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              What This Is
            </div>
            <p className="mt-4 text-base leading-8 text-white/74">
              The{" "}
              <strong className="text-white">
                Moral Clarity Governance Audit™
              </strong>{" "}
              is designed to identify where organizations lose the ability to
              govern before visible failure occurs.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              Most safety, ethics, and alignment frameworks assume institutions
              can still detect problems, decide coherently, and enforce
              accountability as systems grow more complex.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              In practice, those capacities often fail first.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              More critically, systems can continue to act with full
              authorization, compliance, and internal validity while operating
              on conditions that are no longer strong enough to support the
              consequences of those actions.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/65 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Position
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
              This audit does not ask whether a system is allowed to act.
            </p>
            <p className="mt-4 text-base leading-8 text-white/66">
              It asks whether the conditions it depends on are strong enough to
              support what happens when it does.
            </p>
          </div>
        </section>

        {/* WHAT THIS AUDIT EXAMINES */}
        <section className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#0b1220]/92 via-[#08101d]/92 to-black/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-10">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              What This Audit Examines
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              High-signal governance failure surfaces
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-white/66 md:text-base">
              These are the places where institutions often become least able to
              govern precisely when governance matters most.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {EXAMINATION_AREAS.map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
              >
                <h3 className="text-xl font-semibold tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-white/68">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CORE DIAGNOSTIC */}
        <section className="rounded-[30px] border border-white/10 bg-gradient-to-br from-[#0b1220]/92 via-[#08101d]/92 to-black/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-10">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Core Diagnostic
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Where valid decisions become invalid outcomes
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-white/66 md:text-base">
              The audit identifies where systems:
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {CORE_DIAGNOSTIC.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/76"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* NOT / DELIVERABLES */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              What This Audit Is Not
            </div>
            <ul className="mt-5 space-y-3">
              {NOT_THIS.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/76"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-base leading-8 text-white/66">
              This audit does not evaluate whether a system sounds aligned. It
              evaluates whether governance remains intact under real strain and
              whether the state beneath the system can actually support what the
              system is allowed to do.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/65 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Deliverables
            </div>
            <ul className="mt-5 space-y-3">
              {DELIVERABLES.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/80"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* WHEN IT MATTERS / BOUNDARY */}
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              When This Matters Most
            </div>
            <ul className="mt-5 space-y-3">
              {WHEN_IT_MATTERS.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/76"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/72 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Boundary Statement
            </div>
            <p className="mt-3 text-xl leading-8 text-white md:text-2xl">
              When interpretability, alignment, or ethical intent cannot be
              relied upon, governance must still function.
            </p>
            <p className="mt-4 text-base leading-7 text-white/64">
              And when governance appears to function, this audit asks the next
              question: can reality actually carry what the system is about to
              make real?
            </p>
            <p className="mt-4 text-base leading-7 text-white/64">
              Moral Clarity exists at that boundary.
            </p>
          </div>
        </section>

        {/* CANONICAL CONTEXT + CTA */}
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Canonical Context
            </div>
            <p className="mt-4 text-base leading-8 text-white/74">
              This audit is grounded in the{" "}
              <Link
                href="/edge-of-knowledge"
                className="font-medium text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white/60"
              >
                Edge of Knowledge
              </Link>{" "}
              research series, which examines failure, uncertainty, and
              responsible action where optimization breaks.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#161616]/95 via-[#0f0f10]/92 to-black/92 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Intake
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Reserve an audit intake slot
            </h2>
            <p className="mt-4 text-base leading-8 text-white/66">
              Intake calls are limited and gated. This is a diagnostic, not a
              sales conversation.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="https://calendly.com/zlomke76/governance-drift-audit-intake-call"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/12 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Reserve an Audit Intake Slot
                <span className="ml-2">↗</span>
              </a>
            </div>

            <p className="mt-4 text-sm leading-7 text-white/48">
              A $500 deposit is required to reserve an intake slot and is
              applied to the final audit fee.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
          <p className="text-sm leading-7 text-white/58">
            Moral Clarity Governance Audit™ · Public reference · Updated only by
            explicit revision. No claims of prevention, prediction, or assurance
            are made or implied.
          </p>
        </section>
      </div>
    </main>
  );
}
