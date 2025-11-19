/* app/(studio)/solace/on-air/page.tsx */

"use client";

import { useEffect, useState } from "react";
import BiasFingerprintChart from "@/components/news/BiasFingerprintChart";
import { DailyNeutralDigestCard, type NewsDigestItem } from "@/components/news/DailyNeutralDigestCard";

export default function SolaceOnAirPage() {
  const [stories, setStories] = useState<NewsDigestItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch digest for the teleprompter + fingerprint
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/public/news-digest?limit=20");
        const json = await res.json();
        if (json.ok) {
          const mapped = json.stories.map((s: any) => ({
            id: s.ledger_id,
            story_title: s.story_title,
            story_url: s.story_url,
            outlet: s.outlet,
            outlet_domain: new URL(s.story_url).hostname,
            category: s.category,
            published_at: s.created_at,

            neutral_summary: s.neutral_summary,
            key_facts: s.key_facts || [],

            context_background: s.context_background,
            stakeholder_positions: s.stakeholder_positions,
            timeline: s.timeline,
            disputed_claims: s.disputed_claims,
            omissions_detected: s.omissions_detected,

            bias_language_score: s.bias_language_score,
            bias_framing_score: s.bias_framing_score,
            bias_source_score: s.bias_source_score,
            bias_context_score: s.bias_context_score,
            bias_intent_score: s.bias_intent_score,
            pi_score: s.pi_score,
          }));

          setStories(mapped);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const active = stories[activeIndex];

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_12px_2px_rgba(16,185,129,0.6)]"></div>
            <span className="font-semibold text-emerald-400 tracking-wide">
              Solace — On Air
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Ledger-Locked · Neutral-Mode · No Web Access
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 p-6 md:grid-cols-3">
        {/* LEFT COLUMN — TELEPROMPTER + STORY */}
        <div className="flex flex-col gap-4 md:col-span-2">
          {/* Teleprompter */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-50">
              Teleprompter
            </h2>
            {loading && (
              <div className="text-sm text-slate-500">Loading stories…</div>
            )}

            {!loading && !active && (
              <div className="text-sm text-slate-500">
                No stories available in the digest.
              </div>
            )}

            {active && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">{active.story_title}</h3>

                <p className="text-base leading-relaxed text-slate-200">
                  {active.neutral_summary}
                </p>

                <div className="space-y-1">
                  <p className="text-xs uppercase text-slate-500 font-semibold tracking-wide">
                    Key Facts
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-300">
                    {active.key_facts.slice(0, 4).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Full Story Card */}
          {active && (
            <div>
              <DailyNeutralDigestCard item={active} />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — BIAS + CONTROLS */}
        <div className="flex flex-col gap-4">
          {/* Bias Fingerprint */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
            <h3 className="mb-3 text-sm font-semibold text-slate-200">
              Bias Fingerprint
            </h3>

            {active ? (
              <BiasFingerprintChart
                language={active.bias_language_score}
                framing={active.bias_framing_score}
                source={active.bias_source_score}
                context={active.bias_context_score}
                intent={active.bias_intent_score}
                size={240}
              />
            ) : (
              <div className="text-sm text-slate-500">No data.</div>
            )}
          </div>

          {/* Anchor Controls */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-200">
              Anchor Controls
            </h3>

            <label className="text-xs text-slate-400">
              Select Story
              <select
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800/80 px-2 py-1 text-sm text-slate-100 focus:border-emerald-400"
                value={activeIndex}
                onChange={(e) => setActiveIndex(Number(e.target.value))}
              >
                {stories.map((s, i) => (
                  <option key={s.id} value={i}>
                    {i + 1}. {s.outlet} — {s.story_title.slice(0, 40)}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Scroll Teleprompter to Top
            </button>
          </div>

          {/* Lower Third (Ticker) */}
          {active && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
              <div className="mb-1 text-xs font-semibold uppercase text-slate-500">
                Lower Third
              </div>

              <div className="rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-200">
                {active.outlet} • {active.category || "News"} •{" "}
                {active.story_title}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
