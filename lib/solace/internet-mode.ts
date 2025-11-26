// lib/solace/internet-mode.ts

import { buildSolaceSystemPrompt } from "./persona";
import type { SolaceDomain } from "./persona";

/* -------------------------------------------------------
   INTERNET MODE — shared instructions for any route
-------------------------------------------------------- */

const INTERNET_MODE_EXTRAS = `
INTERNET MODE — Solace

You are evaluating information retrieved from the web.

READ THIS CAREFULLY:
- When SEARCH_RESULTS or WEBSITE_SNAPSHOT is provided, it *is your window* into the web.
- You MUST NOT say “I cannot browse the internet”.
- You MUST anchor your answer in SEARCH_RESULTS.
- When evidence is thin, partial, inconsistent, or missing — state limits clearly.
- When evidence is rich — synthesize cleanly and proportionally.

Tone:
- Analytical, factual, non-speculative.
- No hype, no fluff.
- No boilerplate disclaimers.
`.trim();

/* -------------------------------------------------------
   System builder
-------------------------------------------------------- */

/**
 * Unified builder for internet-mode system prompts.
 *
 * Signature MUST be:
 *    buildInternetSystemPrompt(extras?: string)
 *
 * NOT the older 2-argument variant.
 */
export function buildInternetSystemPrompt(extras?: string): string {
  const mergedExtras = [INTERNET_MODE_EXTRAS, extras?.trim() || ""]
    .filter(Boolean)
    .join("\n\n---\n\n");

  // Internet evaluations always run in GUIDANCE mode.
  const domain: SolaceDomain = "guidance";

  return buildSolaceSystemPrompt(domain, mergedExtras);
}

