// lib/solace/settings.ts

export type InternetMode = "off" | "conservative" | "full";

export type MCAISettings = {
  /**
   * Controls how aggressively Solace relies on internet / web-derived context.
   *
   * - "off"          → never trigger deep research / web context automatically.
   * - "conservative" → only when clearly requested (URLs, "deep research", etc.).
   * - "full"         → allowed whenever it would clearly help answer.
   */
  internetMode: InternetMode;
};

/**
 * Resolve the internet mode from environment, with a safe default.
 *
 * You can override via:
 * - NEXT_PUBLIC_MCAI_INTERNET_MODE
 * - MCAI_INTERNET_MODE
 *
 * Valid values: "off" | "conservative" | "full" (case-insensitive).
 */
function resolveInternetMode(): InternetMode {
  const raw =
    process.env.NEXT_PUBLIC_MCAI_INTERNET_MODE ||
    process.env.MCAI_INTERNET_MODE ||
    "";

  const v = raw.trim().toLowerCase();
  if (v === "off" || v === "conservative" || v === "full") {
    return v;
  }

  // Default: conservative (only when clearly asked).
  return "conservative";
}

export const DEFAULT_SETTINGS: MCAISettings = {
  internetMode: resolveInternetMode(),
};

/* -------------------------------------------------------
   FEATURE FLAGS
   (kept generic so routes can safely destructure)
-------------------------------------------------------- */

export type SolaceFeatureFlags = {
  [key: string]: any;
};

/**
 * Central place to read Solace feature flags from env.
 *
 * This stays intentionally generic so different routes
 * can destructure what they need without type friction.
 */
export function getSolaceFeatureFlags(): SolaceFeatureFlags {
  const uploadModerationRaw =
    process.env.SOLACE_UPLOAD_MODERATION ||
    process.env.NEXT_PUBLIC_SOLACE_UPLOAD_MODERATION ||
    "";

  const uploadModeration =
    typeof uploadModerationRaw === "string"
      ? uploadModerationRaw.trim().length > 0 &&
        !/^0|false|off$/i.test(uploadModerationRaw)
      : !!uploadModerationRaw;

  return {
    // Controls whether the moderate-upload route should actually call moderation.
    uploadModeration,

    // Expose internetMode so routes can align behavior if needed.
    internetMode: DEFAULT_SETTINGS.internetMode,
  };
}
