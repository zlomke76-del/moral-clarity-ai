import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Edge of Practice — Short-Cycle Experiments | Moral Clarity AI",
  description:
    "A complete public index of short-cycle, falsifiable experiments designed to test hidden assumptions governing health, materials, energy, automation, and everyday human environments.",
  openGraph: {
    title: "Edge of Practice — Short-Cycle Experiments",
    description:
      "An exhaustive index of short-cycle experiments surfacing hidden assumptions with direct human relevance.",
    url: "https://moralclarity.ai/edge-of-practice",
    siteName: "Moral Clarity AI",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type PracticeLink = {
  href: string;
  label: string;
};

type PracticeDomain = {
  numeral: string;
  title: string;
  description: string;
  items: PracticeLink[];
};

const domains: PracticeDomain[] = [
  {
    numeral: "I",
    title: "Automation, Cognition, and Control",
    description:
      "Short-cycle experiments focused on authority, supervision, cognitive failure, refusal integrity, and drift under automation pressure.",
    items: [
      {
        href: "/edge-of-practice/agentic-normalization-drift",
        label: "Agentic Normalization Drift",
      },
      {
        href: "/edge-of-practice/alarm-parsing-collapse-threshold",
        label: "Alarm Parsing Collapse Threshold",
      },
      {
        href: "/edge-of-practice/autonomous-handoff-blackout",
        label: "Autonomous Handoff Blackout",
      },
      {
        href: "/edge-of-practice/irreversible-cognitive-dead-zones",
        label: "Irreversible Cognitive Dead Zones",
      },
      {
        href: "/edge-of-practice/irreversible-normalization-drift",
        label: "Irreversible Normalization Drift",
      },
      {
        href: "/edge-of-practice/human-supervision-autonomy",
        label: "Human Supervision as Failsafe",
      },
      {
        href: "/edge-of-practice/post-deployment-monitoring-ai",
        label: "Post-Deployment Monitoring in AI",
      },
      {
        href: "/edge-of-practice/polyphonic-ai-bounded-authority",
        label: "Polyphonic AI Under Bounded Authority",
      },
      {
        href: "/edge-of-practice/confidence-suppresses-safeguards",
        label: "Confidence Suppression of Dissent, Verification, and Refusal",
      },
      {
        href: "/edge-of-practice/pre-commitment-dampening",
        label: "Pre-Commitment Dampening",
      },
      {
        href: "/edge-of-practice/refusal-outside-optimization",
        label: "Refusal Must Remain Outside Optimization",
      },
    ],
  },
  {
    numeral: "II",
    title: "Materials, Polymers, and Surface Effects",
    description:
      "Rapid experiments on interfacial behavior, morphology, additives, cooling asymmetry, durability, and material response under constrained conditions.",
    items: [
      {
        href: "/edge-of-practice/antibiotic-resistance-gene-cleaning",
        label: "Antibiotic Resistance Gene Cleaning",
      },
      {
        href: "/edge-of-practice/compostable-packaging-microfragments",
        label: "Compostable Packaging Microfragments",
      },
      {
        href: "/edge-of-practice/glove-additive-leaching-alcohol-sanitizer",
        label: "Glove Additive Leaching",
      },
      {
        href: "/edge-of-practice/hdpe-die-entrance-viscosity-melt-fracture",
        label: "HDPE Die-Entrance Melt Fracture",
      },
      {
        href: "/edge-of-practice/hdpe-ldpe-interfacial-toughening",
        label: "HDPE–LDPE Interfacial Toughening",
      },
      {
        href: "/edge-of-practice/pc-abs-interfacial-microdamping",
        label: "PC–ABS Interfacial Microdamping",
      },
      {
        href: "/edge-of-practice/pc-pmma-scratch-resistance",
        label: "PC–PMMA Scratch Resistance",
      },
      {
        href: "/edge-of-practice/pe-paraffin-thermal-buffering",
        label: "PE–Paraffin Thermal Buffering",
      },
      {
        href: "/edge-of-practice/ps-pdms-surface-lubricity",
        label: "PS–PDMS Surface Lubricity",
      },
      {
        href: "/edge-of-practice/pet-pvdf-electret-humidity-edge-case",
        label: "PET–PVDF Electret Humidity Edge Case",
      },
      {
        href: "/edge-of-practice/gauge-correlated-asymmetry-in-polymer-cooling",
        label: "Gauge-Correlated Cooling Asymmetry",
      },
      {
        href: "/edge-of-practice/architected-micro-lattice-ev-battery-enclosure",
        label: "Architected Micro-Lattice EV Battery Enclosure",
      },
      {
        href: "/edge-of-practice/pom-path-memory-bimodal-basin",
        label: "POM Path-Memory Bimodal Basin Test",
      },
      {
        href: "/edge-of-practice/tpu-segmental-network-decoupling",
        label: "TPU Segmental Network Decoupling Test",
      },
    ],
  },
  {
    numeral: "III",
    title: "Energy, Physics, and Passive Systems",
    description:
      "Short-cycle experiments probing passive dynamics, constructive physical effects, oscillation behavior, and non-obvious energy-relevant boundary conditions.",
    items: [
      {
        href: "/edge-of-practice/constructive-physics",
        label: "Constructive Physics",
      },
      {
        href: "/edge-of-practice/phase-locked-capillary-oscillation",
        label: "Phase-Locked Capillary Oscillation",
      },
      {
        href: "/edge-of-practice/radiative-tension-rectification",
        label: "Radiative Tension Rectification",
      },
      {
        href: "/edge-of-practice/spectral-boundary-layer-destabilization",
        label: "Spectral Boundary-Layer Destabilization",
      },
      {
        href: "/edge-of-practice/thermomechanical-phase-aligned-insulation",
        label: "Thermomechanical Phase-Aligned Insulation",
      },
      {
        href: "/edge-of-practice/embedded-osmotic-power",
        label: "Embedded Osmotic Power",
      },
    ],
  },
  {
    numeral: "IV",
    title: "Environment, Exposure, and Human Health",
    description:
      "Experiments surfacing hidden exposure pathways, indoor-environment effects, contamination risks, and everyday human health boundary conditions.",
    items: [
      {
        href: "/edge-of-practice/air-ionizer-electrostatic-charge",
        label: "Air Ionizer Electrostatic Charge",
      },
      {
        href: "/edge-of-practice/heavy-metal-remobilization-urban-soils",
        label: "Heavy Metal Remobilization",
      },
      {
        href: "/edge-of-practice/hot-water-ph-metal-leaching",
        label: "Hot Water pH-Driven Metal Leaching",
      },
      {
        href: "/edge-of-practice/indoor-lighting-circadian-expression",
        label: "Indoor Lighting Circadian Expression",
      },
      {
        href: "/edge-of-practice/microplastics",
        label: "Indoor Microplastics",
      },
      {
        href: "/edge-of-practice/uv-sterilization-shadows",
        label: "UV Sterilization Shadows",
      },
      {
        href: "/edge-of-practice/viral-viability-indoor-surfaces",
        label: "Viral Viability on Indoor Surfaces",
      },
      {
        href: "/edge-of-practice/vitamin-loss-refrigerated-juice",
        label: "Vitamin Loss in Refrigerated Juice",
      },
      {
        href: "/edge-of-practice/sweat-driven-device-corrosion",
        label: "Sweat-Driven Device Corrosion",
      },
    ],
  },
];

function DomainCard({ numeral, title, description, items }: PracticeDomain) {
  return (
    <section className="group relative overflow-hidden rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm transition duration-300 hover:border-sky-800/60 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.10),0_26px_80px_rgba(0,0,0,0.50)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.10),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.06),transparent_28%)] opacity-70" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="mt-0.5 inline-flex min-w-[2.75rem] items-center justify-center rounded-full border border-sky-900/60 bg-sky-950/50 px-2.5 py-1 text-xs font-semibold tracking-[0.16em] text-sky-300">
          {numeral}
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-semibold leading-tight tracking-tight text-white">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {description}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-6 h-px w-full bg-gradient-to-r from-transparent via-sky-800/45 to-transparent" />

      <ul className="relative z-10 mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group/link inline-flex items-start gap-2 text-[15px] leading-7 text-sky-300 transition hover:text-sky-200"
            >
              <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-sky-400/80 transition group-hover/link:bg-sky-300" />
              <span className="underline decoration-sky-800/30 underline-offset-4 transition group-hover/link:decoration-sky-400">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SignalPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-sky-950/45 bg-slate-950/65 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}

function LifecycleCard({
  title,
  description,
  href,
  active = false,
}: {
  title: string;
  description: string;
  href?: string;
  active?: boolean;
}) {
  const content = (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border p-6 transition duration-300",
        active
          ? "border-sky-700/60 bg-slate-900/78 shadow-[0_12px_40px_rgba(0,0,0,0.30)]"
          : "border-sky-950/45 bg-slate-950/65 hover:border-sky-800/60 hover:bg-slate-950/78",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-500/8 to-transparent opacity-60" />
      <div className="relative z-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-300">
          {title}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

export default function EdgeOfPracticeIndexPage() {
  return (
    <main className="mx-auto w-full max-w-[1400px] px-6 pb-8 pt-2 sm:px-8 lg:px-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-950/45 bg-slate-950/72 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_30px_100px_rgba(0,0,0,0.50)] backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_30%)]" />
        <div className="relative z-10 grid items-center gap-12 px-8 py-10 md:px-10 md:py-12 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex items-center rounded-full border border-sky-900/60 bg-sky-950/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
              MCAI Practice Layer
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl xl:text-[3.55rem] xl:leading-[1.04]">
              Edge of Practice
            </h1>

            <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-slate-100 md:text-xl">
              Short-cycle experiments that break false assumptions at human
              scale.
            </p>

            <p className="mt-6 max-w-3xl text-[16px] leading-8 text-slate-300">
              <em>Edge of Practice</em> is a public index of small, decisive
              experiments executable with standard laboratory tools, commodity
              materials, and short timelines. These experiments are not designed
              to optimize systems or invent products. They exist to surface
              hidden assumptions quickly, test them cleanly, and expose where
              reality resists narrative.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <SignalPill
                label="Cycle"
                value="Short-cycle experiments built for rapid falsification."
              />
              <SignalPill
                label="Method"
                value="Small decisive tests using accessible tools and bounded conditions."
              />
              <SignalPill
                label="Purpose"
                value="Break false assumptions before they scale into doctrine or deployment."
              />
            </div>
          </div>

          <div className="flex justify-center xl:justify-end">
            <div className="relative flex w-full max-w-[420px] items-center justify-center rounded-[2rem] border border-sky-950/40 bg-slate-950/45 p-8 shadow-[0_0_64px_rgba(59,130,246,0.16)]">
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle,rgba(56,189,248,0.10),transparent_60%)]" />
              <Image
                src="/assets/image_practice-trans_01.png"
                alt="Edge of Practice emblem"
                width={340}
                height={340}
                priority
                className="relative z-10 h-auto w-full max-w-[300px] object-contain opacity-95 drop-shadow-[0_0_60px_rgba(59,130,246,0.32)]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl py-14 text-center">
        <p className="text-lg leading-9 text-slate-300 md:text-xl">
          Assumptions often survive because nobody tests them small.
        </p>

        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl xl:text-[2.8rem]">
          Edge of Practice exists to make hidden failure visible before scale
          gives it cover.
        </h2>

        <div className="mx-auto mt-6 h-px w-24 bg-sky-500/40" />

        <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-8 text-slate-400">
          Where Edge of Knowledge defines governing boundaries, Edge of Practice
          tests them against short-cycle reality.
        </p>
      </section>

      <section className="rounded-[2rem] border border-sky-950/45 bg-slate-950/70 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm md:p-10">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-sky-400" />
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            Experiment Lifecycle
          </h2>
        </div>

        <p className="mt-5 max-w-4xl text-[16px] leading-8 text-slate-300">
          Practice work moves through bounded experimental stages. This page is
          the authoritative index for short-cycle tests: fast, falsifiable, and
          deliberately scoped to surface meaningful contradiction before larger
          commitments are made.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <LifecycleCard
            title="Short-Cycle"
            description="Rapid falsification under bounded conditions. This index."
            active
          />
          <LifecycleCard
            title="Extended Cycle"
            description="Longer-duration testing once short-cycle contradictions survive initial challenge."
            href="/edge-of-practice/extended-cycle"
          />
          <LifecycleCard
            title="Persistence"
            description="Work that remains durable across repeated challenge, time, and operational stress."
            href="/edge-of-practice/persistence"
          />
        </div>

        <p className="mt-6 text-sm leading-7 text-slate-400">
          The lifecycle is not a growth ladder. It is an admissibility filter.
        </p>
      </section>

      <section className="mt-12 rounded-[2rem] border border-sky-900/40 bg-gradient-to-b from-slate-950 to-slate-900 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] md:p-10">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Practice Principle
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
            Small, decisive experiments are often the fastest way to break large
            illusions.
          </h2>
          <p className="mt-4 text-[16px] leading-8 text-slate-400">
            These experiments are designed to surface hidden assumptions with
            direct human, operational, or material relevance using constrained
            setups rather than elaborate theoretical framing.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
              Short-Cycle Domains
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-[2.35rem]">
              Structured by experimental function
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-slate-400">
            Each domain groups experiments by the type of assumption being
            challenged so readers can move through automation, materials,
            passive systems, and human exposure without losing boundary context.
          </p>
        </div>

        <div className="grid gap-8 2xl:grid-cols-2">
          {domains.map((domain) => (
            <DomainCard key={domain.title} {...domain} />
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-8 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Canonical Constraints
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Non-negotiable admissibility invariants
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            All Edge of Practice experiments operate under canonical
            constraints. These are referenced for admissibility only and are not
            restated, interpreted, or modified here.
          </p>

          <ul className="mt-6 space-y-3">
            <li>
              <Link
                href="/canon/invariants/refusal-outside-optimization"
                className="group/link inline-flex items-start gap-2 text-[15px] leading-7 text-sky-300 transition hover:text-sky-200"
              >
                <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-sky-400/80 transition group-hover/link:bg-sky-300" />
                <span className="underline decoration-sky-800/30 underline-offset-4 transition group-hover/link:decoration-sky-400">
                  Refusal Must Remain Outside Optimization
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/canon/invariants/post-refusal-non-instrumentality"
                className="group/link inline-flex items-start gap-2 text-[15px] leading-7 text-sky-300 transition hover:text-sky-200"
              >
                <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-sky-400/80 transition group-hover/link:bg-sky-300" />
                <span className="underline decoration-sky-800/30 underline-offset-4 transition group-hover/link:decoration-sky-400">
                  Post-Refusal Non-Instrumentality
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/canon/invariants/authority-conservation-across-agents"
                className="group/link inline-flex items-start gap-2 text-[15px] leading-7 text-sky-300 transition hover:text-sky-200"
              >
                <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-sky-400/80 transition group-hover/link:bg-sky-300" />
                <span className="underline decoration-sky-800/30 underline-offset-4 transition group-hover/link:decoration-sky-400">
                  Authority Conservation Across Agents
                </span>
              </Link>
            </li>
          </ul>
        </section>

        <section className="rounded-[1.75rem] border border-sky-950/45 bg-slate-950/72 p-8 shadow-[0_0_0_1px_rgba(59,130,246,0.05),0_18px_56px_rgba(0,0,0,0.38)] backdrop-blur-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
            Evaluation &amp; Deployment Gate
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            From experiment to regulated relevance
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            The experiments indexed here surface failure modes that often emerge
            only at runtime, especially under uncertainty, pressure, or
            delegation.
          </p>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            For organizations assessing whether AI systems are suitable to move
            beyond experimentation into regulated or high-consequence
            environments, the relevant neutral evaluation aid is the Runtime
            Authority Checklist.
          </p>

          <Link
            href="/canon/checklists/runtime-authority-v1"
            className="mt-6 inline-flex items-center gap-2 text-lg font-medium text-sky-300 transition hover:text-sky-200"
          >
            <span className="underline decoration-sky-800/40 underline-offset-4">
              Runtime Authority Checklist (v1.0)
            </span>
            <span aria-hidden="true">→</span>
          </Link>

          <p className="mt-5 text-sm leading-7 text-slate-500">
            The checklist defines outcome-level requirements for scope limits,
            refusal integrity, uncertainty handling, predictability under
            stress, and post-incident reconstruction without prescribing
            technical architecture.
          </p>
        </section>
      </section>

      <section className="mt-14 rounded-[1.75rem] border border-sky-950/40 bg-slate-950/55 px-6 py-6 text-center shadow-[0_0_0_1px_rgba(59,130,246,0.04)] backdrop-blur-sm">
        <p className="text-sm leading-7 text-slate-400">
          This page is the authoritative index of all short-cycle experiments.
          Entries are fixed at publication and revised only through explicit
          versioning so epistemic continuity remains visible rather than
          overwritten.
        </p>
      </section>
    </main>
  );
}
