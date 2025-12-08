// app/api/chat/modules/constants.ts
// --------------------------------------------------------------
// Solace model constants & tuning parameters
// --------------------------------------------------------------

// Primary model (must be real OpenAI API model)
export const DEFAULT_MODEL = "gpt-4.1";

// Backup model — always safe & available
export const FALLBACK_MODEL = "gpt-4.1-mini";

// NOTE: Responses API does NOT support temperature/max_tokens.
// These values remain only for internal logic (if needed later).
export const TEMPERATURE = 0.2;
export const MAX_TOKENS = 1800;

// Memory retrieval settings
export const FACTS_LIMIT = 12;
export const EPISODES_LIMIT = 8;

// Context enrichers
export const ENABLE_NEWS = true;
export const ENABLE_RESEARCH = true;
