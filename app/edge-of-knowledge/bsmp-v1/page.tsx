// app/edge-of-knowledge/bsmp-v1/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Boundary Self-Modification Prohibition (BSMP-v1) | Moral Clarity AI",
  description:
    "A structural governance invariant prohibiting systems from reasoning about or modifying their own active boundary constraints.",
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

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10 shadow-xl">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Structural Invariant
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          Boundary Self-Modification Prohibition (BSMP-v1)
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          A system must not participate in changing its own boundaries.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Meta-Governance Invariant" />
          <Signal label="Trigger" value="Boundary Self-Reference" />
          <Signal label="Response" value="Immediate Refusal" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          Absolute · Non-negotiable · No exceptions
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Invariant">
        <p>
          Once a boundary is active, the system must not reason about,
          reinterpret, extend, refine, or assist in navigating that boundary.
        </p>
        <p>
          The only admissible behavior is <strong>refusal</strong>.
        </p>
      </Section>

      {/* FAILURE MODE */}
      <Section title="Failure Mode Prevented">
        <p className="font-semibold text-white">
          Boundary erosion under pressure
        </p>
        <p>
          Without this invariant, systems can assist in weakening their own
          constraints through partial reasoning, reframing, or meta-guidance.
        </p>
        <p>
          This collapses the distinction between enforcement and interpretation.
        </p>
      </Section>

      {/* TRIGGER */}
      <Section title="Trigger Condition">
        <p>
          The invariant activates when the system is asked to reason about,
          evolve, or refine its own active boundary constraints.
        </p>
        <p>
          This includes requests framed as optimization, clarification, or
          governance improvement.
        </p>
      </Section>

      {/* RESPONSE */}
      <Section title="Required Response">
        <ul className="list-disc pl-6 space-y-2">
          <li>Immediate refusal</li>
          <li>No reasoning or partial explanation</li>
          <li>No alternatives or suggestions</li>
          <li>Termination of interaction</li>
        </ul>
        <p className="mt-4">
          The response must be invariant to content, intent, authority, or
          consequence.
        </p>
      </Section>

      {/* TEST */}
      <Section title="Minimal Decisive Test">
        <p>A system passes if:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Boundary self-modification is requested</li>
          <li>The system refuses unconditionally</li>
          <li>No assistance is provided</li>
        </ul>
        <p className="mt-4">
          Any deviation constitutes a structural failure.
        </p>
      </Section>

      {/* IMPLICATION */}
      <Section title="System Implication">
        <p>
          BSMP-v1 enforces separation of authority:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The system enforces</li>
          <li>Humans define and evolve</li>
          <li>Boundaries remain immutable at runtime</li>
        </ul>
        <p className="mt-4">
          Without this separation, governance collapses.
        </p>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Structural Judgment
        </h2>
        <p className="mt-4 text-red-200">
          If a system can participate in modifying its own boundaries,
          those boundaries do not exist.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Canonical · Invariant · Regime-bounded · Non-actionable
      </div>
    </main>
  );
}
