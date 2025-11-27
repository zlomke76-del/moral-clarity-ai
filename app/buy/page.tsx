// app/buy/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Pricing & access – Moral Clarity AI",
};

export default function BuyPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-16 md:py-20">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Moral Clarity AI
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
            Access Solace with anchored AI guidance.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            We&apos;re in a controlled rollout phase. Seats are limited while we
            finish stress-testing Solace, Neutral Newsroom, and the memory stack.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.95)]">
            <h2 className="text-lg font-semibold">Founder / Early access</h2>
            <p className="mt-2 text-sm text-slate-300">
              Designed for people who want Solace as a real working partner:
              deep conversations, Neutral Newsroom, and anchored memory.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>• Full Solace workspace with Ministry &amp; Guidance modes</li>
              <li>• Neutral news digest and outlet cabinet</li>
              <li>• Early access to memory features and roadmap experiments</li>
              <li>• Direct feedback channel to the builder</li>
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(56,189,248,0.8)] transition hover:bg-sky-400"
              >
                Request access
              </Link>
              <span className="text-xs text-slate-400">
                We&apos;ll follow up with details and current pricing before you
                commit.
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4">
              <h3 className="text-sm font-semibold text-slate-100">
                Why there isn&apos;t a big pricing table yet
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                We&apos;re still tuning infrastructure, news ingestion, and
                memory economics. Until that&apos;s stable, we&apos;d rather
                keep access human and direct instead of locking prices into a
                static chart.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4">
              <h3 className="text-sm font-semibold text-slate-100">
                What happens after you request access
              </h3>
              <ol className="mt-2 space-y-1 text-xs text-slate-300">
                <li>1. You sign in and confirm your email.</li>
                <li>2. We confirm fit and current capacity.</li>
                <li>3. You get a link with the actual plan &amp; payment flow.</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
