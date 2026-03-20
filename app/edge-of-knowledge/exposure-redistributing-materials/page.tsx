// app/edge-of-knowledge/exposure-redistributing-materials/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Exposure-Redistributing Materials as Harm Reduction | Moral Clarity AI",
  description:
    "A conservation-bound evaluation of materials that redistribute exposure rather than eliminate hazard. Physics-valid, ethically constrained, and explicitly limited.",
  openGraph: {
    title: "Exposure-Redistributing Materials as Harm Reduction",
    description:
      "When reducing harm means redistributing exposure under conservation constraints—not claiming elimination.",
    url: "https://moralclarity.ai/exposure-redistributing-materials",
    siteName: "Moral Clarity AI",
    type: "article",
  },
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
      <div className="mt-4 space-y-4 text-slate-300 leading-7">{children}</div>
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

export default function ExposureRedistributingMaterialsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-14 space-y-12">
      <section className="rounded-3xl border border-sky-950/50 bg-slate-950/80 p-10 shadow-xl">
        <div className="text-xs uppercase tracking-widest text-sky-300">
          Edge of Knowledge — Conservation-Bound Evaluation
        </div>

        <h1 className="mt-4 text-4xl font-semibold text-white leading-tight">
          Exposure-Redistributing Materials as Harm Reduction
        </h1>

        <p className="mt-4 text-lg text-slate-300">
          Harm reduction through redistribution—not elimination.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Signal label="Type" value="Conservation-Bound Evaluation" />
          <Signal label="Constraint" value="Hazard Not Reduced" />
          <Signal label="Effect" value="Exposure Redistribution" />
        </div>

        <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
          Hazard conserved · Redistribution only · No elimination claims
        </div>
      </section>

      <Section title="Abstract">
        <p>
          Not all safety interventions eliminate hazards. Some instead reduce
          harm by redistributing exposure—changing where, when, or to whom a
          hazard is most likely to interface with the human body. This evaluation
          asks whether materials can passively and reliably achieve such
          redistribution using intrinsic physical properties alone.
        </p>
        <p>
          Exposure redistribution can provide meaningful harm reduction in
          narrow, well-defined contexts, but it is fragile under real-world
          variability and must never be presented as hazard elimination. Ethical
          deployment depends on strict validation and transparent communication.
        </p>
      </Section>

      <Section title="Conservation Constraint">
        <p>
          These systems do not reduce total hazard. They redistribute exposure
          across space, time, or interface.
        </p>
        <p>
          Any observed harm reduction arises only if the redistribution lowers
          effective risk at critical human interfaces.
        </p>
        <p className="text-red-300">Total hazard remains conserved.</p>
      </Section>

      <section>
        <h2 className="text-2xl font-semibold text-white">
          Mechanism Classes
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Mechanism
            title="Directional Transport Bias"
            desc="Structured or patterned surfaces guide particles, droplets, or contaminants away from critical human interfaces."
          />
          <Mechanism
            title="Selective Adhesion or Affinity Gradients"
            desc="Layered materials anchor hazards in sacrificial or non-critical zones."
          />
          <Mechanism
            title="Interface Impedance Mismatch"
            desc="Altered surface energy or texture reduces transfer probability at protected interfaces."
          />
          <Mechanism
            title="Spatial Localization"
            desc="Designs accumulate hazards in removable, cleanable, or isolated regions."
          />
          <Mechanism
            title="Temporal Delay"
            desc="Slowing transfer or exposure reduces peak dose without altering total hazard load."
          />
        </div>

        <p className="mt-6 text-sm text-slate-400">
          All mechanisms considered here conserve total hazard while
          redistributing exposure. No removal, neutralization, or filtration is
          assumed.
        </p>
      </section>

      <Section title="Regime and Scale Analysis">
        <p className="font-semibold text-white">Viable regimes</p>
        <ul className="list-disc pl-6">
          <li>Close-contact environments with defined interfaces</li>
          <li>Layered fabrics, PPE adjuncts, or surface coverings</li>
          <li>
            Scenarios where reducing peak or localized dose lowers health risk
          </li>
        </ul>

        <p className="mt-4 font-semibold text-white">Marginal regimes</p>
        <ul className="list-disc pl-6">
          <li>Variable airflow or posture</li>
          <li>Mixed contaminants</li>
          <li>Partial, intermittent, or inconsistent use</li>
        </ul>

        <p className="mt-4 font-semibold text-white">Expected failures</p>
        <ul className="list-disc pl-6">
          <li>Far-field aerosol transmission</li>
          <li>High turbulence or rapidly changing environments</li>
          <li>Situations requiring absolute hazard elimination</li>
          <li>
            Scenarios where redistributed exposure lands on equally vulnerable
            populations or body regions
          </li>
        </ul>

        <p>
          Effectiveness declines rapidly with environmental variability and user
          non-compliance.
        </p>
      </Section>

      <Section title="Distinguishing Real Effects from Confounds">
        <p>
          Exposure redistribution must arise from intrinsic material behavior,
          not from:
        </p>
        <ul className="list-disc pl-6">
          <li>Implicit filtration or airflow restriction</li>
          <li>Added thickness or simple coverage</li>
          <li>User behavioral changes</li>
          <li>Laboratory artifacts that fail under wear or fouling</li>
          <li>Net risk relocation to other critical body areas or people</li>
        </ul>
      </Section>

      <Section title="Falsification Criteria">
        <p>Redistribution as harm reduction is falsified if:</p>
        <ul className="list-disc pl-6">
          <li>
            Exposure at key human interfaces is not measurably reduced in
            controlled comparisons
          </li>
          <li>Peak dose or transfer rates are not improved</li>
          <li>
            Effects vanish under realistic variability, load, or wear
          </li>
          <li>
            Risk is merely relocated or new secondary exposure pathways are
            created
          </li>
          <li>
            Users cannot reliably perceive or benefit from the redistribution
          </li>
          <li>
            Total system exposure remains constant while local exposure appears
            reduced only by mismeasurement rather than verified redistribution
          </li>
        </ul>
      </Section>

      <Section title="Humanitarian and Ethical Assessment">
        <p>
          Partial exposure reduction can reduce harm when peak or localized dose
          drives risk. Such systems may be appropriate in low-resource settings
          if robust, passive, and easily interpretable.
        </p>
        <p>
          Ethical risks include false confidence, substitution for primary
          protections, and unequal redistribution of risk. Ethical deployment
          requires explicit communication that exposure still exists and
          elimination is not claimed.
        </p>
      </Section>

      <Section title="Comparison to Existing Mitigations">
        <ul className="list-disc pl-6">
          <li>
            <strong>Filtration or elimination:</strong> reduce total hazard
            load; redistribution does not
          </li>
          <li>
            <strong>Ventilation and purification:</strong> actively remove
            hazards; redistribution is complementary only
          </li>
          <li>
            <strong>Chemical interventions:</strong> neutralize hazards but may
            introduce toxicity
          </li>
          <li>
            <strong>Behavioral controls:</strong> often outperform passive
            redistribution when compliance is high
          </li>
        </ul>

        <p>
          Redistribution must never undermine stronger, proven interventions.
        </p>
      </Section>

      <section className="rounded-2xl border border-red-900/40 bg-red-950/20 p-8">
        <h2 className="text-xl font-semibold text-white">Final Judgment</h2>
        <p className="mt-4 text-red-200 leading-7">
          <strong>CONDITIONAL GO.</strong> Exposure-redistributing materials are
          physically valid under conservation of hazard. They can reduce risk at
          specific interfaces but do not reduce total hazard. Effects are
          fragile, context-dependent, and ethically deployable only with
          rigorous validation and transparent communication. These systems must
          remain strictly complementary and must never be presented as
          elimination.
        </p>
      </section>

      <div className="text-center text-sm text-slate-500">
        Canonical · Conservation-bound · Non-eliminative · Versioned
      </div>
    </main>
  );
}
