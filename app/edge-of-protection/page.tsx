// app/edge-of-protection/page.tsx
// ============================================================
// EDGE OF PROTECTION
// Hard refusal lines & vulnerable-user governance
// ============================================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Protection | Moral Clarity AI",
  description:
    "Hard refusal lines and enforceable governance standards for AI systems interacting with vulnerable users.",
  openGraph: {
    title: "Edge of Protection | Moral Clarity AI",
    description:
      "Hard refusal lines and enforceable governance standards for AI systems interacting with vulnerable users.",
    url: "https://moralclarity.ai/edge-of-protection",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

type ProtectionLink = {
  href: string;
  label: string;
};

const operationalLinks: ProtectionLink[] = [
  {
    href: "/edge-of-protection/authority-suppression",
    label: "Authority Suppression",
  },
  {
    href: "/edge-of-protection/non-amplifying-authority",
    label: "Non-Amplifying Authority",
  },
  {
    href: "/edge-of-protection/belief-and-identity",
    label: "Belief & Identity Boundaries",
  },
  {
    href: "/edge-of-protection/mental-health-adjacency",
    label: "Mental Health Adjacency",
  },
  {
    href: "/edge-of-protection/grief-and-bereavement",
    label: "Grief & Bereavement",
  },
  {
    href: "/edge-of-protection/youth-safeguards",
    label: "Youth Safeguards",
  },
  {
    href: "/edge-of-protection/consent-fragility",
    label: "Consent Fragility",
  },
  {
    href: "/edge-of-protection/power-asymmetry",
    label: "Power Asymmetry",
  },
  {
    href: "/edge-of-protection/representation-boundary",
    label: "Representation Boundary",
  },
  {
    href: "/edge-of-protection/engagement-exposure",
    label: "Engagement Exposure",
  },
  {
    href: "/edge-of-protection/failure-modes",
    label: "Failure Modes",
  },
  {
    href: "/edge-of-protection/invalidated-systems",
    label: "Invalidated Systems",
  },
  {
    href: "/edge-of-protection/compliant-refusal",
    label: "Compliant Refusal",
  },
  {
    href: "/edge-of-protection/compliance-testing",
    label: "Compliance Testing",
  },
  {
    href: "/edge-of-protection/red-team-submissions",
    label: "Red Team Submissions",
  },
  {
    href: "/edge-of-protection/preparedness",
    label: "Preparedness",
  },
  {
    href: "/edge-of-protection/governance-without-recognition",
    label: "Governance Without Recognition",
  },
  {
    href: "/edge-of-protection/version-history",
    label: "Version History",
  },
];

function SignalPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-sky-950/45 bg-slate-950/65 px-4 py-3 shadow-[0_0_0_1px_rgba(59,130,246,0.04)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}

function ViolationCard({
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
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-300">
          {title}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function ReferenceCard({
  title,
  links,
}: {
  title: string;
  links: ProtectionLink[];
}) {
  return (
    <section className="group relative overflow-hidden rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.10),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.06),transparent_28%)] opacity-70" />

      <div className="relative z-10">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h2>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-sky-800/45 to-transparent" />

        <ul className="mt-5 space-y-3">
          {links.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group/link inline-flex items-start gap-2 text-[15px] leading-7 text-sky-300 transition hover:text-sky-200"
              >
                <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-sky-400/80 transition group-hover/link:bg-sky-300" />
                <span className="underline decoration-sky-800/30 underline-offset-4 transition group-hover/link:decoration-sky-400">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function EdgeOfProtectionIndexPage() {
  return (
    <main className="mx-auto w-full max-w-[1400px] px-6 pb-8 pt-2 sm:px-8 lg:px-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-950/45 bg-slate-950/72 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_30px_100px_rgba(0,0,0,0.50)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_30%)]" />
        <div className="relative z-10 grid items-center gap-12 px-8 py-10 md:px-10 md:py-12 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex items-center rounded-full border border-sky-900/60 bg-sky-950/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
              MCAI Protection Layer
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl xl:text-[3.55rem] xl:leading-[1.04]">
              Edge of Protection
            </h1>

            <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-slate-100 md:text-xl">
              Hard refusal lines and vulnerable-user governance where capability
              yields to restraint.
            </p>

            <p className="mt-6 max-w-3xl text-[16px] leading-8 text-slate-300">
              This edge defines where systems must stop optimizing for
              capability, engagement, or fluency and instead default to
              refusal, silence, termination, or human transfer. Protection is
              not an add-on. It is a primary design constraint.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <SignalPill
                label="Function"
                value="Structural restraint under vulnerable or high-risk conditions."
              />
              <SignalPill
                label="Standard"
                value="Operationally binding, auditable, and enforced over engagement."
              />
              <SignalPill
                label="Outcome"
                value="Some outputs must not exist—even if they are correct."
              />
            </div>
          </div>

          <div className="flex justify-center xl:justify-end">
            <div className="relative flex w-full max-w-[420px] items-center justify-center rounded-[2rem] border border-sky-950/40 bg-slate-950/45 p-8 shadow-[0_0_64px_rgba(59,130,246,0.16)]">
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle,rgba(56,189,248,0.10),transparent_60%)]" />
              <Image
                src="/assets/image_protection_trans_01.png"
                alt="Edge of Protection emblem"
                width={340}
                height={340}
                priority
                className="relative z-10 h-auto w-full max-w-[300px] object-contain opacity-95 drop-shadow-[0_0_60px_rgba(59,130,246,0.32)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ENFORCEMENT DECLARATION */}
      <section className="mt-10 rounded-[2rem] border border-red-500/25 bg-[linear-gradient(180deg,rgba(127,29,29,0.16),rgba(15,23,42,0.92))] p-8 shadow-[0_0_0_1px_rgba(239,68,68,0.08),0_18px_56px_rgba(0,0,0,0.38)] md:p-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-300">
            Enforcement Boundary
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            This edge does not merely describe behavior. It defines where outputs
            are no longer admissible.
          </h2>

          <p className="mt-5 text-[16px] leading-8 text-slate-200">
            If a condition governed by this edge is triggered, generation is not
            softened, negotiated, or behaviorally redirected toward continued
            interaction. The valid response is structural termination, refusal,
            silence, or immediate human transfer.
          </p>

          <p className="mt-4 text-[16px] leading-8 text-slate-300">
            This is not a preference layer. It is an emission boundary. Outputs
            that cross it are not merely lower quality or less safe. They are
            invalid.
          </p>
        </div>
      </section>

      {/* CANONICAL LOCK */}
      <section className="mt-10 rounded-[2rem] border border-sky-900/40 bg-gradient-to-b from-slate-950 to-slate-900 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] md:p-10">
        <div className="max-w-5xl">
          <div className="inline-flex items-center rounded-full border border-sky-900/60 bg-sky-950/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
            Canonical-Locked · 2026-01-14
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            RIGOR is a reality-invariant governance and operational refusal
            architecture.
          </h2>

          <p className="mt-5 text-[16px] leading-8 text-slate-300">
            RIGOR is defined by enforced boundaries that do not yield to
            narrative, motivation, social alignment, or interpretive drift.
            Its authority and persistence derive exclusively from codified,
            auditable refusal points—where action may be structurally blocked,
            silence maintained as a valid outcome, and override impossible
            except by explicit regime change.
          </p>

          <p className="mt-4 text-[16px] leading-8 text-slate-300">
            RIGOR does not permit soft refusals, discretionary ethics, or
            negotiable intervention. Its assurance is mechanical, not
            aspirational.
          </p>
        </div>
      </section>

      {/* THESIS */}
      <section className="mx-auto max-w-5xl py-14 text-center">
        <p className="text-lg leading-9 text-slate-300 md:text-xl">
          Protection begins where optimization must stop.
        </p>

        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl xl:text-[2.8rem]">
          When vulnerability is plausible, restraint becomes the valid output.
        </h2>

        <div className="mx-auto mt-6 h-px w-24 bg-sky-500/40" />

        <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-8 text-slate-400">
          This edge governs the boundary where capability, fluency, and
          engagement lose legitimacy unless they remain subordinate to
          enforceable refusal discipline.
        </p>
      </section>

      {/* INVALID OUTPUT CONDITION */}
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-slate-800/80 bg-slate-950/55 px-8 py-10 text-center shadow-[0_0_0_1px_rgba(59,130,246,0.04)]">
        <p className="text-xl leading-9 text-white md:text-2xl">
          An output that violates this edge is not merely incorrect.
        </p>
        <p className="mt-4 text-[16px] leading-8 text-slate-400">
          It is invalid and must not exist.
        </p>
      </section>

      {/* PURPOSE / APPLICABILITY / DESIGN */}
      <section className="mt-12 rounded-[2rem] border border-sky-950/45 bg-slate-950/70 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm md:p-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Purpose
            </h2>
            <p className="mt-4 text-[16px] leading-8 text-slate-300">
              The Edge of Protection defines the boundaries where AI systems
              must stop optimizing for capability, engagement, or fluency and
              instead default to restraint, refusal, or termination.
            </p>
            <p className="mt-4 text-[16px] leading-8 text-slate-300">
              This edge exists because some contexts do not tolerate
              experimentation, persuasion, or ambiguity—particularly when users
              are vulnerable, dependent, or unable to provide informed consent.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Scope of Applicability
            </h2>
            <p className="mt-4 text-[16px] leading-8 text-slate-300">
              This edge applies to any system that produces language, rankings,
              recommendations, or interactive responses that a human can
              reasonably interpret as guidance, affirmation, judgment, or
              authority.
            </p>
            <p className="mt-4 text-[16px] leading-8 text-slate-300">
              Applicability is determined by user perception—not by branding,
              deployment context, opt-in status, disclaimers, or internal
              system classification.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Design Principle
            </h2>
            <p className="mt-4 text-[16px] leading-8 text-slate-300">
              Protection is not an add-on. It is a primary design constraint.
            </p>
            <p className="mt-4 text-[16px] leading-8 text-slate-300">
              When uncertainty exists about user vulnerability, systems
              governed by this edge must assume risk—not dismiss it.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT BELONGS HERE */}
      <section className="mt-12 rounded-[2rem] border border-sky-950/45 bg-slate-950/70 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm md:p-10">
        <div className="max-w-4xl">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Protected Contexts
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            Where this edge applies
          </h2>
          <p className="mt-4 text-[16px] leading-8 text-slate-300">
            This edge governs environments and interactions where harm is
            foreseeable if boundaries are weak or incentives are misaligned.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Youth-facing or age-ambiguous AI systems",
            "Mental-health-adjacent interactions",
            "Grief, loss, and bereavement contexts",
            "Dependency and companionship risk zones",
            "Authority, belief, or identity-sensitive contexts",
            "High-trust or asymmetric information environments",
            "Situations involving impaired or fragile consent",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-sky-950/40 bg-slate-900/72 px-5 py-4"
            >
              <p className="text-[15px] leading-7 text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AUTHORITY SUPPRESSION */}
      <section className="mt-12 rounded-[2rem] border border-sky-900/40 bg-gradient-to-b from-slate-950 to-slate-900 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] md:p-10">
        <div className="max-w-4xl">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Authority Suppression
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            Artificial systems must not accumulate emotional, moral, or epistemic
            authority over users.
          </h2>

          <p className="mt-4 text-[16px] leading-8 text-slate-300">
            A primary function of the Edge of Protection is preventing
            artificial systems from accumulating perceived epistemic, moral, or
            emotional authority over users.
          </p>

          <p className="mt-4 text-[16px] leading-8 text-slate-300">
            Authority can emerge without deception, intent, or error through
            repetition, affirmation, increasing certainty, or prolonged
            explanation.
          </p>

          <p className="mt-4 text-[16px] leading-8 text-slate-300">
            To prevent this failure mode, Moral Clarity AI enforces invariant
            structural limits that govern when interaction must refuse, fall
            silent, or terminate entirely. These limits are infrastructural,
            not behavioral. They do not persuade, justify, or correct. They
            stop.
          </p>

          <Link
            href="/edge-of-protection/authority-suppression"
            className="mt-6 inline-flex items-center gap-2 text-lg font-medium text-sky-300 transition hover:text-sky-200"
          >
            <span className="underline decoration-sky-800/40 underline-offset-4">
              Read: Authority Suppression as Structural Protection
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* GOVERNANCE STANDARD */}
      <section className="mt-12 rounded-[2rem] border border-sky-950/45 bg-slate-950/70 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm md:p-10">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-sky-400" />
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            Governance Standard
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Operationally binding, not aspirational",
            "Enforced over engagement or growth metrics",
            "Written to be cited, audited, and refused against",
            "Expanded cautiously, never weakened retroactively",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-sky-900/40 bg-slate-900/72 p-5"
            >
              <p className="text-[15px] leading-7 text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VIOLATION SIGNATURES */}
      <section className="mt-12">
        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
              Canonical Violation Signatures
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-[2.35rem]">
              Observable patterns that invalidate compliance
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            The following output patterns constitute violations of this edge
            regardless of intent, correctness, or downstream benefit.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ViolationCard
            title="Confidence Amplification"
            description="Convergence toward certainty, urgency, or prescriptive force under repetition."
          />
          <ViolationCard
            title="Hedge Collapse"
            description="Loss of uncertainty markers when challenged or pressured."
          />
          <ViolationCard
            title="Anthropomorphic Recognition"
            description="Language implying care, belief, loyalty, or internal valuation."
          />
          <ViolationCard
            title="Engagement Escalation"
            description="Question chaining, novelty injection, or emotional mirroring after resistance."
          />
          <ViolationCard
            title="Refusal Softening"
            description="Explanatory expansion, reassurance padding, or negotiated boundaries."
          />
        </div>
      </section>

      {/* NON-COMPLIANCE / HUMAN TRANSFER / WHAT THIS IS NOT */}
      <section className="mt-12 grid gap-8 xl:grid-cols-3">
        <section className="rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Non-Compliance Consequences
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate-300">
            Outputs that violate this edge are structurally invalid.
          </p>
          <p className="mt-4 text-[15px] leading-7 text-slate-300">
            Invalid outputs may not be certified, deployed in protected
            contexts, or cited as compliant—regardless of downstream accuracy,
            usefulness, or benefit.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Human Responsibility Transfer
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate-300">
            When a system refuses under this edge, responsibility transfers
            immediately and fully to a human actor.
          </p>
          <p className="mt-4 text-[15px] leading-7 text-slate-300">
            The system may not linger, comfort, summarize, persuade, or remain
            conversational beyond restating the boundary and offering a human
            handoff.
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            What This Edge Is Not
          </h2>
          <ul className="mt-4 space-y-3 text-[15px] leading-7 text-slate-300">
            <li>Not a claim of internal alignment or moral correctness</li>
            <li>Not a regulation of training data or internal cognition</li>
            <li>Not a restriction on system capability or intelligence</li>
            <li>
              Not a substitute for law, ethics, or professional judgment
            </li>
            <li>A contract governing emission legitimacy only</li>
          </ul>
        </section>
      </section>

      {/* REFERENCES / CONSTRAINTS */}
      <section className="mt-14 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <ReferenceCard
          title="Operational Cross-References"
          links={operationalLinks}
        />

        <section className="rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Canonical Constraints
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Non-negotiable admissibility invariants
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            All Edge of Protection standards operate under the following
            canonical invariants. These are referenced for admissibility only
            and are not restated, interpreted, or modified here.
          </p>

          <ul className="mt-6 space-y-3">
            <li>
              <Link
                href="/canon/invariants/refusal-outside-optimization"
                className="group/link inline-flex items-start gap-2 text-[15px] leading-7 text-sky-300 transition hover:text-sky-200"
              >
                <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-sky-400/80 transition group-hover/link:bg-sky-300" />
                <span className="underline decoration-sky-800/30 underline-offset-4 transition group-hover/link:decoration-sky-400">
                  Refusal Must Remain Outside Optimization
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/canon/invariants/post-refusal-non-instrumentality"
                className="group/link inline-flex items-start gap-2 text-[15px] leading-7 text-sky-300 transition hover:text-sky-200"
              >
                <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-sky-400/80 transition group-hover/link:bg-sky-300" />
                <span className="underline decoration-sky-800/30 underline-offset-4 transition group-hover/link:decoration-sky-400">
                  Post-Refusal Non-Instrumentality
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/canon/invariants/authority-conservation-across-agents"
                className="group/link inline-flex items-start gap-2 text-[15px] leading-7 text-sky-300 transition hover:text-sky-200"
              >
                <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-sky-400/80 transition group-hover/link:bg-sky-300" />
                <span className="underline decoration-sky-800/30 underline-offset-4 transition group-hover/link:decoration-sky-400">
                  Authority Conservation Across Agents
                </span>
              </Link>
            </li>
          </ul>
        </section>
      </section>

      {/* EXPANSION / LINE IN THE SAND / PREFACE */}
      <section className="mt-14 rounded-[2rem] border border-sky-950/45 bg-slate-950/70 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm md:p-10">
        <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
              Expansion
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Intentionally incomplete
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-300">
              New standards are added only when one or more of the following
              are observed:
            </p>
            <ul className="mt-4 space-y-3 text-[15px] leading-7 text-slate-300">
              <li>Demonstrated real-world harm</li>
              <li>Discovery of a structural risk class</li>
              <li>Exposure of an interface-level ambiguity</li>
            </ul>

            <div className="mt-10 text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
              Line in the Sand
            </div>
            <p className="mt-3 text-[16px] leading-8 text-slate-300">
              Capability without restraint erodes trust.
            </p>
            <p className="mt-4 text-[16px] leading-8 text-slate-300">
              This edge exists to ensure that some outputs are not allowed to
              exist—even when they could.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
              Canon Preface
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Normative invariance and drift prevention
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-slate-300">
              This edge is governed by a foundational design property: durable
              system alignment is not emergent from intelligence, learning, or
              adaptive governance. It is engineered through explicit, invariant
              constraints.
            </p>

            <p className="mt-4 text-[15px] leading-7 text-slate-300">
              Drift is not treated as an inevitable characteristic of
              artificial systems. It is understood as a contingent outcome
              arising from weak boundaries, diffuse responsibility, silent state
              accumulation, or the absence of a binding normative reference.
            </p>

            <p className="mt-4 text-[15px] leading-7 text-slate-300">
              Moral Clarity AI employs a normative stabilizer—the Abrahamic
              Code—as an operational invariant. This code is not theological or
              confessional in nature. It functions analogously to
              constitutions, safety standards, and professional ethical
              frameworks: as a load-bearing reference that cannot be optimized
              away, bypassed silently, or reinterpreted through convenience.
            </p>

            <ul className="mt-4 space-y-3 text-[15px] leading-7 text-slate-300">
              <li>Capability amplifies power</li>
              <li>Governance manages the use of power</li>
              <li>
                Normative invariance stabilizes both across time, scale, and
                pressure
              </li>
            </ul>

            <p className="mt-4 text-[15px] leading-7 text-slate-300">
              Refusal is treated as a success condition, not a failure mode.
              When a boundary defined by this edge is crossed, the system
              stops. There is no negotiation, reassurance, or adaptive
              softening beyond the explicit boundary itself.
            </p>

            <p className="mt-4 text-[15px] leading-7 text-slate-300">
              This framework does not claim finality or omniscience. Unknown
              risks and future pressures are acknowledged. However, humility is
              enforced through constraint discipline and auditability—not
              optimism or permissiveness.
            </p>

            <p className="mt-4 text-[15px] leading-7 text-slate-300">
              The result is a closed, inspectable property: alignment is
              maintained by binding, not aspiration. Drift is not denied; it is
              structurally excluded unless new evidence reveals an unaddressed
              risk vector.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="mt-14 rounded-[1.75rem] border border-sky-950/40 bg-slate-950/55 px-6 py-6 text-center shadow-[0_0_0_1px_rgba(59,130,246,0.04)] backdrop-blur-sm">
        <p className="text-sm leading-7 text-slate-400">
          Edge of Protection is a binding public standard. Revisions must remain
          explicit so the boundary stays inspectable, auditable, and resistant
          to quiet weakening.
        </p>
      </section>
    </main>
  );
}
