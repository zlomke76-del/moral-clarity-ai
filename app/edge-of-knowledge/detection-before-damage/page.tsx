// app/edge-of-knowledge/detection-before-damage/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Detection Before Damage | Moral Clarity AI",
  description:
    "Epistemic instrumentation for detecting wrongness before irreversible harm occurs.",
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

function Channel({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-sky-900/30 bg-slate-900/60 p-5">
      <div className="text-sm font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm text-slate-400">{desc}</p>
    </div>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10 shadow-xl">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Epistemic Instrumentation
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Detection Before Damage
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          How systems surface wrongness before it becomes irreversible.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Instrumentation Layer" />
          <Signal label="Function" value="Early Wrongness Detection" />
          <Signal label="Outcome" value="Harm Containment" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          Non-actionable · Detection ≠ Prevention · No guarantees
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Function">
        <p>
          Detection Before Damage defines how systems surface wrongness early
          enough to reduce scale and duration of harm.
        </p>
        <p>
          It does not eliminate failure. It constrains its spread.
        </p>
      </Section>

      {/* CHANNELS */}
      <section>
        <h2 className="text-2xl font-semibold text-white">
          Detection Channels
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Channel
            title="Early Feedback"
            desc="Staged exposure reveals defects before scale amplifies impact."
          />

          <Channel
            title="Adversarial Review"
            desc="Dissent surfaces fragility hidden by consensus."
          />

          <Channel
            title="Indicator Tracking"
            desc="Explicit signals reveal deviation and instability."
          />

          <Channel
            title="Error Reporting"
            desc="Low-friction pathways surface uncertainty early."
          />

          <Channel
            title="Scenario Stress"
            desc="Simulated conditions expose vulnerability surfaces."
          />

          <Channel
            title="Audit Checkpoints"
            desc="Structured pauses force explicit risk acknowledgment."
          />
        </div>
      </section>

      {/* CONSTRAINTS */}
      <Section title="Detection Limits">
        <ul className="list-disc pl-6 space-y-2">
          <li>Finite attention and resources</li>
          <li>Complexity masking signal</li>
          <li>Incomplete or noisy data</li>
          <li>Incentives suppressing bad news</li>
        </ul>
      </Section>

      {/* FAILURE */}
      <Section title="Failure Conditions">
        <ul className="list-disc pl-6 space-y-2">
          <li>Signals are ignored or suppressed</li>
          <li>Detection occurs after irreversible state change</li>
          <li>Feedback loops are delayed or broken</li>
          <li>Reporting pathways are blocked</li>
        </ul>
      </Section>

      {/* NON-CONCLUSIONS */}
      <Section title="Non-Negotiable Limits">
        <ul className="list-disc pl-6 space-y-2">
          <li>No system guarantees early detection</li>
          <li>Unknown unknowns remain undetectable</li>
          <li>Detection cannot ensure intervention success</li>
          <li>Trade-offs between speed and coverage persist</li>
        </ul>
      </Section>

      {/* RELATION */}
      <Section title="System Placement">
        <p>
          Detection operates within the{" "}
          <Link href="/edge-of-knowledge" className="text-sky-300 underline">
            Edge of Knowledge
          </Link>
          .
        </p>
        <p>
          Enforcement, refusal, and response are governed by{" "}
          <Link href="/edge-of-protection" className="text-sky-300 underline">
            Edge of Protection
          </Link>
          .
        </p>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Instrument Judgment
        </h2>
        <p className="mt-4 text-red-200">
          Detection reduces harm only if signals are surfaced early enough and
          acted on. It cannot eliminate failure—only constrain its impact.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Canonical · Instrumentation · Non-actionable · Versioned
      </div>
    </main>
  );
}
