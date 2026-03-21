// app/whitepapers/page.tsx
// ============================================================
// WHITE PAPERS INDEX
// Elevated research library
// App Router | Next.js 16 SAFE
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "White Papers | Moral Clarity AI",
  description:
    "A curated research library from Moral Clarity AI examining physical, ethical, and epistemic boundaries across materials, harm reduction, constraint design, and accountable systems.",
  openGraph: {
    title: "White Papers | Moral Clarity AI",
    description:
      "A structured library of public white papers spanning conceptual research, core constrained polymer systems, extended PET architectures, and frontier material behaviors.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type WhitePaper = {
  slug: string;
  title: string;
  subtitle: string;
};

const CONCEPTUAL_PAPERS: WhitePaper[] = [
  {
    slug: "materials-with-causal-memory",
    title: "Materials with Causal Memory",
    subtitle:
      "Physical systems that irreversibly encode history, exposure, or misuse into material structure.",
  },
  {
    slug: "geometry-driven-pathogen-surfaces",
    title: "Geometry-Driven Pathogen Surfaces",
    subtitle:
      "How surface geometry alone can influence pathogen behavior without chemistry or claims of elimination.",
  },
  {
    slug: "passive-aerosol-suppression",
    title: "Passive Aerosol Suppression",
    subtitle:
      "Regime-bounded evaluation of materials that reduce aerosol transmission without filtration or airflow control.",
  },
  {
    slug: "passive-environmental-witnesses",
    title: "Passive Environmental Witnesses",
    subtitle:
      "Materials that record environmental exposure as physical evidence rather than data or reports.",
  },
  {
    slug: "passive-source-control",
    title: "Passive Source Control",
    subtitle:
      "Reducing emitted harm at the source through intrinsic material behavior, not user compliance.",
  },
  {
    slug: "phase-selective-cooling",
    title: "Phase-Selective Cooling",
    subtitle:
      "Thermal regulation through phase behavior rather than active energy expenditure.",
  },
];

const CORE_PET_SYSTEMS: WhitePaper[] = [
  {
    slug: "sulfonated-aromatic-diacid-pet",
    title: "Sulfonated Aromatic Diacid–PET Copolymer",
    subtitle: "Anchored fixed-charge PET with durability-gated hygiene capability.",
  },
  {
    slug: "phosphonate-diol-pet",
    title: "Phosphonate-Diol–PET Copolymer",
    subtitle: "Covalently retained phosphonate PET for non-leaching flame retardancy.",
  },
  {
    slug: "carboxylic-acid-modified-pet",
    title: "Carboxylic Acid–Modified PET",
    subtitle: "Pendant-acid PET for enhanced chemical resistance and container life.",
  },
  {
    slug: "quaternary-ammonium-grafted-pet",
    title: "Quaternary Ammonium–Grafted PET",
    subtitle: "Extraction-stable cationic PET surfaces with antimicrobial potential.",
  },
  {
    slug: "peg-diacid-pet",
    title: "PEG-Diacid PET Copolymer",
    subtitle: "Hydration-stable PEG incorporation for flexible, biocompatible PET.",
  },
  {
    slug: "imidazolium-functional-pet",
    title: "Imidazolium-Functional PET Graft",
    subtitle: "Salt-stable ionic PET for membranes and sensing.",
  },
  {
    slug: "zwitterion-modified-pet",
    title: "Zwitterion-Modified PET",
    subtitle: "Anti-fouling PET surfaces gated by hot-water extraction stability.",
  },
  {
    slug: "cyanate-ester-pet",
    title: "Cyanate Ester–PET Copolymer",
    subtitle: "Thermally durable PET via low-level cyanate anchoring.",
  },
  {
    slug: "allyl-sulfate-grafted-pet",
    title: "Allyl Sulfate Grafted PET",
    subtitle: "Anchored sulfate PET for filtration and ion-exchange applications.",
  },
  {
    slug: "epoxy-modified-pet",
    title: "Epoxy-Modified PET",
    subtitle: "Epoxy-diacid PET enabling adhesion and barrier enhancement.",
  },
];

const EXTENDED_PET_SYSTEMS: WhitePaper[] = [
  {
    slug: "bio-based-diacid-pet",
    title: "Bio-Based Diacid PET Copolymer (FDCA)",
    subtitle: "Renewable diacid PET supporting lower-carbon polymer supply chains.",
  },
  {
    slug: "biguanide-diacid-antimicrobial-pet",
    title: "Biguanide Diacid–Functional Antimicrobial PET",
    subtitle: "Anchored antimicrobial PET without leachable additives.",
  },
  {
    slug: "citric-acid-modified-pet",
    title: "Citric Acid–Modified PET",
    subtitle:
      "Controlled hydrolytic susceptibility enabling predictable end-of-life pathways.",
  },
  {
    slug: "gallic-acid-antioxidant-pet",
    title: "Gallic Acid–Antioxidant PET",
    subtitle: "Intrinsic antioxidant PET for extended shelf life and stability.",
  },
  {
    slug: "edta-ligand-functional-pet",
    title: "EDTA-Ligand Functional PET",
    subtitle: "Covalently anchored chelation for heavy-metal remediation.",
  },
  {
    slug: "catechol-bearing-pet",
    title: "Catechol-Bearing PET",
    subtitle: "Adhesion-enhanced PET inspired by mussel chemistry.",
  },
  {
    slug: "lignin-derived-aromatic-pet",
    title: "Lignin-Derived Aromatic PET Copolymer",
    subtitle: "Renewable aromatics from bio-refinery waste streams.",
  },
  {
    slug: "ionic-liquid-antistatic-pet",
    title: "Ionic Liquid–Mimic Antistatic PET",
    subtitle: "Durable antistatic PET without migrating additives.",
  },
];

const FRONTIER_SYSTEMS: WhitePaper[] = [
  {
    slug: "self-healing-diels-alder-pet",
    title: "Self-Healing PET via Diels–Alder Chemistry",
    subtitle: "Dynamic covalent PET enabling crack repair and life extension.",
  },
  {
    slug: "polyamine-co2-capture-pet",
    title: "Polyamine-Functional PET for CO₂ Capture",
    subtitle:
      "Solid-state CO₂ capture from concentrated streams or controlled air-contact systems.",
  },
];

function PaperCard({
  paper,
  category,
}: {
  paper: WhitePaper;
  category: string;
}) {
  return (
    <Link
      href={`/whitepapers/${paper.slug}`}
      className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.20)] transition duration-200 hover:border-cyan-300/25 hover:bg-white/[0.055] md:p-7"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-transparent opacity-80" />
      <div className="relative space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/12 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/58">
            {category}
          </span>
          <span className="rounded-full border border-white/12 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white/45">
            White Paper
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-white transition group-hover:text-cyan-100 md:text-2xl">
            {paper.title}
          </h3>
          <p className="text-sm leading-7 text-white/66 md:text-base">
            {paper.subtitle}
          </p>
        </div>

        <div className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/76 transition group-hover:border-cyan-300/30 group-hover:text-cyan-100">
          Open paper
          <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </Link>
  );
}

function SectionBlock({
  eyebrow,
  title,
  description,
  papers,
}: {
  eyebrow: string;
  title: string;
  description: string;
  papers: WhitePaper[];
}) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.18em] text-white/42">
          {eyebrow}
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-white/64 md:text-base">
          {description}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {papers.map((paper) => (
          <PaperCard key={paper.slug} paper={paper} category={eyebrow} />
        ))}
      </div>
    </section>
  );
}

export default function WhitePapersIndexPage() {
  const totalPapers =
    CONCEPTUAL_PAPERS.length +
    CORE_PET_SYSTEMS.length +
    EXTENDED_PET_SYSTEMS.length +
    FRONTIER_SYSTEMS.length;

  return (
    <main className="relative overflow-hidden bg-[#020817]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.10),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-8 lg:px-10 lg:py-20 space-y-12">
        {/* HERO */}
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#081427]/95 via-[#0b1220]/92 to-black/92 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/85">
                  White Papers
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Public Research Library
                </span>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  Regime-Bounded
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
                  White Papers
                </h1>
                <p className="max-w-4xl text-lg leading-8 text-white/82">
                  A structured research library from Moral Clarity AI examining
                  physical limits, ethical boundaries, epistemic failure, and
                  constrained material systems.
                </p>
                <p className="max-w-4xl text-base leading-8 text-white/66 md:text-lg">
                  This library is designed for serious review. These papers are
                  not positioned as universal claims or deployment guarantees.
                  They are bounded publications organized by constraint surface,
                  material logic, and survivability under scrutiny.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Scope
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Conceptual research, core constrained polymer systems,
                  extended PET architectures, and frontier material behaviors.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Standard
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  Inclusion indicates research relevance, not readiness,
                  certification, or deployment maturity.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                  Library Size
                </div>
                <div className="mt-3 text-sm leading-6 text-white/82">
                  {totalPapers} public papers across four research layers.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIBRARY POSITION */}
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Library Position
            </div>
            <p className="mt-4 text-base leading-8 text-white/74">
              This collection brings together public research across four
              distinct layers: conceptual papers that define regime boundaries,
              core PET systems that establish constrained functional chemistry,
              extended PET architectures that widen the field of material
              utility, and frontier systems that change the behavior class of
              the material itself.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              The purpose is not volume. The purpose is structured signal:
              papers that clarify where physical behavior, institutional reality,
              and survivable claims do or do not hold.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/65 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Reading Standard
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
              These papers are bounded by design.
            </p>
            <p className="mt-4 text-base leading-8 text-white/66">
              They are intentionally limited, regime-specific, and survivability-
              gated. Inclusion does not imply readiness, universal applicability,
              or commercial deployment status.
            </p>
          </div>
        </section>

        {/* SECTIONS */}
        <SectionBlock
          eyebrow="Conceptual Papers"
          title="Conceptual Papers"
          description="Research framing physical, ethical, and epistemic boundaries before materials, systems, or interventions are treated as operationally real."
          papers={CONCEPTUAL_PAPERS}
        />

        <SectionBlock
          eyebrow="Core PET Systems"
          title="Core PET White Papers"
          description="Core constrained PET systems focused on covalent retention, durability-gated function, extraction stability, and foundational performance behavior."
          papers={CORE_PET_SYSTEMS}
        />

        <SectionBlock
          eyebrow="Extended PET Systems"
          title="Extended PET Architectures"
          description="Extended PET candidates exploring renewable feedstocks, antimicrobial surfaces, chelation, adhesion, antioxidant behavior, and other broadened functional architectures."
          papers={EXTENDED_PET_SYSTEMS}
        />

        <SectionBlock
          eyebrow="Frontier Systems"
          title="Frontier Material Behaviors"
          description="Material systems where the behavioral class changes from static function to dynamic response, including self-healing and solid-state capture behavior."
          papers={FRONTIER_SYSTEMS}
        />

        {/* FOOTER INVARIANT */}
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Final Note
            </div>
            <p className="mt-4 text-base leading-8 text-white/74">
              This library is meant to stay disciplined. Papers remain useful
              only when they preserve their boundary conditions, regime limits,
              and non-claims with clarity.
            </p>
            <p className="mt-4 text-base leading-8 text-white/74">
              Public availability does not convert a bounded paper into a broad
              claim. It remains what it is: a structured research document under
              defined constraints.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/72 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-white/42">
              Invariant
            </div>
            <p className="mt-3 text-xl leading-8 text-white md:text-2xl">
              Inclusion in the library is not proof of readiness.
            </p>
            <p className="mt-4 text-base leading-7 text-white/64">
              These papers are regime-bounded, survivability-gated, and
              intentionally limited. Signal matters more than breadth.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
