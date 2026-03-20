// app/edge-of-knowledge/boundary-of-coordination-under-uncertainty/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Boundary of Coordination Under Uncertainty | Moral Clarity AI",
  description:
    "A structural regime boundary where coordination fails as uncertainty overwhelms trust, alignment, and shared meaning.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8 shadow-lg backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300 leading-7">
        {children}
      </div>
    </section>
  );
}

function Signal({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-sky-900/40 bg-slate-900/60 p-4">
      <div className="text-xs uppercase tracking-widest text-sky-300">
        {label}
      </div>
      <div className="mt-2 text-sm text-slate-200">{value}</div>
    </div>
  );
}

function FailureBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-sky-900/30 bg-slate-900/60 p-5">
      <div className="text-sm font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm text-slate-400 leading-6">{children}</p>
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10 shadow-xl">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Regime Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          Boundary of Coordination Under Uncertainty
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          When coordination becomes structurally impossible.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Regime Boundary" />
          <Signal label="Driver" value="Uncertainty Overload" />
          <Signal label="Outcome" value="Coordination Collapse" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          Regime-bounded · Non-actionable · No prescriptive guidance
        </div>
      </section>

      {/* DEFINITION */}
      <Section title="Definition">
        <p>
          The boundary is reached when trust, shared meaning, incentives, and
          accountability degrade to the point that coordination cannot be
          reliably formed or sustained.
        </p>
        <p>
          Failure arises not from individual incompetence, but from structural
          breakdown of alignment conditions.
        </p>
      </Section>

      {/* FAILURE SYSTEM */}
      <section>
        <h2 className="text-2xl font-semibold text-white">
          System Degradation Pattern
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FailureBlock title="Trust">
            Cooperation becomes unsafe or irrational.
          </FailureBlock>

          <FailureBlock title="Communication">
            Signals fragment, distort, or disappear.
          </FailureBlock>

          <FailureBlock title="Accountability">
            Responsibility becomes unenforceable or weaponized.
          </FailureBlock>

          <FailureBlock title="Alignment">
            Shared goals cannot be formed or maintained.
          </FailureBlock>

          <FailureBlock title="Incentives">
            Harmful or extractive behavior is rewarded.
          </FailureBlock>

          <FailureBlock title="Decision-Making">
            Outcomes detach from evidence and coherence.
          </FailureBlock>

          <FailureBlock title="Rules">
            Agreements lose force or become selectively applied.
          </FailureBlock>

          <FailureBlock title="Resilience">
            System cannot recover or correct trajectory.
          </FailureBlock>
        </div>
      </section>

      {/* CONSEQUENCE */}
      <Section title="System Consequences">
        <ul className="list-disc pl-6 space-y-2">
          <li>Progress stalls or reverses</li>
          <li>Escalation replaces problem-solving</li>
          <li>Ethical degradation accelerates</li>
          <li>Recovery requires structural realignment</li>
        </ul>
      </Section>

      {/* LIMITS */}
      <Section title="Non-Negotiable Limits">
        <ul className="list-disc pl-6 space-y-2">
          <li>Coordination cannot be guaranteed under high uncertainty</li>
          <li>Procedure cannot substitute for trust</li>
          <li>Formal agreement does not imply alignment</li>
        </ul>
      </Section>

      {/* RELATION */}
      <Section title="Canonical Placement">
        <p>
          This entry is part of the{" "}
          <Link href="/edge-of-knowledge" className="text-sky-300 underline">
            Edge of Knowledge
          </Link>{" "}
          series.
        </p>
        <p>
          Authority, refusal, and enforcement beyond this boundary are governed
          by{" "}
          <Link href="/edge-of-protection" className="text-sky-300 underline">
            Edge of Protection
          </Link>
          .
        </p>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Regime Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Beyond this boundary, coordination fails structurally. Recovery is not
          procedural—it requires restoration of trust, alignment, and shared
          truth.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Canonical · Regime-bounded · Versioned · Non-actionable
      </div>
    </main>
  );
}
