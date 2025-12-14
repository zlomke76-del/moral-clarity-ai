// --------------------------------------------------------------
// Context & Epistemic Geometry Constants
// AUTHORITATIVE FOR: memory limits, research/news caps
// DO NOT import into model/router logic
// --------------------------------------------------------------

// --------------------------------------------------------------
// Long-Term Memory Retrieval Limits
// --------------------------------------------------------------

// Facts are intentionally tight to prevent narrative drift
export const FACTS_LIMIT = 12;

// Episodic memory is constrained to preserve recency bias control
export const EPISODES_LIMIT = 8;

// Identity / autobiography is allowed deeper context
export const AUTOBIOGRAPHY_LIMIT = 25;

// --------------------------------------------------------------
// External Grounding Context
// --------------------------------------------------------------

// Research context (Hubble, future USPTO, science feeds)
export const RESEARCH_CONTEXT_LIMIT = 10;

// News digest cap (if enabled)
export const NEWS_DIGEST_LIMIT = 6;
