// app/newsroom/components/AnchorPanel.tsx
"use client";

import { useState } from "react";
import type { NewsDigestStory } from "../types";

type DigestResponse = {
  ok: boolean;
  count: number;
  stories: NewsDigestStory[];
  route_started_at?: string;
  route_finished_at?: string;
  workspaceId?: string;
  userKey?: string;
};

export default function AnchorPanel() {
  const [stories, setStories] = useState<NewsDigestStory[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  const selectedStory =
    stories.find((s) => s.ledger_id === selectedId) ?? stories[0] ?? null;

  async function loadDigest() {
    setLoading(true);
    setLoadError(null);
    setStories([]);
    setSelectedId(null);
    try {
      const res = await fetch("/api/public/news-digest?limit=10", {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: DigestResponse = await res.json();
      if (!data.ok) {
        throw new Error(data as any);
      }
      setStories(data.stories || []);
      if (data.stories && data.stories.length > 0) {
        setSelectedId(data.stories[0].ledger_id);
      }
    } catch (err: any) {
      setLoadError(
        err?.message || "Failed to load digest. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  }

  async function askSolace() {
    if (!question.trim()) return;
    setAsking(true);
    setAnswer("");
    try {
      const res = await fetch("/api/solace-news/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "anchor",
          question,
          // give Solace structured context; backend can ignore if not used
          digest: stories,
          focus_story: selectedStory,
        }),
      });
      const data = await res.json();
      setAnswer(data.text || "No response text returned.");
    } catch (err: any) {
      setAnswer(
        `⚠️ Error talking to Solace: ${
          err?.message || "please try again in a moment."
        }`
      );
    } finally {
      setAsking(false);
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-3xl font-serif">Neutral News Anchor</h2>

      {/* Load digest button */}
      <button
        className="bg-black text-white px-4 py-2 text-sm rounded disabled:opacity-60"
        onClick={loadDigest}
        disabled={loading}
      >
        {loading ? "Loading…" : "Load Daily Digest"}
      </button>

      {/* Errors */}
      {loadError && (
        <p className="text-sm text-red-500">{loadError}</p>
      )}

      {/* Digest list */}
      {stories.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-[2fr,3fr]">
          {/* Story list */}
          <div className="border rounded-md bg-neutral-950/40">
            <div className="border-b px-3 py-2 text-xs uppercase tracking-wide text-neutral-400">
              Today&apos;s digest
            </div>
            <ul className="max-h-80 overflow-auto text-sm">
              {stories.map((story) => (
                <li key={story.ledger_id}>
                  <button
                    onClick={() => setSelectedId(story.ledger_id)}
                    className={`w-full text-left px-3 py-2 border-b last:border-b-0 hover:bg-neutral-900 ${
                      selectedId === story.ledger_id
                        ? "bg-neutral-900"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs uppercase tracking-wide text-neutral-400">
                        {story.outlet || "Unknown outlet"}
                      </span>
                      {typeof story.bias_intent_score === "number" && (
                        <span className="text-[11px] rounded-full px-2 py-0.5 bg-neutral-800 text-neutral-200">
                          Intent: {story.bias_intent_score.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 font-medium">
                      {story.story_title || "(untitled story)"}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Selected story detail */}
          <div className="border rounded-md bg-neutral-950/40 p-4 text-sm">
            {selectedStory ? (
              <>
                <div className="text-xs uppercase tracking-wide text-neutral-400 mb-1">
                  Selected Story
                </div>
                <h3 className="font-semibold text-base mb-1">
                  {selectedStory.story_title}
                </h3>
                <p className="text-xs text-neutral-400 mb-3">
                  {selectedStory.outlet || "Unknown outlet"}{" "}
                  {selectedStory.story_url && (
                    <>
                      ·{" "}
                      <a
                        href={selectedStory.story_url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Original article
                      </a>
                    </>
                  )}
                </p>

                {selectedStory.neutral_summary && (
                  <>
                    <h4 className="font-semibold text-xs uppercase tracking-wide text-neutral-400 mb-1">
                      Neutral summary
                    </h4>
                    <p className="whitespace-pre-wrap mb-3">
                      {selectedStory.neutral_summary}
                    </p>
                  </>
                )}

                {selectedStory.key_facts && (
                  <>
                    <h4 className="font-semibold text-xs uppercase tracking-wide text-neutral-400 mb-1">
                      Key facts
                    </h4>
                    <p className="whitespace-pre-wrap mb-3">
                      {selectedStory.key_facts}
                    </p>
                  </>
                )}
              </>
            ) : (
              <p className="text-neutral-400">
                Load the daily digest, then select a story to see details.
              </p>
            )}
          </div>
        </div>
      ) : (
        !loading &&
        !loadError && (
          <p className="text-sm text-neutral-500">
            No digest loaded yet. Click &ldquo;Load Daily Digest&rdquo; to pull
            the latest scored stories.
          </p>
        )
      )}

      {/* Question box */}
      <div className="mt-4 flex flex-col gap-3">
        <textarea
          className="border rounded p-3 w-full text-sm bg-neutral-950/60"
          rows={4}
          placeholder={
            selectedStory
              ? "Ask Solace about this story, the outlet’s pattern, or what might be missing…"
              : "Ask Solace about today’s digest…"
          }
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          className="bg-neutral-800 text-white px-4 py-2 text-sm rounded self-start disabled:opacity-60"
          onClick={askSolace}
          disabled={asking || !question.trim()}
        >
          {asking ? "Asking…" : "Ask Solace"}
        </button>
      </div>

      {/* Solace answer */}
      {answer && (
        <div className="bg-neutral-950/60 border rounded p-4 text-sm">
          <h3 className="font-semibold mb-2">Solace Response</h3>
          <p className="whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </section>
  );
}
