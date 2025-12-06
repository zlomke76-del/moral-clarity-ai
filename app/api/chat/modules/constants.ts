// modules/constants.ts
// Centralized constants for the chat pipeline

export const DEFAULT_MODEL = "gpt-5-1";
export const FALLBACK_MODEL = "gpt-4o-mini";

export const MAX_TOKENS = 12000;
export const RESPONSE_TIMEOUT_MS = 180_000;

// Memory limits (your chosen defaults)
export const FACTS_LIMIT = 16;
export const EPISODES_LIMIT = 12;
export const RECALL_WINDOW = 50; // last 50 conversations

// News + research flags
export const ENABLE_NEWS = true;
export const ENABLE_RESEARCH = true;

// Persona identifiers
export const SOLACE_PERSONA = "Solace";
export const SYSTEM_NAME = "Moral Clarity AI";

// Routing constants
export const STREAM_CHUNK_DELAY_MS = 12;

// Safety thresholds
export const MAX_SENSITIVITY_BEFORE_REVIEW = 5;
export const DRIFT_CONFLICT_THRESHOLD = 3;
