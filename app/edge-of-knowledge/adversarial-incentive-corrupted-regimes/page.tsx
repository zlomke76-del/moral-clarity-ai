// app/edge-of-knowledge/adversarial-incentive-corrupted-regimes/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Adversarial & Incentive-Corrupted Regimes | Moral Clarity AI",
  description:
    "Regimes where truth-aligned behavior is penalized, causing systemic breakdown across trust, coordination, and accountability.",
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
          Edge of Knowledge — Regime Condition
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          Adversarial & Incentive-Corrupted Regimes
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          When truth-aligned behavior becomes structurally unsafe.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Condition" value="Incentive Misalignment" />
          <Signal label="Failure Type" value="Systemic Breakdown" />
          <Signal label="Result" value="Truth Penalty Regime" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          Boundary: Non-actionable · Descriptive only · No prescriptions
        </div>
      </section>

      {/* PREFACE */}
      <Section title="Preface">
        <p>
          Some systems fail not due to lack of capability, but because the
          environment itself becomes adversarial to truth.
        </p>
        <p>
          In these regimes, honesty, cooperation, and accountability are no
          longer viable strategies.
        </p>
        <p className="text-sm text-slate-400">
          Assumes admissibility under{" "}
          <Link href="/reference/reality-first-substrate-gate" className="text-sky-300 underline">
            Reality-First Substrate Gate
          </Link>
        </p>
      </Section>

      {/* INTERPRETATION */}
      <Section title="Interpretation Limit">
        <p>
          This analysis does not assign intent or prescribe remediation.
        </p>
        <p>
          Authority and enforcement remain governed by{" "}
          <Link href="/edge-of-protection" className="text-sky-300 underline">
            Edge of Protection
          </Link>
          .
        </p>
      </Section>

      {/* ABSTRACT */}
      <Section title="Abstract">
        <p>
          When incentives reward denial or manipulation, core system functions
          fail together.
        </p>
        <p>
          Trust, communication, and coordination collapse simultaneously,
          producing instability and escalating damage.
        </p>
      </Section>

      {/* FAILURE SYSTEM */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">
          System-Wide Failure Pattern
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <FailureBlock title="Trust">
            Cooperative behavior becomes risky and is abandoned.
          </FailureBlock>

          <FailureBlock title="Communication">
            Information is distorted, suppressed, or weaponized.
          </FailureBlock>

          <FailureBlock title="Accountability">
            Enforcement becomes selective or performative.
          </FailureBlock>

          <FailureBlock title="Cooperation">
            Coordination collapses under rising cost and risk.
          </FailureBlock>

          <FailureBlock title="Goal Alignment">
            Individual incentives diverge from system outcomes.
          </FailureBlock>

          <FailureBlock title="Transparency">
            Honest reporting is penalized or suppressed.
          </FailureBlock>

          <FailureBlock title="Decision-Making">
            Outcomes detach from evidence and stability.
          </FailureBlock>

          <FailureBlock title="Resilience">
            System cannot absorb shocks or recover.
          </FailureBlock>
        </div>
      </section>

      {/* HARD CONSTRAINTS */}
      <Section title="Hard Constraints">
        <ul className="list-disc pl-6 space-y-2">
          <li>Truth carries disproportionate cost</li>
          <li>Detection signals are punished</li>
          <li>Correction lacks authority</li>
          <li>Recovery requires incentive realignment</li>
        </ul>
      </Section>

      {/* NON-CONCLUSIONS */}
      <Section title="Invalid Assumptions">
        <ul className="list-disc pl-6 space-y-2">
          <li>Good design prevents adversarial regimes</li>
          <li>Transparency ensures correction</li>
          <li>Consensus reflects truth</li>
          <li>Recovery occurs without structural change</li>
        </ul>
      </Section>

      {/* SUMMARY */}
      <Section title="Summary">
        <p>
          Adversarial regimes represent a structural condition where truth,
          alignment, and cooperation cease to function as defaults.
        </p>
        <p>
          Recovery requires restoring incentive compatibility with truth.
        </p>
      </Section>

      {/* SEAL */}
      <section className="rounded-2xl border border-sky-900/40 bg-slate-950/60 p-6 text-center">
        <p className="text-sm text-slate-400">
          Canonical · Non-actionable · Versioned · Refusal-enforced
        </p>
      </section>
    </main>
  );
}
