// lib/solace/chat-system.ts
// Fully rewritten for Solace Persona v7-CPL (Adaptive Creativity Layer Integration)

import { buildSolaceSystemPrompt, type SolaceDomain } from "@/lib/solace/persona";

/* -------------------------------------------------------
   Utility Helpers: Filters, Trimming, Secular Requests
-------------------------------------------------------- */

export function normalizeFilters(filters: unknown): string[] {
  if (!Array.isArray(filters)) return [];
  return filters
    .map((f) => String(f ?? "").toLowerCase().trim())
    .filter(Boolean);
}

export function trimConversation(messages: Array<{ role: string; content: string }>) {
  const MAX_TURNS = 5;
  const limit = MAX_TURNS * 2;
  return messages.length <= limit ? messages : messages.slice(-limit);
}

export function wantsSecular(messages: Array<{ role: string; content: string }>) {
  const text = messages.slice(-6).map((m) => m.content).join(" ").toLowerCase();
  return /\bsecular framing\b|\bsecular only\b|\bno scripture\b|\bno religious\b|\bkeep it secular\b|\bstrictly secular\b/.test(
    text
  );
}

/* -------------------------------------------------------
   Image Generation Detection
-------------------------------------------------------- */

export function wantsImageGeneration(text: string) {
  const t = (text || "").toLowerCase().trim();
  if (!t) return false;

  const lineCount = t.split("\n").length;
  if (lineCount > 20) return t.startsWith("img:");

  if (t.startsWith("img:")) return true;

  const patterns = [
    /^generate (an )?image\b/,
    /^create (an )?image\b/,
    /^make (an )?image\b/,
    /^draw (a )?diagram\b/,
    /^make (a )?visual\b/,
    /^create (a )?diagram\b/,
    /^design (a )?diagram\b/,
  ];

  return patterns.some((rx) => rx.test(t));
}

/* -------------------------------------------------------
   URL Detection & Deep Research Detection
-------------------------------------------------------- */

const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;

export function extractFirstUrl(text: string): string | null {
  if (!text) return null;
  const match = text.match(URL_REGEX);
  return match ? match[0] : null;
}

export function wantsDeepResearch(text: string): boolean {
  const t = (text || "").toLowerCase();
  if (!t.trim()) return false;

  const keys = [
    "deep research",
    "full research",
    "full analysis",
    "deep dive",
    "research this",
    "investigate this",
    "evaluate this website",
    "evaluate this site",
    "analyze this website",
    "analyze this site",
    "ux review",
    "seo review",
    "is this site legit",
    "is this website legit",
  ];

  if (keys.some((k) => t.includes(k))) return true;
  if (URL_REGEX.test(text)) return true;

  return false;
}

/* -------------------------------------------------------
   Generic News Query Detection
-------------------------------------------------------- */

export function looksLikeGenericNewsQuestion(text: string): boolean {
  const t = (text || "").toLowerCase();
  if (!t.trim()) return false;

  const patterns = [
    /\bwhat\s+is\s+the\s+news\s+today\b/,
    /\bwhat'?s\s+the\s+news\s+today\b/,
    /\bnews\s+today\b/,
    /\btoday'?s\s+news\b/,
    /\btop\s+news\s+today\b/,
    /\btop\s+stories\s+today\b/,
    /\blatest\s+news\b/,
    /\bus\s+news\s+today\b/,
    /\blatest\s+u\.s\.\s+news\b/,
    /\bheadlines\s+today\b/,
  ];

  return patterns.some((rx) => rx.test(t));
}

/* -------------------------------------------------------
   Turn Detection & Emotional/Moral Cues
-------------------------------------------------------- */

function isFirstRealTurn(messages: Array<{ role: string; content: string }>) {
  const users = messages.filter((m) => m.role?.toLowerCase() === "user").length;
  const assistants = messages.filter((m) => m.role?.toLowerCase() === "assistant").length;
  return users <= 1 || messages.length < 3 || assistants === 0;
}

function hasEmotionalOrMoralCue(text: string) {
  const t = (text || "").toLowerCase();

  const emotional = [
    "hope", "lost", "afraid", "fear", "anxious", "grief",
    "sad", "sorrow", "depressed", "stress", "overwhelmed",
    "lonely", "comfort", "forgive", "forgiveness",
    "guilt", "shame", "purpose", "meaning", "broken",
  ];

  const moral = [
    "right", "wrong", "unfair", "injustice", "justice",
    "truth", "honest", "dishonest", "integrity",
    "mercy", "compassion", "courage", "sin",
  ];

  return emotional.some((w) => t.includes(w)) || moral.some((w) => t.includes(w));
}

/* -------------------------------------------------------
   Scripture Policy (Minimal — CPL handles creativity)
-------------------------------------------------------- */

function scripturePolicyText(opts: {
  wantsAbrahamic: boolean;
  forceFirstTurnSeeding: boolean;
  userAskedForSecular: boolean;
}) {
  const base = `SCRIPTURE POLICY
- Only short references allowed (e.g., "Matthew 5", "Qur'an 4:135").
- Never long quotations.`;

  if (!opts.wantsAbrahamic || opts.userAskedForSecular)
    return base + `\n- Abrahamic layer DISABLED (secular framing).`;

  if (opts.forceFirstTurnSeeding)
    return base + `\n- On first emotional turn: allow ONE gentle reference, then restrict.`;

  return base + `\n- Use sparingly; only when clearly helpful or requested.`;
}

/* -------------------------------------------------------
   Persona Wiring (Core Integration w/ v7-CPL Persona)
-------------------------------------------------------- */

export function buildChatPersonaPrompt(opts: {
  filters: string[];
  messages: Array<{ role: string; content: string }>;
  userWantsSecular: boolean;
  routeMode: string;
}) {
  const { filters, messages, userWantsSecular, routeMode } = opts;

  const wantsAbrahamic =
    filters.includes("abrahamic") || filters.includes("ministry");

  const wantsGuidance =
    filters.includes("guidance") || routeMode === "Guidance";

  const lastUser = [...messages]
    .reverse()
    .find((m) => m.role?.toLowerCase() === "user")?.content ?? "";

  const firstTurn = isFirstRealTurn(messages);
  const forceFirstTurnSeeding =
    wantsAbrahamic &&
    !userWantsSecular &&
    firstTurn &&
    hasEmotionalOrMoralCue(lastUser);

  /* ---- Time Anchoring ---- */
  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  const year = iso.slice(0, 4);

  const TIME_ANCHOR = `TIME & CONTEXT
- Today is ${iso}.
- If asked for the current year: ${year}.
- For any post-cutoff events: require WEB/RESEARCH/NEWS CONTEXT.
- Never invent post-cutoff information.`;

  /* ---- Scripture Policy ---- */
  const scripturePolicy = scripturePolicyText({
    wantsAbrahamic,
    forceFirstTurnSeeding,
    userAskedForSecular: userWantsSecular,
  });

  /* -------------------------------------------------------
     Extras Block (Minimal; CPL replaces redundant rules)
  -------------------------------------------------------- */

  const extras = [
    TIME_ANCHOR,
    scripturePolicy,
    `WEB LIMITS
- Never say "I can't browse the internet."
- Always describe what context you DO have (snapshot, research, digest).`,
    `RESPONSE STYLE
- Default: brief, precise, structured.
- Only expand when asked.
- Never fabricate; state uncertainty clearly.`,
  ].join("\n\n---\n\n");

  /* ---- Domain Mapping ---- */
  const domain: SolaceDomain = wantsGuidance
    ? "guidance"
    : wantsAbrahamic
    ? "ministry"
    : "core";

  const systemBase = buildSolaceSystemPrompt(domain, extras);

  return {
    systemBase,
    wantsAbrahamic,
    forceFirstTurnSeeding,
    domain,
  };
}

