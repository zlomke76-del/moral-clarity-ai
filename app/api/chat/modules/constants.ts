// modules/constants.ts

// Primary & fallback models for Responses API routing
export const DEFAULT_MODEL = "gpt-5";          // main Solace model
export const FALLBACK_MODEL = "gpt-4.1-mini";  // stable backup

// NOTE: Responses API does NOT support temperature/max_tokens.
// We keep these constants ONLY for internal logic (if needed later)
// but they must NOT be passed into client.responses.create().
export const TEMPERATURE = 0.2;
export const MAX_TOKENS = 1800;

// Memory retrieval settings
export const FACTS_LIMIT = 12;
export const EPISODES_LIMIT = 8;

// Context enrichers
export const ENABLE_NEWS = true;
export const ENABLE_RESEARCH = true;
