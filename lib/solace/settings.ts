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
