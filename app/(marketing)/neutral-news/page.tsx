// app/(marketing)/neutral-news/page.tsx

import HowSolaceWorks from "@/components/news/HowSolaceWorks";
import NeutralNewsClientSections from "./NeutralNewsClientSections";

export const dynamic = "force-static";

export default function NeutralNewsPage() {
  return (
    <main className="w-full bg-slate-950 text-slate-50">
      {/* HERO SECTION */}
      <section className="border-b border-slate-800 bg-slate-950/95 px-6 py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6">
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">
            The World’s First{" "}
            <span className="text-emerald-400">
              Neutral AI News Anchor
            </span>
          </h1>

          <p className="max-w-2xl text-lg text-slate-300">
            Solace does not browse the web. She reads a verified,
            bias-scored, mathematically transparent news digest
            governed by Moral Clarity AI.
          </p>

          <div className="mt-4 flex flex-wrap gap-4">
            <a
              href="/app"
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Try Solace
            </a>

            <a
              href="#how-it-works"
              className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-900"
            >
              How it Works
            </a>
          </div>
        </div>
      </section>

      {/* CLIENT-ONLY SECTIONS */}
      <NeutralNewsClientSections />

      {/* HOW SOLACE WORKS */}
      <section id="how-it-works" className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <HowSolaceWorks />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 text-center text-xs text-slate-600">
        Moral Clarity AI · Neutral News Engine · {new Date().getFullYear()}
      </footer>
    </main>
  );
}
