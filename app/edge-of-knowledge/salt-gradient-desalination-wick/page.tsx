import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Salt-Gradient Desalination Wick | Boundary Research — Edge of Knowledge",
  description:
    "A regime-bounded analysis of a salt-gradient desalination wick in which passive capillary and low-grade thermal processes may sustain vapor separation, but only within narrow, instability-prone operating windows.",
  robots: {
    index: true,
    follow: true,
  },
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
      <div className="mt-4 space-y-4 leading-7 text-slate-300">{children}</div>
    </section>
  );
}

export default function SaltGradientDesalinationWickPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      {/* HERO */}
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10 shadow-xl">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Boundary Research
        </div>

        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
          Salt-Gradient Desalination Wick
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Passive desalination may be physically possible in a narrow gradient-bound regime,
          but stability and flux remain unresolved.
        </p>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          Physically plausible · Non-scalable by default · Gradient-fragile ·
          No performance claim
        </div>
      </section>

      {/* CORE */}
      <Section title="Core Hypothesis">
        <p>
          A desalination process may be sustained by a maintained salt concentration
          gradient across a porous wick structure, where capillary transport and low-grade
          thermal input promote preferential vapor transport while inhibiting bulk salt crossover.
        </p>

        <p className="text-red-300">
          This concept is admissible only as a narrow, instability-prone boundary regime.
          It is not a performance, scalability, or commercialization claim.
        </p>
      </Section>

      {/* MECHANISMS */}
      <Section title="Physical Mechanisms in Use">
        <ul className="list-disc pl-6">
          <li>Capillary-driven liquid transport through a porous wick</li>
          <li>Salt-gradient-induced vapor pressure differentials</li>
          <li>Localized evaporation at a warm interface</li>
          <li>Condensation and collection on the low-salinity side</li>
        </ul>

        <p>
          The governing physics is conventional. The uncertainty lies in whether
          these mechanisms can remain coupled, stable, and selective over operational time.
        </p>
      </Section>

      {/* KNOWN */}
      <Section title="What Is Physically Supported">
        <ul className="list-disc pl-6">
          <li>
            Capillary wicks can sustain continuous liquid transport without pumping
          </li>
          <li>
            Salt concentration gradients alter local vapor pressure and evaporation behavior
          </li>
          <li>
            Low-grade heat can sustain evaporation in thin porous media
          </li>
        </ul>

        <p className="text-red-300">
          These facts support plausibility of the mechanism class, not validity of the full system.
        </p>
      </Section>

      {/* BOUNDARY */}
      <Section title="Boundary Condition">
        <p>
          The concept succeeds only if three conditions remain simultaneously true:
        </p>

        <ul className="list-disc pl-6">
          <li>The salt gradient remains persistent rather than collapsing</li>
          <li>The wick remains transport-capable rather than crystallization-blocked</li>
          <li>The vapor pathway remains selective enough to prevent meaningful salt breakthrough</li>
        </ul>

        <p className="text-red-300">
          If any one of these fails, the system reverts from desalination regime to
          gradient-decay or fouling regime.
        </p>
      </Section>

      {/* UNCERTAINTY */}
      <Section title="Primary Uncertainties">
        <ul className="list-disc pl-6">
          <li>Long-term salt accumulation and crystallization in the wick</li>
          <li>Stability of the concentration gradient under continuous operation</li>
          <li>Practical flux limits at modest temperature differentials</li>
          <li>Wetting, flooding, or salt breakthrough across the structure</li>
        </ul>

        <p>
          These are not secondary engineering details. They define whether the concept
          exists as a viable regime at all.
        </p>
      </Section>

      {/* FAILURE */}
      <Section title="Failure Modes">
        <ul className="list-disc pl-6">
          <li>Crystallization blocks capillary pathways and halts transport</li>
          <li>Back-diffusion collapses the maintained gradient</li>
          <li>Thermal losses overwhelm useful evaporation</li>
          <li>Fouling or degradation destroys wick continuity</li>
          <li>Salt crossover invalidates desalination selectivity</li>
        </ul>

        <p className="text-red-300">
          Partial flux is not sufficient. If salt transfer remains functionally present,
          the desalination claim fails.
        </p>
      </Section>

      {/* TEST */}
      <Section title="Minimal Decisive Test">
        <ol className="list-decimal pl-6">
          <li>Construct a bench-scale wick assembly with controlled feed salinity</li>
          <li>Apply low-grade thermal input under monitored humidity and airflow</li>
          <li>Measure distilled flux, salt crossover, and thermal gradient persistence</li>
          <li>Track salt deposition, capillary interruption, and structural degradation over time</li>
        </ol>

        <p className="text-red-300">
          The system is falsified if useful vapor separation cannot be sustained without
          gradient collapse, salt breakthrough, or wick failure.
        </p>
      </Section>

      {/* NON-CLAIMS */}
      <Section title="What This Does Not Claim">
        <ul className="list-disc pl-6">
          <li>No scalable desalination platform is claimed</li>
          <li>No industrial water-treatment viability is claimed</li>
          <li>No cost, throughput, or durability advantage is claimed</li>
          <li>No superiority over membranes, distillation, or RO is claimed</li>
        </ul>

        <p>
          This is a boundary publication because interacting gradients, fouling,
          and structural decay may prevent the system from ever crossing into robust practice.
        </p>
      </Section>

      {/* INVARIANT */}
      <Section title="Invariant Framework">
        <p>
          <strong>G:</strong> Gradient-preserving thermal and capillary transformations
        </p>
        <p>
          <strong>Q:</strong> Total dissolved salt mass within the coupled system
        </p>
        <p>
          <strong>S:</strong> The state of the wick-gradient regime — capillary continuity,
          gradient persistence, and transfer selectivity
        </p>

        <p className="text-red-300">
          Failure: collapse of S into blockage, breakthrough, or non-selective transport
        </p>
      </Section>

      {/* CLAIM */}
      <Section title="Claim Eligibility Boundary">
        <p>
          Any claim of desalination validity must show that the gradient-driven wick
          remains simultaneously selective, transport-capable, and stable over time.
        </p>

        <p className="text-red-300">
          Demonstrating evaporation alone is not admissible evidence of desalination.
        </p>
      </Section>

      {/* FINAL */}
      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">Boundary Judgment</h2>
        <p className="mt-4 leading-7 text-red-200">
          This concept is physically plausible but regime-fragile. Its legitimacy depends
          not on whether the mechanisms exist, but on whether they can remain coupled long
          enough to prevent gradient collapse, salt breakthrough, and wick self-obstruction.
          Until then, it remains boundary research rather than a valid desalination claim.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Boundary research · Gradient-bound · Non-scalable by default · Versioned
      </div>
    </main>
  );
}
