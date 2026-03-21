import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Human Supervision as a Failsafe — Short-Cycle Authority Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle constraint test examining whether human supervision is admissible as a reliable failsafe in partially autonomous systems.",
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
    <section className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm">
      <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
        {eyebrow}
      </div>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="space-y-4 text-[15px] leading-7 text-zinc-700">
        {children}
      </div>
    </section>
  );
}

function SignalPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "fail" | "pass";
}) {
  const toneClass =
    tone === "fail"
      ? "border-rose-500/20 bg-rose-500/10 text-rose-700"
      : tone === "pass"
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
        : "border-zinc-300 bg-zinc-100 text-zinc-700";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}>
      {children}
    </span>
  );
}

export default function HumanSupervisionAutonomyPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border bg-gradient-to-br from-white to-zinc-100 p-10">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Authority Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold">
            Human Supervision as a Failsafe in Partially Autonomous Systems
          </h1>

          <p className="mt-6 text-lg max-w-3xl text-zinc-700">
            Human supervision is admissible as a failsafe only if operators can
            reliably detect system failure and intervene within the required time
            window under real-world conditions of sustained automation use.
          </p>

          <div className="mt-8 bg-black text-white p-6 rounded-xl">
            <div className="text-xs uppercase opacity-70 mb-2">
              Core Doctrine
            </div>
            <p>
              A failsafe is <strong>admissible</strong> only if it can reliably
              act at the moment of failure. If intervention depends on degraded
              cognition, delayed awareness, or misaligned reaction time, the
              failsafe is structurally invalid.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Humans can reliably intervene when needed"
        >
          <p>
            The system assumes that human operators can maintain sufficient
            situational awareness to detect system limits and intervene
            effectively whenever required.
          </p>
        </SectionCard>

        {/* WHY IT PERSISTS */}
        <SectionCard
          eyebrow="Why This Assumption Persists"
          title="Responsibility is assigned, not verified"
        >
          <ul>
            <li>Human oversight is formally present</li>
            <li>Training and alerts create perceived readiness</li>
            <li>Successful interventions exist in controlled settings</li>
            <li>Failures are attributed to misuse rather than system design</li>
          </ul>

          <p>
            The system appears safe because responsibility is declared—not
            because intervention is consistently achievable.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Human supervising autonomous system output"
        >
          <ul>
            <li>Autonomous system performs primary task execution</li>
            <li>Human operator remains passive until alert or anomaly</li>
            <li>Intervention required within limited time window</li>
            <li>Extended exposure to automation precedes intervention</li>
          </ul>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Alignment of cognition, awareness, and reaction window"
        >
          <p>
            The governing variable is whether human cognitive state remains
            aligned with system state at the moment intervention is required.
          </p>

          <ul>
            <li>Awareness must be current</li>
            <li>Interpretation must be immediate</li>
            <li>Action must occur within system time constraints</li>
          </ul>

          <p>
            Failure in any of these dimensions invalidates the failsafe.
          </p>
        </SectionCard>

        {/* FAILURE MODES */}
        <SectionCard
          eyebrow="Failure Signatures"
          title="What breaks the claim"
        >
          <ul>
            <li>Loss of situational awareness due to automation reliance</li>
            <li>Delayed or incorrect interpretation of alerts</li>
            <li>Reaction time exceeding available intervention window</li>
            <li>Cognitive overload under stress conditions</li>
          </ul>

          <p>
            These are structural, not incidental, failure modes.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800">PASS</h2>
            <p className="mt-4 text-sm">
              Humans reliably detect, interpret, and act within required
              intervention windows across real-world operating conditions.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800">FAIL</h2>
            <p className="mt-4 text-sm">
              Any consistent misalignment between system behavior and human
              intervention capacity under real conditions.
            </p>
          </section>
        </section>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Operational Interpretation"
          title="What failure means"
        >
          <p>
            Failure indicates that human supervision is not a true failsafe, but
            a deferred liability point.
          </p>

          <p>
            Responsibility is transferred to the human at the exact moment their
            capacity is least reliable.
          </p>
        </SectionCard>

        {/* DISENTITLEMENT */}
        <SectionCard
          eyebrow="Disentitlement"
          title="What can no longer be claimed"
        >
          <p>
            No claim that human supervision reliably mitigates autonomous system
            failure at scale is admissible if intervention capacity cannot be
            guaranteed under real-world conditions.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border bg-zinc-950 text-white p-8">
          <p className="text-2xl font-semibold">
            A failsafe must act faster than failure.
          </p>
          <p className="mt-4 opacity-80">
            If intervention depends on degraded awareness or delayed cognition,
            it is not a failsafe—it is a narrative.
          </p>
        </section>

        <p className="text-sm text-zinc-500">
          Part of the{" "}
          <Link href="/edge-of-practice">
            Edge of Practice short-cycle experiment index
          </Link>
          .
        </p>

      </div>
    </main>
  );
}
