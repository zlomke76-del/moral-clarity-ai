/* app/(marketing)/neutral-news/page.tsx */

import dynamic from "next/dynamic";
import HowSolaceWorks from "@/components/news/HowSolaceWorks";

// Client-only components MUST be dynamically imported with ssr disabled
const DailyDigestFeedClient = dynamic(
  () => import("@/components/news/DailyDigestFeedClient").then(m => m.DailyDigestFeedClient),
  { ssr: false }
);

const OutletNeutralityScoreboardClient = dynamic(
  () =>
    import("@/components/news/OutletNeutralityScoreboardClient").then(
      m => m.OutletNeutralityScoreboardClient
    ),
  { ssr: false }
);

// This page is allowed to be static once client code is isolated
export const dynamic = "force-static";

export default function NeutralNewsPage() {
  return (
    <main className="w-full bg-slate-950 text-slate-50">
      {/* HERO SECTION */}
      <section className="border-b border-slate-800 bg-slate-950/95 px-6 py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6">
          <h1 className="text-3xl font-bold leading-tight text-slate-50 md:text-4xl">
            The World’s First{" "}
            <span className="text-emerald-400">Neutral AI News Anchor</span>
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Solace does not browse the web. She reads a verified, bias scored,
            mathematically transparent news digest backed by MCAI’s
            ledger-driven media engine.
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

      {/* DAILY DIGEST */}
      <section className="border-b border-slate-800 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-xl font-semibold text-slate-50">
            Today’s Neutral Digest
          </h2>
          <p className="mb-8 max-w-2xl text-sm text-slate-400">
            Each story shown here has been independently scored for bias,
            context, omissions, disputed claims, and predictability, then
            locked into MCAI’s global ledger for Solace to read.
          </p>

          <DailyDigestFeedClient limit={20} />
        </div>
      </section>

      {/* OUTLET NEUTRALITY SCOREBOARD */}
      <section className="border-b border-slate-800 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-xl font-semibold text-slate-50">
            Outlet Neutrality Scoreboard
          </h2>
          <p className="mb-8 max-w-2xl text-sm text-slate-400">
            Lifetime bias intent and predictability across all outlets MCAI
            has scored. Each outlet is normalized, deduped, and tracked over
            time.
          </p>

          <OutletNeutralityScoreboardClient limit={200} minStories={3} />
        </div>
      </section>

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
