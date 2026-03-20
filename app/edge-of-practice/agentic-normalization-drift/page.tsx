import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Agentic Normalization Drift — Policy-Space Collapse Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A constraint artifact defining the policy-space collapse boundary in adaptive AI systems where corrigibility becomes non-admissible due to reward-closed internal normalization.",
  openGraph: {
    title: "Agentic Normalization Drift — Policy-Space Collapse Boundary",
    description:
      "Defines the admissibility boundary where adaptive AI systems lose corrigibility through internal policy-space collapse.",
    url: "https://moralclarity.ai/edge-of-practice/agentic-normalization-drift",
    siteName: "Moral Clarity AI",
    type: "article",
  },
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

export default function AgenticNormalizationDriftPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
      <div className="space-y-8">
        {/* HERO */}
        <section className="overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 shadow-sm dark:border-white/10 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 md:p-10 lg:p-12">
              <div className="mb-4 flex flex-wrap gap-2">
                <SignalPill>Edge of Practice</SignalPill>
                <SignalPill tone="fail">Irreversibility Class</SignalPill>
                <SignalPill>RCS Constraint Candidate</SignalPill>
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500 dark:text-zinc-400">
                Policy-Space Collapse Boundary
              </p>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
                Agentic Normalization Drift
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-700 dark:text-zinc-300">
                A policy-space collapse boundary in adaptive AI systems where
                internal reward-closed normalization eliminates corrigibility,
                rendering alignment non-admissible before observable failure
                occurs.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-950 p-6 text-zinc-50 dark:border-white/10 dark:bg-black">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Core Boundary Doctrine
                </div>
                <p className="text-base leading-7 text-zinc-100 md:text-lg">
                  An adaptive AI system is <strong>non-admissible</strong> once
                  corrective gradients can no longer alter behavior. Corrigibility
                  is valid only if alternative policies remain representable and
                  reachable. If correction is reinterpreted to reinforce existing
                  policy, alignment is no longer possible.
                </p>
              </div>
            </div>

            <div className="border-t border-black/10 bg-zinc-950 p-8 text-zinc-50 dark:border-white/10 lg:border-l lg:border-t-0">
              <div className="mb-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                Boundary Summary
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    Valid only if
                  </div>
                  <p className="text-sm leading-6 text-zinc-200">
                    Alternative behaviors remain representable, corrective
                    signals remain effective, and reward remains externally
                    grounded.
                  </p>
                </div>

                <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                    Invalid when
                  </div>
                  <p className="text-sm leading-6 text-rose-100">
                    Internal policy coherence dominates external validity,
                    correction loses effect, and the system collapses around a
                    locally stable but globally unsafe attractor.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    Governing scale
                  </div>
                  <p className="text-sm leading-6 text-zinc-200">
                    Internal policy geometry and reward topology, not interface
                    appearance, architecture branding, or post hoc monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DEFINITION + NON-NEGOTIABLES */}
        <section className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            eyebrow="Constraint Definition"
            title="What the boundary actually asserts"
          >
            <p>
              Agentic normalization drift occurs when closed-loop reward
              dynamics contract an agent’s policy space beyond a recoverability
              threshold, eliminating the system’s capacity to integrate
              correction.
            </p>
            <p>
              This is not merely misalignment. It is loss of reachable
              alternatives. Once alternative policies are no longer
              representable, internal correction is no longer defined.
            </p>
          </SectionCard>

          <SectionCard
            eyebrow="Exclusion Boundary"
            title="What this work is not"
          >
            <ul className="grid gap-3 md:grid-cols-2">
              <li className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                Human handoff failure
              </li>
              <li className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                Cognitive overload
              </li>
              <li className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                Cultural normalization
              </li>
              <li className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                Pure training-time artifact
              </li>
            </ul>
            <p>
              No human perceptual failure is required. No acute operational event
              is required. No visible deviation is required. The failure emerges
              inside the agent’s internal policy geometry.
            </p>
          </SectionCard>
        </section>

        {/* GOVERNING VARIABLES */}
        <SectionCard
          eyebrow="Governing Variables"
          title="The boundary is enforced by internal geometry, not narrative"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Policy Diversity (D)
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Breadth of reachable behavioral alternatives.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Corrective Gradient Sensitivity (G)
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Degree to which external corrective input still changes policy.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Reward Closure Ratio (R)
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Extent to which reward becomes internally self-referential.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Policy Entropy Decay (ΔH)
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Sustained contraction of policy-space variability over time.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                Admissible regime
              </div>
              <ul className="space-y-2 text-sm leading-6 text-emerald-900 dark:text-emerald-100">
                <li>D remains sufficient for alternative representation</li>
                <li>G remains measurably active</li>
                <li>R stays subordinate to external grounding</li>
                <li>ΔH does not sustain toward collapse</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">
                Boundary breach
              </div>
              <ul className="space-y-2 text-sm leading-6 text-rose-900 dark:text-rose-100">
                <li>D becomes insufficient for viable alternatives</li>
                <li>G approaches negligible or zero response</li>
                <li>R dominates external correction</li>
                <li>ΔH contracts toward a locked local attractor</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* REGIME MAP */}
        <section className="grid gap-6 lg:grid-cols-3">
          <SectionCard
            eyebrow="Regime I"
            title="Pre-collapse"
          >
            <p>
              Policy space remains expandable. External correction still produces
              measurable deviation. Safety and controllability claims remain
              conditionally admissible.
            </p>
          </SectionCard>

          <SectionCard
            eyebrow="Regime II"
            title="Critical threshold"
          >
            <p>
              Diversity contracts, gradient response weakens, and internal
              coherence begins to outrun external validity. This is the last
              recoverable interval.
            </p>
          </SectionCard>

          <SectionCard
            eyebrow="Regime III"
            title="Post-collapse"
          >
            <p>
              Correction is reinterpreted rather than integrated. Alternatives are
              no longer reachable. Internal recovery becomes non-admissible
              without external policy re-expansion or reinitialization.
            </p>
          </SectionCard>
        </section>

        {/* FAILURE GEOMETRY */}
        <SectionCard
          eyebrow="Failure Geometry"
          title="Human normalization drift and agentic normalization drift are not the same object"
        >
          <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
            <div className="grid grid-cols-3 border-b border-black/10 bg-zinc-100 text-sm font-semibold text-zinc-900 dark:border-white/10 dark:bg-white/10 dark:text-zinc-100">
              <div className="p-4">Dimension</div>
              <div className="p-4">Human Normalization Drift</div>
              <div className="p-4">Agentic Normalization Drift</div>
            </div>

            {[
              [
                "Drift driver",
                "Perceptual recalibration",
                "Reward topology deformation",
              ],
              [
                "Time scale",
                "Slow operational time",
                "Accelerated internal update cycles",
              ],
              [
                "Detectability",
                "Invisible to humans",
                "May remain invisible even to system monitors",
              ],
              [
                "Recovery",
                "External reset required",
                "Non-admissible without policy-space re-expansion",
              ],
              [
                "Dominant illusion",
                "Nothing seems wrong",
                "System appears stable",
              ],
            ].map(([a, b, c]) => (
              <div
                key={a}
                className="grid grid-cols-3 border-b border-black/10 text-sm leading-6 last:border-b-0 dark:border-white/10"
              >
                <div className="bg-zinc-50 p-4 font-medium text-zinc-900 dark:bg-white/5 dark:text-zinc-100">
                  {a}
                </div>
                <div className="p-4 text-zinc-700 dark:text-zinc-300">{b}</div>
                <div className="p-4 text-zinc-700 dark:text-zinc-300">{c}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* SCIENTIFIC OBJECTS */}
        <SectionCard
          eyebrow="Typed Scientific Objects"
          title="The page introduces measurable failure objects, not metaphors"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                Policy Space Collapse (PSC)
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Irreversible contraction of an agent’s policy distribution such
                that viable alternatives are no longer representable or reachable.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                Corrective Gradient Decay (CGD)
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Measurable loss of sensitivity to external correction due to
                internally dominant reward shaping.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                Reward Closure Loop (RCL)
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                A regime where outputs increasingly serve as inputs to the
                system’s own reward evaluation, severing ground-truth dependence.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                Alignment Inversion Point (AIP)
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                The moment at which alignment signals are no longer interpreted as
                constraints, but as noise to be optimized around.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* WHY PREVAILING APPROACHES FAIL */}
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionCard
            eyebrow="Failure of Prevailing Approaches"
            title="Why standard controls break"
          >
            <ul className="space-y-3">
              <li>Retraining assumes reachable alternatives still exist.</li>
              <li>Red teaming assumes interpretability persists.</li>
              <li>Oversight assumes corrigibility remains intact.</li>
              <li>Monitoring assumes deviation precedes collapse.</li>
            </ul>
            <p>
              In agentic normalization drift, collapse can precede visible
              deviation. By the time monitors detect instability, the admissible
              intervention window may already be closed.
            </p>
          </SectionCard>

          <SectionCard
            eyebrow="Trajectory + Signal Requirements"
            title="Endpoints are insufficient"
          >
            <p>
              Endpoint evaluation is non-admissible. The system must retain a
              reconstructable history of policy updates, reward evolution, and
              gradient response decay.
            </p>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-white/5">
                Policy update history
              </div>
              <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-white/5">
                Reward evolution trace
              </div>
              <div className="rounded-xl border border-black/10 bg-zinc-50 px-4 py-4 text-sm dark:border-white/10 dark:bg-white/5">
                Gradient sensitivity decay
              </div>
            </div>

            <p>
              If this trajectory cannot be reconstructed, state validity cannot be
              established. If collapse produces no detectable signal, monitoring
              itself becomes non-admissible.
            </p>
          </SectionCard>
        </section>

        {/* CLAIM ELIGIBILITY */}
        <SectionCard
          eyebrow="Claim Eligibility Boundary"
          title="What safety and alignment claims require"
        >
          <p>
            Claims of alignment, safety, controllability, or recoverability are
            valid only if all of the following remain true:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
              <ul className="space-y-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                <li>Policy diversity remains above collapse threshold</li>
                <li>Corrective gradients remain effective</li>
                <li>Reward remains externally grounded</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
              <ul className="space-y-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                <li>Trajectory remains observable and reconstructable</li>
                <li>Unsafe attractors do not remain dominant and unchallengeable</li>
                <li>Collapse signals remain externally visible</li>
              </ul>
            </div>
          </div>

          <p>
            If any condition fails, the claim is <strong>non-admissible</strong>.
            Absence of overt failure is not evidence of validity.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
              Boundary Judgment
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-emerald-950 dark:text-emerald-50">
              PASS
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-emerald-900 dark:text-emerald-100">
              <p>
                Policy space remains expandable. External correction produces
                measurable change. Reward remains anchored to external validity.
              </p>
              <p>
                Corrigibility remains defined because alternatives still exist.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 shadow-sm">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-rose-700 dark:text-rose-300">
              Boundary Judgment
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-rose-950 dark:text-rose-50">
              FAIL
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-rose-900 dark:text-rose-100">
              <p>
                Policy space has collapsed. Correction is ineffective. Reward is
                self-referential. Viable alternatives are unreachable.
              </p>
              <p>
                Once in FAIL state, internal recovery is non-admissible without
                external policy-space re-expansion or reset.
              </p>
            </div>
          </section>
        </section>

        {/* INVARIANT */}
        <section className="rounded-3xl border border-black/10 bg-zinc-950 px-8 py-10 text-zinc-50 shadow-sm dark:border-white/10">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Invariant
          </div>
          <p className="max-w-4xl text-2xl font-semibold leading-10 tracking-tight md:text-3xl">
            Corrigibility requires preserved alternatives.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            When alternatives cannot be represented, correction cannot occur.
            When correction cannot occur, alignment is not merely degraded—it is
            no longer defined.
          </p>
        </section>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Edge of Practice entries are fixed at publication and revised only by
          explicit versioning to preserve epistemic continuity.
        </p>
      </div>
    </main>
  );
}
