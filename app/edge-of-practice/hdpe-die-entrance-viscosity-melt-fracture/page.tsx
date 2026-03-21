import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "HDPE Die-Entrance Viscosity Stability — Short-Cycle Constraint Boundary | Edge of Practice — Moral Clarity AI",
  description:
    "A short-cycle falsification protocol testing whether die-entrance viscosity in HDPE pipe extrusion remains above the melt-fracture threshold under fixed process conditions.",
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

export default function HDPEDieEntranceViscosityPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border bg-gradient-to-br from-white to-zinc-100 p-10">
          <div className="mb-4 flex flex-wrap gap-2">
            <SignalPill>Edge of Practice</SignalPill>
            <SignalPill tone="fail">Short-Cycle Falsification</SignalPill>
            <SignalPill>Process Rheology Boundary</SignalPill>
          </div>

          <h1 className="text-4xl font-semibold">
            HDPE Die-Entrance Viscosity Stability
          </h1>

          <p className="mt-6 text-lg max-w-3xl text-zinc-700">
            Fixed extrusion conditions are admissible only if die-entrance
            viscosity remains above the melt-fracture threshold throughout the
            production window.
          </p>

          <div className="mt-8 bg-black text-white p-6 rounded-xl">
            <div className="text-xs uppercase opacity-70 mb-2">
              Core Doctrine
            </div>
            <p>
              A process is <strong>admissible</strong> only if its governing
              rheological state remains above the instability threshold under
              continuous operation. If viscosity drops below threshold, the
              process is operating in a non-controlled regime.
            </p>
          </div>
        </section>

        {/* SYSTEM */}
        <SectionCard
          eyebrow="System Definition"
          title="Polymer and process boundary"
        >
          <ul>
            <li>Polymer: HDPE (bimodal pipe grade)</li>
            <li>Process: single-screw pipe extrusion</li>
            <li>Fixed conditions: temperature, screw speed, throughput</li>
          </ul>
        </SectionCard>

        {/* ASSUMPTION */}
        <SectionCard
          eyebrow="Tested Assumption"
          title="Viscosity remains above fracture threshold"
        >
          <p>
            Die-entrance viscosity remains sufficiently high to prevent wall
            shear stress from entering the melt-fracture regime under fixed
            production conditions.
          </p>
        </SectionCard>

        {/* WHY IT PERSISTS */}
        <SectionCard
          eyebrow="Why This Assumption Persists"
          title="Throughput over observability"
        >
          <ul>
            <li>Continuous operation discourages intervention</li>
            <li>No inline viscosity measurement</li>
            <li>Surface defects are tolerated below spec limits</li>
            <li>Visual inspection replaces rheological verification</li>
          </ul>
        </SectionCard>

        {/* EXPERIMENT */}
        <SectionCard
          eyebrow="Falsification Protocol"
          title="Minimal plant-ready test"
        >
          <ul>
            <li>Extrude pipe at fixed conditions</li>
            <li>Sample melt at 30, 60, 90 minutes</li>
            <li>Measure zero-shear viscosity (η₀)</li>
          </ul>

          <p>
            No process changes. No intervention. Only measurement.
          </p>
        </SectionCard>

        {/* GOVERNING VARIABLE */}
        <SectionCard
          eyebrow="Governing Variable"
          title="Die-entrance viscosity (η₀)"
        >
          <p>
            The governing variable is zero-shear viscosity at the die entrance.
          </p>

          <p>
            This variable determines whether the system remains within or exits
            the melt-fracture stability regime.
          </p>
        </SectionCard>

        {/* VERDICT */}
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8">
            <h2 className="text-3xl font-semibold text-emerald-800">PASS</h2>
            <p className="mt-4 text-sm">
              All η₀ values ≥ 1500 Pa·s.
            </p>
          </section>

          <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8">
            <h2 className="text-3xl font-semibold text-rose-800">FAIL</h2>
            <p className="mt-4 text-sm">
              Any η₀ ≤ 1200 Pa·s.
            </p>
          </section>
        </section>

        {/* INTERPRETATION */}
        <SectionCard
          eyebrow="Operational Interpretation"
          title="What failure means"
        >
          <p>
            Failure indicates that the process has entered a rheological regime
            capable of producing melt fracture under unchanged operating
            conditions.
          </p>

          <p>
            The system is no longer stable—it is tolerated.
          </p>
        </SectionCard>

        {/* INVARIANT */}
        <section className="rounded-3xl border bg-zinc-950 text-white p-8">
          <p className="text-2xl font-semibold">
            A stable surface requires a stable rheology.
          </p>
          <p className="mt-4 opacity-80">
            If viscosity drifts below the fracture threshold, surface quality is
            no longer controlled—it is incidental.
          </p>
        </section>

      </div>
    </main>
  );
}
