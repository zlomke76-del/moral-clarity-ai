// app/white-papers/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "White Papers | Moral Clarity AI",
  description:
    "Foundational white papers from Moral Clarity AI exploring ethical infrastructure, material truth, and systemic risk.",
  openGraph: {
    title: "Moral Clarity AI — White Papers",
    description:
      "Foundational research and doctrine papers on ethics, risk, and truth systems.",
    url: "https://moralclarity.ai/white-papers",
    siteName: "Moral Clarity AI",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type WhitePaper = {
  title: string;
  slug: string;
  description: string;
  version: string;
  status: "public" | "draft";
};

/**
 * 🔒 EXPLICIT INDEX
 * - No CMS
 * - No dynamic loading
 * - No hidden generation
 * - Order is intentional
 */
const WHITE_PAPERS: WhitePaper[] = [
  {
    title: "Material-Encoded Truth",
    slug: "/material-encoded-truth",
    description:
      "A safety primitive that encodes cumulative risk directly into physical materials, preventing denial when oversight fails.",
    version: "v1.0",
    status: "public",
  },

  // Future papers go here explicitly
  // {
  //   title: "The Abrahamic Code",
  //   slug: "/abrahamic-code",
  //   description: "Ethical geometry for aligned intelligence systems.",
  //   version: "v1.0",
  //   status: "draft",
  // },
];

export default function WhitePapersIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-serif tracking-tight">
          White Papers
        </h1>
        <p className="mt-3 text-sm opacity-80">
          Foundational research and doctrine papers from Moral Clarity AI.
          These documents are designed to be durable, citable, and independent
          of product releases.
        </p>
      </header>

      <section className="space-y-6">
        {WHITE_PAPERS.map((paper) => (
          <article
            key={paper.slug}
            className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 hover:bg-neutral-900 transition"
          >
            <Link href={paper.slug} className="block">
              <h2 className="text-lg font-medium text-neutral-100">
                {paper.title}
              </h2>

              <p className="mt-2 text-sm text-neutral-400">
                {paper.description}
              </p>

              <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500">
                <span>{paper.version}</span>
                <span>•</span>
                <span>
                  {paper.status === "public" ? "Public white paper" : "Draft"}
                </span>
              </div>
            </Link>
          </article>
        ))}
      </section>

      <footer className="mt-16 text-xs text-neutral-500">
        These papers reflect the ethical and reasoning doctrine used by Solace,
        but do not require Solace to be deployed.
      </footer>
    </main>
  );
}
