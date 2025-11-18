// app/neutrality-check/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { useState, FormEvent } from 'react';

export const metadata: Metadata = {
  title: 'Neutrality Check | Moral Clarity AI',
  description:
    'Have Solace review a news article for bias, omissions, and framing. Built for journalists, editors, and readers.',
};

export default function NeutralityCheckMarketingPage() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Marketing page is a teaser – no live scoring here yet.
    setStatus(
      'This is a preview workspace. For live scoring, sign in or create a free account.'
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-xs font-semibold tracking-wider">
              MCAI
            </span>
            <span className="text-sm font-semibold text-slate-100">
              Moral Clarity AI
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/pricing"
              className="rounded-full border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-400 hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/auth/sign-in"
              className="rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:py-14">
        {/* Left: Explanation & grading system */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/60 bg-emerald-900/20 px-3 py-1 text-xs font-medium text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Neutrality Check · Early Access
          </div>

          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
            Let Solace sanity-check your news story before it goes live.
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-slate-300">
            Neutrality Check is a workspace where{' '}
            <span className="font-semibold text-slate-100">Solace</span> reads a
            draft or published article and surfaces:
          </p>

          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Language that leans emotionally or politically.</li>
            <li>• Framing that favors one side without stating it.</li>
            <li>• Missing context, stakeholders, or timelines.</li>
            <li>• A simple, transparent bias &amp; predictability score.</li>
          </ul>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200">
            <h2 className="mb-2 text-sm font-semibold text-slate-50">
              How the grading system works
            </h2>
            <p className="mb-2">
              We don&apos;t grade outlets as “good” or “bad,” and we don&apos;t
              take sides. We measure patterns.
            </p>
            <ul className="space-y-1.5">
              <li>
                <span className="font-semibold text-slate-100">
                  Bias components (0–3)
                </span>{' '}
                – language, sources, framing, and context.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  Bias intent score (0–3)
                </span>{' '}
                – combined signal of whether the story is nudging the reader.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  Predictability Index (0–1)
                </span>{' '}
                – how reliably the piece stays in the “fact-first” lane.
              </li>
            </ul>
            <p className="mt-2 text-xs text-slate-400">
              Bias is simply bias — left, right, or otherwise. Our role is to
              surface it, not to punish or endorse anyone.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-300">
            <p className="mb-2 font-semibold text-slate-100">
              Free check for journalists
            </p>
            <p className="mb-1">
              Any working journalist or student can run Neutrality Check inside
              Moral Clarity AI at no cost.
            </p>
            <p>
              Create an account, choose any membership tier, and Neutrality
              tools are included. You&apos;re paying for the workspace and
              storage, not for honesty.
            </p>
          </div>
        </section>

        {/* Right: Solace chat + article input (teaser mode) */}
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-sky-900/20">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Solace · Neutrality Host
                </p>
                <p className="text-xs text-slate-300">
                  Ask 1–2 questions, then paste a URL or draft for a preview
                  review.
                </p>
              </div>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/90 text-xs font-bold text-slate-950">
                S
              </span>
            </div>

            <div className="mb-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-200">
              <p className="mb-1 font-semibold text-slate-50">
                Welcome, journalist.
              </p>
              <p>
                I&apos;m here to stress-test your story for bias, omissions, or
                framing you might have missed. On this public page I can walk
                you through the process and show a sample review. For full,
                private analysis, sign in to Moral Clarity AI.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">
                Optional question for Solace
                <textarea
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/40 focus:border-sky-500 focus:ring-2"
                  rows={2}
                  placeholder="Example: “I’m trying to stay neutral on immigration policy while still covering the human impact. What should I watch for?”"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </label>

              <label className="block text-xs font-medium text-slate-300">
                Article URL
                <input
                  type="url"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/40 focus:border-sky-500 focus:ring-2"
                  placeholder="https://example.com/your-article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </label>

              <label className="block text-xs font-medium text-slate-300">
                Or paste your draft (optional)
                <textarea
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/40 focus:border-sky-500 focus:ring-2"
                  rows={5}
                  placeholder="Paste up to a few paragraphs. In the full studio, Solace can handle long-form investigations and batch analysis."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </label>

              <button
                type="submit"
                className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
                disabled={!url && !text}
              >
                Preview Neutrality Check (sign-in required for full report)
              </button>

              {status && (
                <p className="mt-2 text-[11px] leading-snug text-slate-300">
                  {status}{' '}
                  <Link
                    href="/auth/sign-in"
                    className="font-semibold text-sky-400 underline-offset-2 hover:underline"
                  >
                    Sign in or create a free account.
                  </Link>
                </p>
              )}
            </form>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300">
            <p className="mb-1 font-semibold text-slate-100">
              What expands with membership?
            </p>
            <ul className="space-y-1">
              <li>• Unlimited article reviews per month.</li>
              <li>• Full bias breakdown + Predictability Index.</li>
              <li>• History, timelines, and workspace-level ledgers.</li>
              <li>• Private storage of your drafts and Solace notes.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
