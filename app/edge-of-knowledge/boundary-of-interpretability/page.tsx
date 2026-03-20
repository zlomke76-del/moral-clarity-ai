// app/edge-of-knowledge/boundary-of-interpretability/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Boundary of Interpretability | Moral Clarity AI",
  description:
    "A structural epistemic boundary where explanation fails and governance must transition to outcome-based control.",
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
          Edge of Knowledge — Epistemic Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          Boundary of Interpretability
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          When explanation fails, control must change form.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Epistemic Cutoff" />
          <Signal label="Trigger" value="Loss of Explainability" />
          <Signal label="Outcome" value="Governance Transition" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          Regime-bounded · Non-actionable · No implementation guidance
        </div>
      </section>

      {/* DEFINITION */}
      <Section title="Definition">
        <p>
          The boundary of interpretability is reached when system behavior can no
          longer be reliably explained, reconstructed, or validated through
          human-understandable reasoning.
        </p>
        <p>
          Beyond this point, explanation ceases to function as a control
          mechanism.
        </p>
      </Section>

      {/* FAILURE */}
      <section>
        <h2 className="text-2xl font-semibold text-white">
          What Breaks at the Boundary
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FailureBlock title="Explanation">
            Internal reasoning cannot be reliably reconstructed.
          </FailureBlock>

          <FailureBlock title="Verification">
            Claims of understanding cannot be independently confirmed.
          </FailureBlock>

          <FailureBlock title="Control">
            Governance based on reasoning inspection fails.
          </FailureBlock>

          <FailureBlock title="Trust">
            Confidence based on explanation becomes invalid.
          </FailureBlock>
        </div>
      </section>

      {/* GOVERNANCE SHIFT */}
      <Section title="Governance Transition">
        <p>
          When interpretability fails, governance must shift from explanation to
          externally verifiable control.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Outcome accountability replaces reasoning-based justification</li>
          <li>Empirical validation replaces internal inspection</li>
          <li>Procedural transparency replaces interpretive claims</li>
          <li>Safeguards replace assumed understanding</li>
        </ul>

        <p className="italic text-slate-400">
          Opacity does not reduce responsibility—it increases the need for
          enforcement.
        </p>
      </Section>

      {/* LIMITS */}
      <Section title="Non-Negotiable Limits">
        <ul className="list-disc pl-6 space-y-2">
          <li>Perfect interpretability is unattainable at scale</li>
          <li>Tools may create false confidence in understanding</li>
          <li>Human cognition cannot match system complexity indefinitely</li>
        </ul>
      </Section>

      {/* INVALID */}
      <Section title="Invalid Assumptions">
        <ul className="list-disc pl-6 space-y-2">
          <li>Explanation guarantees safety</li>
          <li>Transparency guarantees control</li>
          <li>Understanding can scale with system complexity</li>
        </ul>
      </Section>

      {/* RELATION */}
      <Section title="Canonical Placement">
        <p>
          This entry belongs to the{" "}
          <Link href="/edge-of-knowledge" className="text-sky-300 underline">
            Edge of Knowledge
          </Link>{" "}
          series.
        </p>
        <p>
          Enforcement, refusal, and containment beyond this boundary are defined
          in{" "}
          <Link href="/edge-of-protection" className="text-sky-300 underline">
            Edge of Protection
          </Link>
          .
        </p>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Interpretability is not a permanent property. Once lost, explanation
          cannot be relied on. Governance must shift or failure becomes
          inevitable.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Canonical · Regime-bounded · Versioned · Non-actionable
      </div>
    </main>
  );
}
