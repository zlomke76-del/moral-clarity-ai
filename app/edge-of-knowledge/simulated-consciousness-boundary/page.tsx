import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Signaling Before Failure | Pre-Harm Visibility Boundary",
  description:
    "A constraint establishing that systems must provide detectable signals prior to biological harm, or be considered invalid within that regime.",
  openGraph: {
    title: "Signaling Before Failure",
    description:
      "Failure without warning is not admissible in human-risk systems.",
    url: "https://moralclarity.ai/edge-of-knowledge/signaling-before-failure",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function Section({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-sky-950/40 bg-slate-950/70 p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-300">{children}</div>
    </section>
  );
}

export default function SignalingBeforeFailurePage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">

      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Pre-Harm Visibility Boundary
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Signaling Before Failure
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Systems are valid only if they signal before biological harm—not after failure.
        </p>

        <div className="mt-8 border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200 rounded-xl">
          Signal required · Pre-harm · Silent systems invalid · Human-action dependent
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Boundary">
        <p>
          This system defines a constraint: a material or system exposed to human
          biological risk must provide a detectable signal prior to harm.
        </p>

        <p className="text-red-300">
          Failure without prior signal is not admissible within this regime.
        </p>
      </Section>

      {/* PROBLEM */}
      <Section title="Problem: Silent Failure">
        <ul className="list-disc pl-6">
          <li>Damage accumulates invisibly</li>
          <li>Users receive no actionable warning</li>
          <li>Failure occurs after thresholds are exceeded</li>
        </ul>

        <p className="text-red-300">
          Silent systems concentrate risk into catastrophic events.
        </p>
      </Section>

      {/* PRINCIPLE */}
      <Section title="Signal-Precedence Principle">
        <p>
          The governing rule is not maximum durability, but:
        </p>

        <p className="text-white font-medium">
          A system must signal before harm becomes likely.
        </p>

        <p className="text-red-300">
          Strength without signaling is not safety.
        </p>
      </Section>

      {/* MECHANISMS */}
      <Section title="Physical Mechanisms">
        <ul className="list-disc pl-6">
          <li>Mechanochromic or thermochromic transitions</li>
          <li>Progressive microfracture producing sensory cues</li>
          <li>Irreversible deformation near thresholds</li>
          <li>Non-toxic marker release tied to exposure</li>
        </ul>

        <p>
          These must be intrinsic and non-resettable.
        </p>
      </Section>

      {/* REGIME */}
      <Section title="Regime Mapping">
        <p className="font-semibold text-white">Valid:</p>
        <ul className="list-disc pl-6">
          <li>Known biological thresholds</li>
          <li>Human-interpretable environments</li>
          <li>Absence of monitoring infrastructure</li>
        </ul>

        <p className="font-semibold text-white mt-4">Fails:</p>
        <ul className="list-disc pl-6">
          <li>Zero-threshold hazards</li>
          <li>Critical medical barriers</li>
          <li>Contexts where users cannot respond</li>
        </ul>
      </Section>

      {/* INTEGRITY */}
      <Section title="Signal Integrity Constraint">
        <ul className="list-disc pl-6">
          <li>Signal must occur before harm threshold</li>
          <li>Signal must be unambiguous</li>
          <li>Signal must persist long enough for action</li>
        </ul>

        <p className="text-red-300">
          Late, ambiguous, or ignorable signals invalidate the system.
        </p>
      </Section>

      {/* ETHICS */}
      <Section title="Ethical Constraint">
        <ul className="list-disc pl-6">
          <li>No representation as protective guarantee</li>
          <li>No replacement for elimination or monitoring</li>
          <li>No burden-shifting onto vulnerable users</li>
        </ul>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p><strong>G:</strong> Signal-preserving transformations</p>
        <p><strong>Q:</strong> Biological harm threshold</p>
        <p><strong>S:</strong> Signal state relative to Q</p>

        <p className="text-red-300">
          Failure: Q reached without prior S transition
        </p>
      </Section>

      {/* CLAIM */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any system exposed to biological risk must demonstrate that
          detectable signaling occurs before harm.
        </p>

        <p className="text-red-300">
          Absence of pre-harm signal invalidates safety claims.
        </p>
      </Section>

      {/* FINAL */}
      <section className="border border-red-900/40 bg-red-950/20 p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-white">
          Boundary Judgment
        </h2>
        <p className="mt-4 text-red-200">
          A system that fails silently is not protective—it is delayed harm.
          Safety is not defined by strength, but by visibility before injury.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Pre-harm · Signal-bound · Non-admissible silence · Versioned
      </div>
    </main>
  );
}
