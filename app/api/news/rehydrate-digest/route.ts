// app/api/news/rehydrate-digest/route.ts
// Rehydrate Neutral News Digest summaries + key facts
//
// This worker:
// 1) Reads a small batch of stories from solace_news_digest_view
//    whose neutral_summary is clearly low-quality / placeholder.
// 2) Fetches the article content from story_url.
// 3) Uses OpenAI to generate a neutral summary + key facts.
// 4) Writes the improved fields back to the base truth table.
// 5) Returns a small JSON report with updated / skipped / errors.
//
// IMPORTANT:
// - This assumes your underlying writable table is `truth_facts` with PK `id`
//   matching `truth_fact_id` in the view. If your schema differs, adjust
//   the `updateBaseTableForRow` function accordingly.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getOpenAI } from "@/lib/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ========= ENV / CLIENTS ========= */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function createSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

/* ========= TYPES ========= */

type DigestViewRow = {
  ledger_id: string;
  truth_fact_id: string | null;
  story_title: string | null;
  story_url: string | null;
  outlet: string | null;
  neutral_summary: string | null;
  key_facts: any;
  bias_language_score: number | null;
  bias_source_score: number | null;
  bias_framing_score: number | null;
  bias_context_score: number | null;
  bias_intent_score: number | null;
  pi_score: number | null;
  created_at: string | null;
  day: string | null;
  day_iso: string | null;
};

type SummarizationResult = {
  summary: string;
  keyFacts: string[];
};

/* ========= SMALL UTILS ========= */

function isPlaceholderSummary(s: string | null | undefined): boolean {
  if (!s) return true;
  const trimmed = s.trim();
  if (!trimmed) return true;

  // Explicit placeholder pattern we saw in the CSV
  if (/^Neutral baseline summary placeholder/i.test(trimmed)) return true;

  // If it's extremely short, treat as low-quality
  if (trimmed.length < 160) return true;

  return false;
}

function stripHtmlToText(html: string): string {
  // Extremely simple HTML → text stripper.
  // You can replace this with a proper article extractor if you like.
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|br|h[1-6]|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function fetchArticleText(url: string): Promise<string> {
  if (!url) return "";

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "MCAI-SolaceNews/1.0 (+https://moralclarity.ai)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const html = await res.text();
    const text = stripHtmlToText(html);

    return text;
  } catch (err) {
    console.error("[rehydrate-digest] fetchArticleText error", url, err);
    return "";
  }
}

async function summarizeArticleText(
  articleText: string
): Promise<SummarizationResult | null> {
  if (!articleText || articleText.length < 400) {
    return null;
  }

  const openai = await getOpenAI();

  const trimmed = articleText.slice(0, 12_000); // avoid massive prompts

  const prompt = `
You are a neutral news summarizer.

Task:
1. Read the article text below.
2. Write a neutral, bias-removed summary in 5–8 sentences.
3. Extract 4–8 short "key facts" as bullet phrases (no more than 25 words each).

Constraints:
- Do NOT add new facts, names, numbers, or quotes that are not supported by the text.
- If something is unclear or missing, leave it out instead of guessing.
- Avoid emotionally charged language or persuasion.

Return your answer as a single JSON object exactly in this shape:

{
  "summary": "<5-8 sentence neutral summary>",
  "key_facts": [
    "<fact 1>",
    "<fact 2>",
    "<fact 3>"
  ]
}

Article text:
"""${trimmed}"""
  `.trim();

  try {
    const resp = await openai.responses.create({
      model: OPENAI_MODEL,
      input: prompt,
      max_output_tokens: 512,
      temperature: 0.2,
    });

    const raw = (resp as any).output_text?.trim() || "";
    if (!raw) return null;

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Try to salvage JSON from within the text if the model wraps it
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) return null;
      parsed = JSON.parse(match[0]);
    }

    const summary = String(parsed.summary || "").trim();
    const keyFactsRaw = Array.isArray(parsed.key_facts)
      ? parsed.key_facts
      : [];

    const keyFacts = keyFactsRaw.map((f: any) => String(f).trim()).filter(Boolean);

    if (!summary) return null;

    return {
      summary,
      keyFacts,
    };
  } catch (err) {
    console.error("[rehydrate-digest] summarizeArticleText error", err);
    return null;
  }
}

/**
 * Update the base table row for this digest entry.
 *
 * ASSUMPTION:
 * - Your writable table is `truth_facts`
 * - It has PK `id` that matches `truth_fact_id` from the view.
 *
 * If your schema is different, adjust the table name and .eq() column.
 */
async function updateBaseTableForRow(
  supabase: ReturnType<typeof createSupabaseAdmin>,
  row: DigestViewRow,
  payload: SummarizationResult
) {
  if (!row.truth_fact_id) {
    throw new Error("Row has no truth_fact_id");
  }

  const { error } = await supabase!
    .from("truth_facts")
    .update({
      neutral_summary: payload.summary,
      key_facts: JSON.stringify(payload.keyFacts),
    })
    .eq("id", row.truth_fact_id);

  if (error) {
    throw error;
  }
}

/* ========= HANDLER ========= */

export async function POST(req: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        error:
          "Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 500 }
    );
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase client initialization failed." },
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const limitParam = url.searchParams.get("limit");
  const limit = Math.min(
    Math.max(Number(limitParam || 8) || 8, 1),
    25
  ); // 1–25 per run

  // 1) Fetch candidate rows from the view
  const { data, error } = await supabase
    .from("solace_news_digest_view")
    .select(
      `
      ledger_id,
      truth_fact_id,
      story_title,
      story_url,
      outlet,
      neutral_summary,
      key_facts,
      bias_language_score,
      bias_source_score,
      bias_framing_score,
      bias_context_score,
      bias_intent_score,
      pi_score,
      created_at,
      day,
      day_iso
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit * 3); // pull a bit extra, we'll filter placeholders in code

  if (error) {
    console.error("[rehydrate-digest] select from view failed", error);
    return NextResponse.json(
      { error: "Failed to load digest view rows." },
      { status: 500 }
    );
  }

  const rows: DigestViewRow[] = (data || []) as any[];

  // Filter to those that actually need rehydration
  const candidates = rows.filter((r) => isPlaceholderSummary(r.neutral_summary));

  const toProcess = candidates.slice(0, limit);

  const updated: any[] = [];
  const skipped: any[] = [];
  const errors: any[] = [];

  for (const row of toProcess) {
    const idLabel = row.truth_fact_id || row.ledger_id;

    try {
      if (!row.story_url) {
        skipped.push({ id: idLabel, reason: "no story_url" });
        continue;
      }

      const articleText = await fetchArticleText(row.story_url);
      if (!articleText || articleText.length < 400) {
        skipped.push({ id: idLabel, reason: "no usable article text" });
        continue;
      }

      const summarization = await summarizeArticleText(articleText);
      if (!summarization) {
        skipped.push({ id: idLabel, reason: "summarization failed" });
        continue;
      }

      await updateBaseTableForRow(supabase, row, summarization);

      updated.push({
        id: idLabel,
        outlet: row.outlet,
        story_title: row.story_title,
        url: row.story_url,
      });
    } catch (err: any) {
      console.error("[rehydrate-digest] per-row error", err);
      errors.push({
        id: idLabel,
        error: err?.message || String(err),
      });
    }
  }

  return NextResponse.json({
    ok: true,
    requested_limit: limit,
    scanned_rows: rows.length,
    candidates: candidates.length,
    updated_count: updated.length,
    skipped_count: skipped.length,
    error_count: errors.length,
    updated,
    skipped,
    errors,
  });
}
