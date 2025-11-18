// app/app/neutrality-check/page.tsx
'use client';

import type { Metadata } from 'next';
import { useState, FormEvent } from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Neutrality Check · Studio | Moral Clarity AI',
  description:
    'Interactive workspace for running Solace neutrality assessments on news articles and drafts.',
};

export default function NeutralityCheckAppPage() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Placeholder: this is where we’ll later call your /api/chat route
    // with a “NeutralityCheck” mode and the NEWS_NEUTRALITY ledger wiring.
    setStatus(
      'Neutrality Check is wired visually. Next step: connect this form to your studio chat endpoint with a dedicated neutrality mode.'
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      {/* Studio header stub – uses simple layout so we don't depend on existing shells */}
      <header className="border-b border-slate-800 bg-slate-950/95 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Studio · Neutrality Tools
            </p>
            <h1 className="text-sm font-semibold text-slate-50">
              Neutrality Check
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span className="rounded-full border border-emerald-700/70 bg-emerald-900/30 px-3 py-1 font-medium text-emerald-200">
              All memberships: full neutrality access
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 lg:flex-row lg:py-8">
        {/* Left: scoring explainer & ledger framing */}
        <section className="w-full space-y-4 lg:w-[46%]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="text-sm font-semibold text-slate-50">
              What this workspace does
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              Neutrality Check is Solace&apos;s dedicated lane for news
              analysis. Paste a draft or URL, and she will generate a structured
              briefing:
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
              <li>• Neutral summary and key factual bullets.</li>
              <li>• Stakeholders, timelines, and missing context.</li>
              <li>• Disputed claims and potential omissions.</li>
              <li>• Bias components and a Predictability Index.</li>
            </ul>
            <p className="mt-2 text-[11px] text-slate-400">
              All results are logged into the News Neutrality ledger for this
              workspace, so you can audit changes over time.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-200">
            <h3 className="mb-2 text-xs font-semibold text-slate-50">
              Grading system (publicly disclosed)
            </h3>
            <ul className="space-y-1.5">
              <li>
                <span className="font-semibold text-slate-100">
                  Bias language score (0–3)
                </span>{' '}
                – how emotionally or morally loaded the wording is.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  Bias source score (0–3)
                </span>{' '}
                – whether sources are balanced, verified, and fairly chosen.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  Bias framing &amp; context (0–3)
                </span>{' '}
                – whether the story acknowledges key context and trade-offs.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  Bias intent score (0–3)
                </span>{' '}
                – combined signal of “is this trying to steer the reader?”.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  Predictability Index (0–1)
                </span>{' '}
                – how reliably the outlet or story stays fact-first over time.
              </li>
            </ul>
            <p className="mt-2 text-[11px] text-slate-400">
              Bias is treated symmetrically — left, right, or otherwise. The
              goal is self-correction, not shaming.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-200">
            <h3 className="mb-1 text-xs font-semibold text-slate-50">
              For journalists &amp; editors
            </h3>
            <p className="mb-1">
              Use this tool as a private safety rail before publication. You
              can:
            </p>
            <ul className="mb-1 space-y-1">
              <li>• Run drafts without storing the raw text (if desired).</li>
              <li>• Compare neutrality across outlets or beats.</li>
              <li>• Export summaries for your internal standards team.</li>
            </ul>
            <p className="text-[11px] text-slate-400">
              We&apos;ll also surface an anonymized, outlet-level dashboard on
              the public site so the industry can see where it&apos;s drifting.
            </p>
          </div>
        </section>

        {/* Right: Solace chat & submission form */}
        <section className="w-full lg:w-[54%]">
          <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-sky-900/20">
            {/* Chat header */}
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Solace · Neutrality Host
                </p>
                <p className="text-xs text-slate-300">
                  Ask 1–2 questions, then submit an article for a full
                  neutrality brief.
                </p>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/90 text-xs font-bold text-slate-950">
                S
              </span>
            </div>

            {/* Welcome bubble */}
            <div className="mb-3 space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200">
              <p className="font-semibold text-slate-50">
                “Let&apos;s stress-test this story together.”
              </p>
              <p>
                Before you hit publish, tell me what you&apos;re aiming for and
                paste the draft or URL. I&apos;ll highlight bias, framing, and
                missing context — and we&apos;ll keep a ledger entry so you can
                show your editor how the piece evolved.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3">
              <label className="block text-xs font-medium text-slate-300">
                Optional question or instructions
                <textarea
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/40 focus:border-sky-500 focus:ring-2"
                  rows={2}
                  placeholder='Example: "I want this to stay neutral on gun policy while still naming the victims clearly."'
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </label>

              <label className="block text-xs font-medium text-slate-300">
                Article URL
                <input
                  type="url"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/40 focus:border-sky-500 focus:ring-2"
                  placeholder="https://newsroom.example.com/your-story"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </label>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="h-px flex-1 bg-slate-700" />
                <span>or</span>
                <span className="h-px flex-1 bg-slate-700" />
              </div>

              <label className="block text-xs font-medium text-slate-300">
                Paste your draft
                <textarea
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-500/40 focus:border-sky-500 focus:ring-2"
                  rows={8}
                  placeholder="Paste your story. In future iterations you’ll be able to choose whether the raw text is stored, summarized, or discarded after scoring."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </label>

              <button
                type="submit"
                className="mt-1 inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
                disabled={!url && !text}
              >
                Run Neutrality Check with Solace
              </button>

              {status && (
                <p className="mt-1 text-[11px] leading-snug text-slate-300">
                  {status}{' '}
                  <span className="text-slate-400">
                    Once you&apos;re ready, we&apos;ll swap this message for a
                    live call into your /api/chat route in “Neutrality” mode.
                  </span>
                </p>
              )}

              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-[11px] text-slate-300">
                <p className="mb-1 font-semibold text-slate-100">
                  Membership note
                </p>
                <p className="mb-1">
                  Any active Moral Clarity AI membership unlocks full Neutrality
                  tools — scoring, timelines, ledgers, and export. There is no
                  “pay more for truth” tier.
                </p>
                <p className="text-slate-400">
                  Want to see the public outlet-level dashboard?{' '}
                  <Link
                    href="/neutrality-check"
                    className="text-sky-400 underline-offset-2 hover:underline"
                  >
                    Visit the public Neutrality page
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
