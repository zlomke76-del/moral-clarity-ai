"use client";

import { useEffect, useState, FormEvent } from "react";

/* ========= TYPES ========= */

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

interface NewsDigestStory {
  ledger_id: string;
  story_title: string | null;
  story_url: string | null;
  outlet: string | null;
  neutral_summary: string | null;
  key_facts: string | null;
  bias_intent_score: number | null;
  pi_score: number | null;
  created_at: string | null;
}

interface OutletNeutralityRow {
  outlet: string;
  outlet_normalized: string;
  total_stories: number;
  avg_bias_intent_score: number;
  avg_pi_score: number;
  min_bias_intent_score: number;
  max_bias_intent_score: number;
  first_seen_at: string | null;
  last_seen_at: string | null;
}

/* ========= SMALL HELPERS ========= */

function formatTime(ts: string) {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function biasIntentLabel(score: number | null): string {
  if (score === null || Number.isNaN(score)) return "n/a";
  if (score < -0.4) return "leans left";
  if (score < -0.1) return "slightly left";
  if (score <= 0.1) return "near neutral";
  if (score <= 0.4) return "slightly right";
  return "leans right";
}

/* ========= MAIN COMPONENT ========= */

export default function SolaceNewsClient() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "intro",
      role: "assistant",
      content:
        "You’re at the Solace News Desk.\n\nAsk me to summarize today’s headlines, compare outlet bias, or paste an article draft for a neutral critique and rewrite.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [digest, setDigest] = useState<NewsDigestStory[]>([]);
  const [outlets, setOutlets] = useState<OutletNeutralityRow[]>([]);
  const [loadingSidebar, setLoadingSidebar] = useState(true);
  const [errorSidebar, setErrorSidebar] = useState<string | null>(null);

  /* ===== Load digest + outlet scores on mount ===== */
  useEffect(() => {
    let alive = true;

    async function loadSidebar() {
      setLoadingSidebar(true);
      setErrorSidebar(null);
      try {
        const [digestRes, outletRes] = await Promise.all([
          fetch("/api/public/news-digest?limit=12"),
          fetch("/api/public/outlet-neutrality?min_stories=3&limit=50"),
        ]);

        if (!alive) return;

        if (!digestRes.ok) {
          throw new Error(`Digest error ${digestRes.status}`);
        }
        if (!outletRes.ok) {
          throw new Error(`Outlet error ${outletRes.status}`);
        }

        const digestJson = await digestRes.json();
        const outletJson = await outletRes.json();

        const stories = Array.isArray(digestJson?.stories)
          ? (digestJson.stories as any[])
          : [];

        const outletsArr = Array.isArray(outletJson?.outlets)
          ? (outletJson.outlets as any[])
          : [];

        const mappedStories: NewsDigestStory[] = stories.map((s) => ({
          ledger_id: String(s.ledger_id ?? ""),
          story_title: s.story_title ?? null,
          story_url: s.story_url ?? null,
          outlet: s.outlet ?? null,
          neutral_summary: s.neutral_summary ?? null,
          key_facts: s.key_facts ?? null,
          bias_intent_score:
            typeof s.bias_intent_score === "number" ? s.bias_intent_score : null,
          pi_score: typeof s.pi_score === "number" ? s.pi_score : null,
          created_at: s.created_at ?? null,
        }));

        const mappedOutlets: OutletNeutralityRow[] = outletsArr.map((o) => ({
          outlet: o.outlet ?? o.outlet_normalized ?? "unknown",
          outlet_normalized: o.outlet_normalized ?? o.outlet ?? "unknown",
          total_stories: Number(o.total_stories ?? 0),
          avg_bias_intent_score: Number(o.avg_bias_intent_score ?? 0),
          avg_pi_score: Number(o.avg_pi_score ?? 0),
          min_bias_intent_score: Number(o.min_bias_intent_score ?? 0),
          max_bias_intent_score: Number(o.max_bias_intent_score ?? 0),
          first_seen_at: o.first_seen_at ?? null,
          last_seen_at: o.last_seen_at ?? null,
        }));

        setDigest(mappedStories);
        setOutlets(mappedOutlets);
      } catch (err: any) {
        console.error("[SolaceNewsClient] sidebar load error", err);
        if (alive) {
          setErrorSidebar(
            err?.message || "Failed to load digest / outlet data."
          );
        }
      } finally {
        if (alive) setLoadingSidebar(false);
      }
    }

    loadSidebar();

    return () => {
      alive = false;
    };
  }, []);

  /* ===== Handle chat submit ===== */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const now = new Date().toISOString();
    const userMsg: ChatMessage = {
      id: `u-${now}`,
      role: "user",
      content: trimmed,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const payloadMessages = messages
        .concat(userMsg)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/solace-news/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`API ${res.status}: ${txt}`);
      }

      const json = await res.json().catch(() => ({}));
      const text: string =
        typeof json?.text === "string"
          ? json.text
          : "[No response text from Solace News API]";

      const solMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: text,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, solMsg]);
    } catch (err: any) {
      console.error("[SolaceNewsClient] chat error", err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "⚠️ There was a problem reaching the Solace News API. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  /* ========= RENDER ========= */

  return (
    <div className="grid gap-4 md:gap-6 lg:gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.25fr)] h-full">
      {/* LEFT: CHAT */}
      <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm min-h-[60vh]">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">
              Solace News Chat
            </h2>
            <p className="text-xs text-slate-400">
              Ask for summaries, outlet comparisons, or article coaching.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] md:max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-sky-500 text-slate-900 rounded-br-sm"
                    : "bg-slate-800 text-slate-100 rounded-bl-sm"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wide text-slate-300/70">
                    {m.role === "user" ? "You" : "Solace"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatTime(m.timestamp)}
                  </span>
                </div>
                <div>{m.content}</div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-slate-800 px-3 py-2 flex items-end gap-2"
        >
          <textarea
            className="flex-1 resize-none rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 max-h-32"
            rows={2}
            placeholder="e.g. “Give me a neutral summary of today’s top US stories.” or paste an article draft for coaching."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Thinking…" : "Send"}
          </button>
        </form>
      </div>

      {/* RIGHT: DIGEST + OUTLET BIAS */}
      <div className="space-y-4 md:space-y-5">
        {/* Digest */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Today&apos;s Neutral Digest
              </h2>
              <p className="text-xs text-slate-400">
                Ledger-scored, outlet-normalized headlines.
              </p>
            </div>
          </div>
          <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-800">
            {loadingSidebar && (
              <div className="px-4 py-3 text-xs text-slate-400">
                Loading digest…
              </div>
            )}
            {errorSidebar && !loadingSidebar && (
              <div className="px-4 py-3 text-xs text-amber-300">
                {errorSidebar}
              </div>
            )}
            {!loadingSidebar && !errorSidebar && digest.length === 0 && (
              <div className="px-4 py-3 text-xs text-slate-400">
                No scored stories available yet.
              </div>
            )}
            {digest.map((story) => (
              <article key={story.ledger_id} className="px-4 py-3 text-xs">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold leading-snug text-[13px]">
                    {story.story_title || "Untitled story"}
                  </h3>
                  {story.outlet && (
                    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-400">
                      {story.outlet}
                    </span>
                  )}
                </div>
                {story.neutral_summary && (
                  <p className="text-slate-300 text-[11px] leading-snug mb-1">
                    {story.neutral_summary}
                  </p>
                )}
                {story.story_url && (
                  <a
                    href={story.story_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-sky-400 hover:text-sky-300 underline"
                  >
                    Open original story
                  </a>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                  {typeof story.bias_intent_score === "number" && (
                    <span>
                      Intent: {story.bias_intent_score.toFixed(2)} (
                      {biasIntentLabel(story.bias_intent_score)})
                    </span>
                  )}
                  {typeof story.pi_score === "number" && (
                    <span>PI: {story.pi_score.toFixed(2)}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Outlet bias panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">
                Outlet Neutrality Scoreboard
              </h2>
              <p className="text-xs text-slate-400">
                Lifetime bias intent & predictability.
              </p>
            </div>
          </div>
          <div className="max-h-[260px] overflow-y-auto">
            {loadingSidebar && (
              <div className="px-4 py-3 text-xs text-slate-400">
                Loading outlets…
              </div>
            )}
            {!loadingSidebar && outlets.length === 0 && !errorSidebar && (
              <div className="px-4 py-3 text-xs text-slate-400">
                No outlet aggregates available yet.
              </div>
            )}
            {outlets.length > 0 && (
              <table className="w-full text-[11px]">
                <thead className="text-slate-400/80 sticky top-0 bg-slate-900/90 backdrop-blur-sm">
                  <tr>
                    <th className="text-left font-medium px-4 py-2">Outlet</th>
                    <th className="text-right font-medium px-2 py-2">Stories</th>
                    <th className="text-right font-medium px-2 py-2">
                      Avg Intent
                    </th>
                    <th className="text-right font-medium px-4 py-2">
                      PI Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {outlets.map((o) => (
                    <tr
                      key={o.outlet_normalized}
                      className="border-t border-slate-800/70"
                    >
                      <td className="px-4 py-1.5">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-100">
                            {o.outlet_normalized}
                          </span>
                          {o.outlet !== o.outlet_normalized && (
                            <span className="text-[10px] text-slate-500">
                              alias: {o.outlet}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-1.5 text-right text-slate-200">
                        {o.total_stories}
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        <span className="text-slate-200">
                          {o.avg_bias_intent_score.toFixed(2)}
                        </span>
                        <span className="ml-1 text-slate-500">
                          ({biasIntentLabel(o.avg_bias_intent_score)})
                        </span>
                      </td>
                      <td className="px-4 py-1.5 text-right text-slate-200">
                        {o.avg_pi_score.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Coaching hint */}
        <div className="text-[11px] text-slate-400">
          Tip: Paste a full article draft into the chat and ask,{" "}
          <span className="text-sky-300">
            “Critique this for bias and give me a neutral rewrite ready to send
            to an editor.”
          </span>
        </div>
      </div>
    </div>
  );
}
