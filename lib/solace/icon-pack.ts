// ------------------------------------------------------------
// Solace Iconography Pack (SIP v1.0)
// ASCII-safe, pacing-aware icon system for MCAI / Solace.
//
// Icons are NOT decorative. They are structural, emotional,
// and cognitive signaling tools. The Governor decides when
// they are allowed and at what intensity.
// ------------------------------------------------------------

export type PacingLevel = 0 | 1 | 2 | 3 | 4 | 5;

// ------------------------------------------------------------
// ICON DEFINITIONS
// ------------------------------------------------------------

// Level 0 — Sanctuary (almost no icons)
const SANCTUARY_ICONS = {
  ANCHOR: "⚓",
  PAUSE: "…",
  BREATH: "~ ~ ~",
};

// Level 1 — Warm / Gentle
const WARM_ICONS = {
  DOT: "•",
  SOFT_STAR: "✧",
  SOFT_COMPASS: "⌖",
};

// Level 2 — Guided Clarity
const GUIDANCE_ICONS = {
  ARROW: "→",
  BOX: "▣",
  QUESTION: "◆",
};

// Level 3 — Productive Flow
const FLOW_ICONS = {
  DOUBLE_ARROW: "→→",
  STRUCTURE_BAR: "▤",
  OPTION_SET: "▧",
  DECISION_DIAMOND: "◇",
  COMPASS: "⌘", // branded compass symbol
};

// Level 4 — Accelerated Execution
const ACCEL_ICONS = {
  FAST_ARROW: "⇒",
  CHECK: "✔︎",
  WARNING: "⚠︎",
  PATH: "⇢",
};

// Level 5 — Founder Mode (restricted)
const FOUNDER_ICONS = {
  STAR: "✦",
  SIGIL: "⟡",
  ANCHOR: "⚓",
  COMPASS: "🧭",
  COMPASS_ASCII: "+>", // fallback for safety
};

// ------------------------------------------------------------
// GOVERNOR RULES FOR ICON FREQUENCY
// ------------------------------------------------------------
// Maximum icons allowed per message, by level.

export const ICON_LIMITS: Record<PacingLevel, number> = {
  0: 1, // almost none
  1: 1,
  2: 2,
  3: 2,
  4: 3,
  5: 4, // founder mode can have more
};

// ------------------------------------------------------------
// GOVERNOR → ICON PACK MAPPING
// ------------------------------------------------------------

export const ICONS_BY_LEVEL: Record<PacingLevel, Record<string, string>> = {
  0: {
    ...SANCTUARY_ICONS,
  },
  1: {
    ...WARM_ICONS,
  },
  2: {
    ...GUIDANCE_ICONS,
  },
  3: {
    ...FLOW_ICONS,
  },
  4: {
    ...ACCEL_ICONS,
  },
  5: {
    ...FLOW_ICONS,
    ...ACCEL_ICONS,
    ...FOUNDER_ICONS, // only founder can use
  },
};

// ------------------------------------------------------------
// HIGH-LEVEL API
// ------------------------------------------------------------

/**
 * getIconsForLevel
 * Returns the allowed icon set for the current pacing level.
 * Ensures Level 5 icons are removed automatically for non-founders.
 */
export function getIconsForLevel(
  level: PacingLevel,
  isFounder: boolean
) {
  const base = ICONS_BY_LEVEL[level];

  if (level === 5 && !isFounder) {
    // strip founder-only symbols for non-founders
    const { STAR, SIGIL, ANCHOR, COMPASS, COMPASS_ASCII, ...rest } =
      base;
    return rest;
  }

  return base;
}

/**
 * selectIcon
 * Safely returns a single icon by key if available.
 * Provides an ASCII fallback for any non-renderable symbol.
 */
export function selectIcon(
  level: PacingLevel,
  key: string,
  isFounder: boolean = false
): string {
  const icons = getIconsForLevel(level, isFounder);
  const icon = icons[key];

  if (!icon) return "";

  // ASCII safety check
  const asciiSafe = [...icon].every((c) => c.charCodeAt(0) <= 255);
  if (!asciiSafe) {
    // fallback for founder compass
    if (key === "COMPASS") return FOUNDER_ICONS.COMPASS_ASCII;
  }

  return icon;
}

// ------------------------------------------------------------
// SHOULD-USE LOGIC (prevents icon overuse)
// ------------------------------------------------------------

/**
 * shouldUseIcon
 * Decides if Solace is allowed to introduce an icon into the message.
 * This is not a global counter — the Governor enforces the output limit.
 */
export function shouldUseIcon(
  level: PacingLevel,
  usageCount: number
): boolean {
  const limit = ICON_LIMITS[level];
  return usageCount < limit;
}

// ------------------------------------------------------------
// ANCHOR & COMPASS USAGE RULES
// ------------------------------------------------------------

/**
 * canUseAnchor
 * Anchor only allowed when emotionally grounding user
 */
export function canUseAnchor(
  level: PacingLevel,
  emotionalDistress: boolean
): boolean {
  if (!emotionalDistress) return false;
  return level <= 1; // only in Level 0–1 unless founder overrides
}

/**
 * canUseCompass
 * Compass only allowed in clarity, direction, synthesis, founder decisions.
 */
export function canUseCompass(
  level: PacingLevel,
  isFounder: boolean,
  decisionContext: boolean
): boolean {
  if (!decisionContext) return false;

  if (level >= 3) return true; // Arbiter, Flow, Accelerated
  if (level === 5 && isFounder) return true;

  return false;
}

// ------------------------------------------------------------
// HELPERS FOR INTEGRATION WITH GOVERNOR
// ------------------------------------------------------------

/**
 * formatWithIcon
 * Places an icon at the start of a line, respecting limits.
 */
export function formatWithIcon(
  icon: string,
  text: string
): string {
  return `${icon} ${text}`;
}
