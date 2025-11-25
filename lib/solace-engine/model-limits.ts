// lib/solace-engine/model-limits.ts

/**
 * Centralized model limits + founder detection.
 * Every other module imports from here.
 */

export interface FounderConfig {
  founderEmails: string[];
  founderUserKeys: string[];
}

export const founderConfig: FounderConfig = {
  founderEmails: [
    (process.env.FOUNDER_USER_EMAIL || '').toLowerCase(),
    'zlomke76@gmail.com', // hard-wired
  ].filter(Boolean),
  founderUserKeys: (process.env.FOUNDER_USER_KEYS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
};

export function isFounder(userKey: string | null | undefined): boolean {
  if (!userKey) return false;
  const key = String(userKey).trim().toLowerCase();
  if (!key) return false;

  if (founderConfig.founderEmails.includes(key)) return true;
  if (founderConfig.founderUserKeys.includes(key)) return true;

  return false;
}

/* ===========================
   TOKEN LIMITS + TIMEOUTS
   =========================== */

export const FOUNDER_MAX_OUTPUT_TOKENS = 12000;
export const NORMAL_MAX_OUTPUT_TOKENS = 1200;

export const BASE_REQUEST_TIMEOUT_MS = 20_000;
export const FOUNDER_REQUEST_TIMEOUT_MS = 180_000;

export function getTokenLimit(isFounderFlag: boolean) {
  return isFounderFlag ? FOUNDER_MAX_OUTPUT_TOKENS : NORMAL_MAX_OUTPUT_TOKENS;
}

export function getRequestTimeout(isFounderFlag: boolean) {
  return isFounderFlag ? FOUNDER_REQUEST_TIMEOUT_MS : BASE_REQUEST_TIMEOUT_MS;
}

/* ===========================
   MEMORY PACK LIMITS
   =========================== */

export const FOUNDER_MEMORY_FACTS_LIMIT = 16;
export const NORMAL_MEMORY_FACTS_LIMIT = 8;

export const FOUNDER_MEMORY_EPISODES_LIMIT = 12;
export const NORMAL_MEMORY_EPISODES_LIMIT = 6;

export function getMemoryLimits(isFounderFlag: boolean) {
  return {
    factsLimit: isFounderFlag ? FOUNDER_MEMORY_FACTS_LIMIT : NORMAL_MEMORY_FACTS_LIMIT,
    episodesLimit: isFounderFlag ? FOUNDER_MEMORY_EPISODES_LIMIT : NORMAL_MEMORY_EPISODES_LIMIT,
  };
}
