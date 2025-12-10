// ------------------------------------------------------------
// Governor Icon Formatting Layer
// Integrates Solace Iconography Pack (SIP) with Pacing Engine.
// Ensures:
//  - No icon overuse
//  - Icons match emotional state
//  - Anchor/Compass used only when meaningful
//  - Founder mode unlocks richer iconography
// ------------------------------------------------------------

import {
  getIconsForLevel,
  shouldUseIcon,
  selectIcon,
  canUseAnchor,
  canUseCompass,
  formatWithIcon,
  PacingLevel
} from "@/lib/solace/icon-pack";

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------

export interface GovernorFormattingContext {
  level: PacingLevel;                  // Governor pacing level 0–5
  isFounder: boolean;                  // Founder-only icon unlock
  emotionalDistress: boolean;          // anchor permissions
  decisionContext: boolean;            // compass permissions
  usageCounter?: number;               // icon count inside a response
}

// ------------------------------------------------------------
// applyGovernorFormatting
// The single entry point used by the Governor.
// Takes raw Solace text and returns icon-aware formatted text.
// ------------------------------------------------------------

export function applyGovernorFormatting(
  text: string,
  ctx: GovernorFormattingContext
): string {
  let output = text.trim();
  let usage = 0;

  const icons = getIconsForLevel(ctx.level, ctx.isFounder);

  // ------------------------------------------------------------
  // 1. ANCHOR USAGE — Emotional grounding only
  // ------------------------------------------------------------
  if (
    ctx.emotionalDistress &&
    shouldUseIcon(ctx.level, usage) &&
    canUseAnchor(ctx.level, ctx.emotionalDistress)
  ) {
    const anchor = selectIcon(ctx.level, "ANCHOR", ctx.isFounder);
    if (anchor) {
      output = formatWithIcon(anchor, output);
      usage++;
    }
  }

  // ------------------------------------------------------------
  // 2. COMPASS USAGE — Directional clarity only
  // ------------------------------------------------------------
  else if (
    ctx.decisionContext &&
    shouldUseIcon(ctx.level, usage) &&
    canUseCompass(ctx.level, ctx.isFounder, ctx.decisionContext)
  ) {
    const compass =
      selectIcon(ctx.level, "COMPASS", ctx.isFounder) ||
      selectIcon(ctx.level, "COMPASS_ASCII", ctx.isFounder);

    if (compass) {
      output = formatWithIcon(compass, output);
      usage++;
    }
  }

  // ------------------------------------------------------------
  // 3. STRUCTURAL ICON USAGE
  // Only applied when there are multiple lines or clear sections.
  // This ensures icons add clarity, not clutter.
  // ------------------------------------------------------------
  const lines = output.split("\n");

  if (lines.length > 1) {
    const newLines = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;

      if (!shouldUseIcon(ctx.level, usage)) return line;

      // Choose a structural icon depending on governor level
      let structuralIcon = "";

      if (ctx.level === 2) structuralIcon = icons["ARROW"] || "";
      if (ctx.level === 3) structuralIcon = icons["DOUBLE_ARROW"] || "";
      if (ctx.level === 4) structuralIcon = icons["FAST_ARROW"] || "";
      if (ctx.level === 5)
        structuralIcon = icons["STAR"] || icons["DOUBLE_ARROW"] || "";

      if (structuralIcon) {
        usage++;
        return formatWithIcon(structuralIcon, trimmed);
      }

      return line;
    });

    output = newLines.join("\n");
  }

  // ------------------------------------------------------------
  // 4. Ensures no trailing whitespace or double icons
  // ------------------------------------------------------------
  output = output.replace(/^\s+/, "").replace(/\n{3,}/g, "\n\n");

  return output;
}
