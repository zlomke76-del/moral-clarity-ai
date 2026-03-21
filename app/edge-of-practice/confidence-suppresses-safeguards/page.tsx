import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Confidence Suppression Boundary — Governance Admissibility Constraint | Edge of Practice — Moral Clarity AI",
  description:
    "A constraint artifact defining when confidence becomes non-admissible due to suppression of dissent, verification, and refusal.",
  robots: { index: true, follow: true },
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
    <section className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        {eyebrow}
      </div>
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-7 text-zinc-700 dark:text-zinc-300">
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
      ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
      : tone === "pass"
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        : "border-zinc-300/70 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${toneClass}`}
    >
      {children}
    </span>
  );
}

export default function EdgeConfidenceFailurePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-10">
              <div className="mb-4 flex flex-wrap gap-2">
                <SignalPill>Edge of Practice</SignalPill>
                <SignalPill tone="fail">Governance Boundary</SignalPill>
                <SignalPill>RCS Constraint</SignalPill>
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Confidence Suppression Boundary
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                Confidence is admissible only if dissent, verification, and
                refusal remain structurally independent. When confidence suppresses
                these functions, governance becomes non-admissible.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50 dark:border-white/10 dark:bg-black">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Boundary Doctrine
                </div>
                <p className="text-base leading-7 md:text-lg">
                  Confidence is <strong>non-admissible</strong> when it reduces
                  the probability of dissent, verification, or refusal.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 p-10 text-zinc-50 space-y-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                Boundary Summary
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Valid only if
                </div>
                <p className="text-sm">
                  Dissent, verification, and refusal operate independently of
                  confidence signals.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
                <div className="text-xs uppercase text-rose-300 mb-1">
                  Invalid when
                </div>
                <p className="text-sm text-rose-100">
                  Confidence reduces challenge, skips validation, or suppresses
                  refusal.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase text-zinc-400 mb-1">
                  Governing scale
                </div>
                <p className="text-sm">
                  Structural independence of oversight functions—not perceived
                  certainty.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MECHANISM */}
        <SectionCard
          eyebrow="Mechanism"
          title="Confidence reshapes system behavior"
        >
          <p>
            Confidence does not merely express belief. It alters downstream
            incentives and suppresses corrective functions.
          </p>

          <ul>
            <li>Dissenters self-censor</li>
            <li>Verification is skipped</li>
            <li>Refusal becomes illegitimate</li>
          </ul>

          <p>
            This occurs even when confidence is justified—making it structurally
            dangerous.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Independence of constraint functions"
        >
          <ul>
            <li>Ability to dissent without penalty</li>
            <li>Mandatory verification regardless of confidence</li>
            <li>Legitimacy of refusal under pressure</li>
          </ul>

          <p>
            If any of these degrade as confidence increases, the system crosses
            the admissibility boundary.
          </p>
        </SectionCard>

        {/* FAILURE */}
        <SectionCard
          eyebrow="Failure Signature"
          title="Suppression of safeguards"
        >
          <ul>
            <li>Dissent decreases as confidence increases</li>
            <li>Validation steps are skipped</li>
            <li>Challenges are interpreted as resistance</li>
          </ul>

          <p>
            <strong>
              Confidence-induced silence is a failure signal.
            </strong>
          </p>
        </SectionCard>

        {/* BELOW EDGE */}
        <SectionCard
          eyebrow="Below the Edge"
          title="Why this failure persists"
        >
          <ul>
            <li>Confidence is socially rewarded</li>
            <li>Speed is prioritized over validation</li>
            <li>Oversight is treated as optional</li>
          </ul>

          <p>
            Systems drift toward groupthink while appearing decisive and
            controlled.
          </p>
        </SectionCard>

        {/* STRUCTURAL FIX */}
        <SectionCard
          eyebrow="Required Structure"
          title="Independence must be enforced"
        >
          <ul>
            <li>Separate authority for verification and refusal</li>
            <li>Mandatory validation processes</li>
            <li>Protected dissent channels</li>
          </ul>

          <p>
            These functions must be structural—not cultural or optional.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-900 dark:text-emerald-100">
              PASS
            </h2>
            <p className="mt-4 text-sm">
              Oversight functions remain active regardless of confidence level.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-900 dark:text-rose-100">
              FAIL
            </h2>
            <p className="mt-4 text-sm">
              Confidence suppresses dissent, verification, or refusal.
            </p>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-zinc-50">
          <p className="text-2xl font-semibold">
            Confidence must be overridable.
          </p>
          <p className="mt-4 text-zinc-300">
            If confidence weakens oversight, failure is not a possibility—it is
            a structural certainty.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Edge of Practice · Governance Failure Pattern. Fixed at publication.
        </p>
      </div>
    </main>
  );
}
