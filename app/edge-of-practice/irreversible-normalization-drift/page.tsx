import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Irreversible Normalization Drift in Human Feedback Systems — Authority Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A constraint artifact establishing that gradual normalization drift creates an irreversible loss of baseline perception, rendering unsafe states undetectable before failure.",
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
  tone?: "neutral" | "fail" | "irreversible";
}) {
  const toneClass =
    tone === "irreversible"
      ? "border-rose-600/30 bg-rose-600/20 text-rose-800"
      : tone === "fail"
        ? "border-rose-500/20 bg-rose-500/10 text-rose-700"
        : "border-zinc-300 bg-zinc-100 text-zinc-700";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${toneClass}`}>
      {children}
    </span>
  );
}

export default function IrreversibleNormalizationDriftPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border bg-gradient-to-br from-white to-zinc-100 p-10">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="irreversible">Irreversible Boundary</SignalPill>
            <SignalPill>Perceptual Collapse</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold">
            Irreversible Normalization Drift in Human Feedback Systems
          </h1>

          <p className="mt-6 text-lg max-w-3xl text-zinc-700">
            Human-in-the-loop systems are non-admissible as self-correcting once
            gradual drift erodes the operator’s reference baseline faster than
            corrective feedback can restore it.
          </p>

          <div className="mt-8 bg-black text-white p-6 rounded-xl">
            <div className="text-xs uppercase opacity-70 mb-2">
              Core Doctrine
            </div>
            <p>
              A system is <strong>admissible</strong> only if unsafe states remain
              detectable against a stable reference. If the reference itself
              drifts, detection collapses—and correction becomes impossible.
            </p>
          </div>
        </section>

        {/* DEFINITION */}
        <SectionCard
          eyebrow="Definition"
          title="Normalization drift as loss of reference authority"
        >
          <p>
            Normalization drift is a process where repeated exposure to degraded
            conditions shifts the perceived baseline until unsafe states are no
            longer recognized as deviations.
          </p>

          <p>
            This is not reduced vigilance—it is loss of the ability to perceive
            deviation at all.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Human feedback loop with slow degradation"
        >
          <ul>
            <li>System operates with continuous human observation</li>
            <li>Degradation occurs incrementally across routine operation</li>
            <li>No discrete failure or alert threshold is triggered</li>
            <li>Feedback is sparse, delayed, or outcome-based</li>
          </ul>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Baseline erosion rate vs corrective feedback rate"
        >
          <p>
            The governing variable is the relationship between:
          </p>

          <ul>
            <li>Baseline Erosion Rate (BER)</li>
            <li>Corrective Feedback Rate (CFR)</li>
          </ul>

          <p>
            If BER exceeds CFR, normalization drift becomes irreversible.
          </p>
        </SectionCard>

        {/* THRESHOLD */}
        <SectionCard
          eyebrow="Irreversibility Threshold"
          title="Normalization Drift Threshold (NDT)"
        >
          <p>
            The Normalization Drift Threshold is the point at which degraded
            states are fully internalized as normal, eliminating further
            detection by both operators and oversight systems.
          </p>

          <p>
            Beyond this threshold, internal recovery is not degraded—it is
            impossible.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="What defines perceptual collapse"
        >
          <ul>
            <li>No internal signal indicates degraded state</li>
            <li>Operators report system as normal despite objective drift</li>
            <li>Periodic audits reinforce new baseline instead of correcting it</li>
            <li>Failure is only recognized externally or after consequence</li>
          </ul>

          <p>
            This is not hidden failure—it is invisible failure.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="rounded-3xl border border-rose-600/30 bg-rose-600/10 p-8">
          <h2 className="text-3xl font-semibold text-rose-800">
            IRREVERSIBLE FAILURE
          </h2>
          <p className="mt-4 text-sm">
            Human feedback systems are not admissible as self-correcting once
            normalization drift exceeds the threshold where baseline perception
            is lost.
          </p>
        </section>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Operational Interpretation"
          title="What this means for governance"
        >
          <p>
            Systems relying on internal human detection cannot guarantee safety
            once drift dominates perception.
          </p>

          <p>
            Oversight that samples infrequently will reinforce drift rather than
            correct it.
          </p>
        </SectionCard>

        {/* WHAT PRACTICE MISSES */}
        <SectionCard
          eyebrow="What Practice Misclassifies"
          title="Failure is attributed to culture instead of constraint"
        >
          <ul>
            <li>Drift is labeled as poor culture or ethics</li>
            <li>Retraining is applied where perception has already collapsed</li>
            <li>Audits assume stable baseline that no longer exists</li>
          </ul>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border bg-zinc-950 text-white p-8">
          <p className="text-2xl font-semibold">
            You cannot correct what you can no longer see.
          </p>
          <p className="mt-4 opacity-80">
            When the baseline drifts, error disappears—not because it is gone,
            but because perception has lost its reference.
          </p>
        </section>

      </div>
    </main>
  );
}
