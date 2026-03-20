// app/damage-activated-materials/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Damage-Activated Protective Materials | Moral Clarity AI",
  description:
    "A regime-bounded evaluation of materials that increase protection after damage, with explicit physical, operational, and ethical limits.",
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

function Mechanism({
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
          Edge of Knowledge — Applied Evaluation
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          Damage-Activated Protective Materials
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          When protection increases after damage—and when it doesn’t.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Regime Evaluation" />
          <Signal label="Claim" value="Post-Damage Protection Increase" />
          <Signal label="Status" value="Conditional Validity" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          Physics-bound · Regime-limited · No universal claims
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Claim">
        <p>
          Certain materials can exhibit increased protective capacity after
          damage through intrinsic physical mechanisms.
        </p>
        <p>
          This behavior is not universal and depends on tightly constrained
          regimes of stress, scale, and environment.
        </p>
      </Section>

      {/* MECHANISMS */}
      <section>
        <h2 className="text-2xl font-semibold text-white">
          Mechanism Classes
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Mechanism
            title="Stress-Gated Reconfiguration"
            desc="Local densification or phase locking following crack initiation."
          />

          <Mechanism
            title="Impact Dissipation"
            desc="Shear thickening, crystallization, or fiber pullout increasing energy absorption."
          />

          <Mechanism
            title="Thermal Activation"
            desc="Expansion, charring, or vitrification improving insulation after heat exposure."
          />

          <Mechanism
            title="Topology Localization"
            desc="Architectures that redirect damage away from critical regions."
          />

          <Mechanism
            title="Barrier Formation"
            desc="Irreversible crosslinking or sealing under stress or heat."
          />
        </div>

        <p className="mt-6 text-sm text-slate-400">
          True activation requires measurable improvement after damage—not
          delayed failure.
        </p>
      </section>

      {/* REGIME */}
      <Section title="Regime Admissibility">
        <p className="font-semibold text-white">Admissible</p>
        <ul className="list-disc pl-6">
          <li>Single or moderate impacts</li>
          <li>Localized thermal events</li>
          <li>Controlled environments</li>
          <li>Micro–meso scale structures</li>
        </ul>

        <p className="font-semibold text-white mt-4">Marginal</p>
        <ul className="list-disc pl-6">
          <li>Repeated stress cycles</li>
          <li>Partial or uneven activation</li>
          <li>Manufacturing variability</li>
        </ul>

        <p className="font-semibold text-white mt-4">Rejected</p>
        <ul className="list-disc pl-6">
          <li>Catastrophic high-rate failure</li>
          <li>Long-term abrasion or fouling</li>
          <li>Extreme environmental exposure</li>
        </ul>
      </Section>

      {/* CONFUNDS */}
      <Section title="Common Confounds">
        <ul className="list-disc pl-6 space-y-2">
          <li>Increased thickness mistaken for activation</li>
          <li>Initial geometry misinterpreted as response</li>
          <li>Single-use sacrificial behavior</li>
          <li>Lab-only effects that fail in real conditions</li>
        </ul>
      </Section>

      {/* FALSIFICATION */}
      <Section title="Falsification Gate">
        <ul className="list-disc pl-6 space-y-2">
          <li>Pre vs post damage comparison required</li>
          <li>Statistically significant improvement required</li>
          <li>Repeatability under real conditions required</li>
        </ul>

        <p className="mt-4 text-red-300">
          NO-GO if protection does not increase after damage or collapses under
          environmental exposure.
        </p>
      </Section>

      {/* ETHICS */}
      <Section title="Ethical Constraint">
        <p>
          Overstating performance introduces risk through false confidence,
          misuse, or substitution for maintenance.
        </p>
        <p>
          Deployment requires explicit communication of regime limits.
        </p>
      </Section>

      {/* COMPARISON */}
      <Section title="Relative Position">
        <ul className="list-disc pl-6 space-y-2">
          <li>Passive systems degrade but remain predictable</li>
          <li>Redundancy relies on backup, not activation</li>
          <li>Active systems outperform but require infrastructure</li>
        </ul>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">
          Final Judgment
        </h2>
        <p className="mt-4 text-red-200">
          CONDITIONAL GO. Damage-activated protection exists within narrow
          regimes. It is fragile, localized, and unsuitable as a primary safety
          mechanism.
        </p>
      </section>

      {/* FOOTER */}
      <div className="text-center text-sm text-slate-500">
        Regime-bounded · Evaluated · Non-universal · Versioned
      </div>
    </main>
  );
}
