// app/whitepapers/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "White Papers | Moral Clarity AI",
  description:
    "A curated collection of Moral Clarity AI white papers examining physical, ethical, and epistemic limits of safety, harm reduction, and truth enforcement.",
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

const WHITE_PAPERS: WhitePaper[] = [
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

export default function WhitePapersIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-serif tracking-tight">
          White Papers
        </h1>
        <p className="mt-4 text-sm opacity-80">
          Public research notes from Moral Clarity AI examining where physics,
          ethics, and institutional reality diverge.
        </p>
      </header>

      <section className="space-y-6">
        {WHITE_PAPERS.map((paper) => (
          <Link
            key={paper.slug}
            href={`/whitepapers/${paper.slug}`}
            className="block rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 transition hover:border-neutral-600 hover:bg-neutral-900"
          >
            <h2 className="text-xl font-medium text-neutral-100">
              {paper.title}
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              {paper.subtitle}
            </p>
          </Link>
        ))}
      </section>

      <footer className="mt-16 text-center text-xs text-neutral-500">
        These papers are exploratory, regime-bounded, and intentionally limited.
        They do not claim universal solutions or substitute for engineering,
        governance, or regulation.
      </footer>
    </main>
  );
}
