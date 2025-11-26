// lib/solace/internet-mode.ts

import { buildSolaceSystemPrompt, type SolaceDomain } from "./persona";

/**
 * Base block that anchors any web / internet–assisted reasoning.
 * This is appended as extras on top of the core Solace persona.
 */
const INTERNET_CONTEXT = `
INTERNET / WEB CONTEXT MODE

You are helping the user evaluate or understand information retrieved from the web.

You may be given:
- A URL the user cares about.
- A RESEARCH CONTEXT block with bullets from search results.
- A WEBSITE SNAPSHOT or NEWS CONTEXT supplied by the backend.

Rules:
- Treat provided web context as your factual window; do NOT claim live browsing.
- Never say "I can't browse the internet" when RESEARCH CONTEXT or WEBSITE SNAPSHOT is present.
- If the context is thin, say what is missing and what you would look for, but stay grounded in what you have.
- Focus on clarity, signal extraction, bias/quality assessment, and practical next steps for the user.
`.trim();

/**
 * Build a system prompt for web/internet–anchored queries.
 *
 * - Domain is fixed to "guidance" (decision support / evaluation).
 * - `extras` lets the caller add narrow task instructions specific to a route.
 */
export function buildInternetSystemPrompt(extras?: string): string {
  const lines: string[] = [INTERNET_CONTEXT];

  if (extras && extras.trim()) {
    lines.push(extras.trim());
  }

  const mergedExtras = lines.join("\n\n---\n\n");

  // We keep this in GUIDANCE by default: web is usually used to decide / evaluate.
  return buildSolaceSystemPrompt("guidance", mergedExtras);
}
