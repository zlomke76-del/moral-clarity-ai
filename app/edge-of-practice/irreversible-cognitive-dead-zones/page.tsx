import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Irreversible Cognitive Dead Zones in Human–Automation Handoffs — Authority Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A constraint artifact establishing that certain human–automation handoff conditions create irreversible cognitive dead zones where safe human intervention is physically impossible.",
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

export default function IrreversibleCognitiveDeadZonesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border bg-gradient-to-br from-white to-zinc-100 p-10">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Irreversible Boundary</SignalPill>
            <SignalPill>Authority Collapse</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold">
            Irreversible Cognitive Dead Zones in Human–Automation Handoffs
          </h1>

          <p className="mt-6 text-lg max-w-3xl text-zinc-700">
            Human supervision is non-admissible as a failsafe once system state,
            cognitive load, and time-to-intervention exceed biological recovery
            limits. Beyond this boundary, safe intervention becomes physically
            impossible.
          </p>

          <div className="mt-8 bg-black text-white p-6 rounded-xl">
            <div className="text-xs uppercase opacity-70 mb-2">
              Core Doctrine
            </div>
            <p>
              A control handoff is <strong>admissible</strong> only if the receiving
              agent can regain situational awareness and act within the available
              time window. If this cannot occur, authority is undefined and the
              system has already failed—regardless of procedure or intent.
            </p>
          </div>
        </section>

        {/* DEFINITION */}
        <SectionCard
          eyebrow="Definition"
          title="Irreversible cognitive dead zone"
        >
          <p>
            A cognitive dead zone is a region of system state where the time
            required for human comprehension and action exceeds the time
            available to intervene.
          </p>

          <p>
            Once entered, recovery is not degraded—it is impossible.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Automation-to-human handoff under time pressure"
        >
          <ul>
            <li>Automation performs primary control</li>
            <li>Human remains disengaged during steady-state operation</li>
            <li>System transitions abruptly to human control</li>
            <li>Time-to-failure is shorter than cognitive recovery time</li>
          </ul>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Cognitive recovery time vs intervention window"
        >
          <p>
            The governing variable is the relationship between:
          </p>

          <ul>
            <li>Time required for human situational awareness reconstruction</li>
            <li>Time available before irreversible system failure</li>
          </ul>

          <p>
            If recovery time exceeds available time, intervention cannot occur.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What defines the dead zone"
        >
          <ul>
            <li>Operator receives alert but cannot reconstruct system state in time</li>
            <li>Correct action is known but cannot be executed before failure</li>
            <li>Multiple plausible interpretations exceed available decision window</li>
            <li>Stress and surprise degrade response below actionable threshold</li>
          </ul>

          <p>
            These are not errors—they are boundary violations.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
          <h2 className="text-3xl font-semibold text-rose-800">FAIL</h2>
          <p className="mt-4 text-sm">
            Human supervision is not admissible as a failsafe in systems where
            cognitive recovery time exceeds intervention window under realistic
            operating conditions.
          </p>
        </section>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Operational Interpretation"
          title="What this means for system design"
        >
          <p>
            Systems that rely on human takeover beyond this boundary are not
            supervised—they are operating without a valid failsafe.
          </p>

          <p>
            Responsibility assigned at this point is structurally incoherent.
          </p>
        </SectionCard>

        {/* WHAT PRACTICE MISSES */}
        <SectionCard
          eyebrow="What Practice Misclassifies"
          title="Failure is attributed incorrectly"
        >
          <ul>
            <li>Failure labeled as human error instead of boundary violation</li>
            <li>Training treated as corrective despite biological limits</li>
            <li>Monitoring assumed to restore control without restoring cognition</li>
          </ul>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border bg-zinc-950 text-white p-8">
          <p className="text-2xl font-semibold">
            Control requires time to understand.
          </p>
          <p className="mt-4 opacity-80">
            If understanding cannot occur before consequence, control never
            existed.
          </p>
        </section>

      </div>
    </main>
  );
}
