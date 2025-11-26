// lib/solace/chat-system.ts
// Clean unified version — optimized for stability and minimal drift.

import type { SolaceDomain } from "@/lib/solace/persona";

/* -------------------------------------------------------
   BASIC TEXT HELPERS
-------------------------------------------------------- */

export function trimConversation(messages: any[]): any[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .map((m) => ({
      role: m.role || "user",
      content: typeof m.content === "string" ? m.content.trim() : "",
    }))
    .filter((m) => m.content.length > 0)
    .slice(-40);
}

export function normalizeFilters(filters: string[]): string[] {
  if (!Array.isArray(filters)) return [];
  return filters
    .map((f) => String(f).trim().toLowerCase())
    .filter(Boolean);
}

/* -------------------------------------------------------
   MODE DETECTION
-------------------------------------------------------- */

export function wantsSecular(messages: any[]): boolean {
  const last = [...messages].reverse().find((m) => m.role === "user");
  if (!last) return false;
  const text = last.content.toLowerCase();

  return /\b(secular|non-religious|no ministry)\b/.test(text);
}

export function extractFirstUrl(text: string | null): string | null {
  if (!text) return null;
  const m = text.match(/https?:\/\/[^\s]+/i);
  return m ? m[0] : null;
}

export function wantsImageGeneration(text: string | null): boolean {
  if (!text) return false;
  return /^img:\s*/i.test(text) || /\b(generate|make)\s+(an?|the)\s+image\b/i.test(text);
}

export function wantsDeepResearch(text: string | null): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  return (
    /\bdeep\s+research\b/.test(t) ||
    /\blookup\b/.test(t) ||
    /\bsearch\b/.test(t) ||
    extractFirstUrl(text) !== null
  );
}

export function looksLikeGenericNewsQuestion(text: string | null): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  return /\bnews\b/.test(t) && !/\bheadline(s)?\b/.test(t);
}

/* -------------------------------------------------------
   ROUTE MODE
   Handles "Guidance", "Neutral", "Create", "Red Team", etc.
-------------------------------------------------------- */

export function routeMode(
  lastUser: string,
  opts: { lastMode?: string } = {}
): { mode: SolaceDomain; confidence: number } {
  const t = (lastUser || "").toLowerCase();

  // Explicit newsroom triggers
  if (/\b(news|headlines|digest|what's happening)\b/.test(t)) {
    return { mode: "newsroom", confidence: 0.9 };
  }

  // Guidance triggers
  if (
    /\b(should i|what do you recommend|help me think|i need advice|next steps)\b/.test(t)
  ) {
    return { mode: "guidance", confidence: 0.85 };
  }

  // Ministry triggers
  if (/\b(pray|scripture|faith|mercy|abrahamic)\b/.test(t)) {
    return { mode: "ministry", confidence: 0.8 };
  }

  // Fallback to core
  return { mode: "core", confidence: 0.6 };
}

