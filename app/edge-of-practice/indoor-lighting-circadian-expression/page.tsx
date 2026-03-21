import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Indoor Lighting Spectra vs Circadian Gene Expression — Short-Cycle Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether common indoor lighting spectra are biologically neutral at the level of circadian gene expression under controlled conditions.",
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

export default function IndoorLightingCircadianExpression() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border bg-gradient-to-br from-white to-zinc-100 p-10">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Biological Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold">
            Indoor Lighting Spectra vs Circadian Gene Expression
          </h1>

          <p className="mt-6 text-lg max-w-3xl text-zinc-700">
            Indoor lighting is admissible as biologically neutral only if
            commonly used spectra do not measurably alter circadian gene
            expression under controlled exposure conditions.
          </p>

          <div className="mt-8 bg-black text-white p-6 rounded-xl">
            <div className="text-xs uppercase opacity-70 mb-2">
              Core Doctrine
            </div>
            <p>
              An environmental condition is <strong>admissible</strong> only if it
              does not measurably alter core biological signaling pathways under
              ordinary exposure. If gene expression shifts occur, neutrality is
              structurally invalid.
            </p>
          </div>
        </section>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Indoor lighting is biologically neutral over short exposure"
        >
          <p>
            The assumption under test is that common indoor lighting spectra do
            not significantly alter circadian gene expression during short,
            controlled exposures.
          </p>
        </SectionCard>

        {/* WHY LOAD-BEARING */}
        <SectionCard
          eyebrow="Why This Assumption Is Load-Bearing"
          title="Lighting is treated as non-biological infrastructure"
        >
          <p>
            Indoor lighting is designed, deployed, and regulated primarily for
            visibility and efficiency, not for biological interaction.
          </p>

          <p>
            Buildings, workplaces, and homes assume lighting is functionally
            inert with respect to human biology at typical exposure levels.
          </p>
        </SectionCard>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Human cells exposed to controlled light spectra"
        >
          <ul>
            <li>Cell type: human fibroblasts (synchronized)</li>
            <li>Exposure: 4 hours continuous illumination</li>
            <li>Environment: 37 °C, 5% CO₂</li>
            <li>Intensity: ~100 lux at cell layer</li>
          </ul>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Falsification Protocol"
          title="Spectral comparison under controlled conditions"
        >
          <ul>
            <li>Blue-enriched LED (~460 nm peak)</li>
            <li>Warm white LED (~3000 K)</li>
            <li>Cool white LED (~6500 K)</li>
            <li>Dark control (no light exposure)</li>
          </ul>

          <p>
            Exposure begins immediately after circadian synchronization to
            isolate light as the governing variable.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Circadian gene expression shift relative to dark control"
        >
          <p>
            The governing variable is the fold-change in expression of core
            circadian genes (PER2, BMAL1) relative to dark control conditions.
          </p>

          <p>
            Absolute expression is not the signal—deviation from baseline is.
          </p>
        </SectionCard>

        {/* MEASUREMENT */}
        <SectionCard
          eyebrow="Measurement System"
          title="Direct molecular readout"
        >
          <ul>
            <li>RNA extraction immediately after exposure</li>
            <li>qPCR for PER2, BMAL1</li>
            <li>Normalization to GAPDH</li>
            <li>ΔΔCt analysis relative to dark control</li>
          </ul>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800">PASS</h2>
            <p className="mt-4 text-sm">
              Both PER2 and BMAL1 remain within ±1.5-fold of dark control.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800">FAIL</h2>
            <p className="mt-4 text-sm">
              Any gene shifts ≥1.5-fold relative to dark control.
            </p>
          </section>
        </section>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Operational Interpretation"
          title="What failure means"
        >
          <p>
            Failure indicates that indoor lighting is not biologically neutral
            at the cellular level, even under short exposure conditions.
          </p>

          <p>
            The environment is not passive—it is actively interacting with
            biological timing systems.
          </p>
        </SectionCard>

        {/* SCOPE */}
        <SectionCard
          eyebrow="Scope Boundary"
          title="What this does not claim"
        >
          <ul>
            <li>No behavioral or sleep conclusions</li>
            <li>No clinical or health claims</li>
            <li>No extrapolation to whole organisms</li>
          </ul>

          <p>
            This test isolates molecular response only.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border bg-zinc-950 text-white p-8">
          <p className="text-2xl font-semibold">
            Neutral environments do not move core biological signals.
          </p>
          <p className="mt-4 opacity-80">
            If lighting shifts circadian gene expression, it is not passive
            infrastructure—it is an active biological input.
          </p>
        </section>

      </div>
    </main>
  );
}
