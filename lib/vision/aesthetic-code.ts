/**
 * Aesthetic Engine 2.0
 *
 * Converts Solace's <aesthetic> JSON blocks into:
 *  - Tailwind/UI change recommendations
 *  - Component blueprints
 *  - Real React/Tailwind code
 *  - Visual deltas (spacing, contrast, hierarchy)
 *  - Suggested color and typography tokens
 *
 * This engine never analyzes images. It only receives structured hints.
 */

export type AestheticHint = {
  layout?: string;                // "two-column", "hero", "card grid", etc.
  components?: string[];          // Elements found: ["card", "button", "hero"]
  issues?: string[];              // "poor contrast", "misaligned grid", etc.
  suggestions?: string[];         // Raw recommendations from Solace
  notes?: string;                 // Extended reasoning
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };
  typography?: {
    heading?: string;
    body?: string;
    scale?: string;
  };
  spacing?: {
    padding?: string;
    gap?: string;
    density?: "tight" | "normal" | "loose";
  };
};

export type AestheticCodeResult = {
  summary: string;
  reactCode: string;
  tailwindNotes: string[];
  variables: string[];
  breakpoints: string[];
  visualDeltas: string[];
  tokens: {
    colors: string[];
    typography: string[];
    spacing: string[];
  };
};

/* -------------------------------------------------------------------------- */
/*                               MAIN FUNCTION                                */
/* -------------------------------------------------------------------------- */

export function generateUIFromAesthetics(hint: AestheticHint): AestheticCodeResult {
  const layout = hint.layout?.toLowerCase() || "generic";
  const issues = hint.issues ?? [];
  const suggestions = hint.suggestions ?? [];

  /* ---------------------------------------------------------------------- */
  /* HIGH-LEVEL SUMMARY */
  /* ---------------------------------------------------------------------- */

  const summaryLines = [
    `Detected layout: ${layout}`,
    issues.length ? `Issues found: ${issues.join(", ")}` : "",
    suggestions.length ? `Applied suggestions: ${suggestions.join("; ")}` : "",
  ].filter(Boolean);

  /* ---------------------------------------------------------------------- */
  /* VISUAL DELTAS — TURN PROBLEMS INTO ACTIONABLE FIXES */
  /* ---------------------------------------------------------------------- */

  const visualDeltas: string[] = [];

  for (const issue of issues) {
    const low = issue.toLowerCase();

    if (low.includes("contrast"))
      visualDeltas.push("Increase text/background contrast → use text-white, text-neutral-200, bg-neutral-900, or bg-black/90.");

    if (low.includes("spacing"))
      visualDeltas.push("Increase vertical rhythm → apply space-y-4/6 or py-8.");

    if (low.includes("alignment"))
      visualDeltas.push("Use grid or flex alignment utilities → items-center justify-between.");

    if (low.includes("hierarchy"))
      visualDeltas.push("Increase heading size or font weight → text-3xl font-bold.");
  }

  /* ---------------------------------------------------------------------- */
  /* UI TOKENS (colors, spacing, typography) */
  /* ---------------------------------------------------------------------- */

  const tokens = {
    colors: [] as string[],
    typography: [] as string[],
    spacing: [] as string[],
  };

  if (hint.colors) {
    const c = hint.colors;
    if (c.primary) tokens.colors.push(`--primary: ${c.primary};`);
    if (c.secondary) tokens.colors.push(`--secondary: ${c.secondary};`);
    if (c.background) tokens.colors.push(`--background: ${c.background};`);
    if (c.text) tokens.colors.push(`--text: ${c.text};`);
  }

  if (hint.typography) {
    const t = hint.typography;
    if (t.heading) tokens.typography.push(`Heading font: ${t.heading}`);
    if (t.body) tokens.typography.push(`Body font: ${t.body}`);
    if (t.scale) tokens.typography.push(`Type scale: ${t.scale}`);
  }

  if (hint.spacing) {
    const s = hint.spacing;
    if (s.padding) tokens.spacing.push(`Padding scale: ${s.padding}`);
    if (s.gap) tokens.spacing.push(`Grid gap scale: ${s.gap}`);
    if (s.density) tokens.spacing.push(`Density: ${s.density}`);
  }

  /* ---------------------------------------------------------------------- */
  /* REACT CODE TEMPLATES (layout-specific) */
  /* ---------------------------------------------------------------------- */

  let reactCode = "";
  let variables: string[] = [];
  const breakpoints = ["sm", "md", "lg", "xl"];

  // HERO LAYOUT
  if (layout.includes("hero")) {
    reactCode = `
export default function HeroSection() {
  return (
    <section className="bg-neutral-950 text-white px-6 md:px-12 py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {/* title */}
          </h1>
          <p className="text-neutral-300 text-lg">
            {/* description */}
          </p>
          <div className="flex gap-4">
            {/* buttons */}
          </div>
        </div>
        <div className="flex justify-center">
          {/* image or illustration */}
        </div>
      </div>
    </section>
  );
}
`.trim();

    variables = ["title", "description", "primaryButton", "secondaryButton"];
  }

  // TWO COLUMN
  else if (layout.includes("two") || layout.includes("2")) {
    reactCode = `
export default function TwoColumn() {
  return (
    <section className="px-6 md:px-12 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          {/* left column */}
        </div>
        <div className="space-y-4">
          {/* right column */}
        </div>
      </div>
    </section>
  );
}
`.trim();

    variables = ["leftColumn", "rightColumn"];
  }

  // CARD GRID
  else if (layout.includes("card")) {
    reactCode = `
export default function CardGrid() {
  return (
    <section className="px-6 md:px-12 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1,2,3].map(i => (
          <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">{/* card title */}</h3>
            <p className="text-neutral-400 text-sm">{/* card description */}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`.trim();

    variables = ["cards[]"];
  }

  // GENERIC BLOCK
  else {
    reactCode = `
export default function Block() {
  return (
    <section className="px-6 md:px-12 py-14">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-10">
        {/* content */}
      </div>
    </section>
  );
}
`.trim();

    variables = ["content"];
  }

  /* ---------------------------------------------------------------------- */
  /* TAILWIND NOTES FROM SUGGESTIONS */
  /* ---------------------------------------------------------------------- */

  const tailwindNotes: string[] = [];

  for (const s of suggestions) {
    const low = s.toLowerCase();
    if (low.includes("padding")) tailwindNotes.push("Adjust padding → px-6 md:px-12 py-16.");
    if (low.includes("contrast")) tailwindNotes.push("Increase contrast → text-white or bg-neutral-950.");
    if (low.includes("spacing")) tailwindNotes.push("Increase spacing → gap-8 or space-y-6.");
    if (low.includes("grid")) tailwindNotes.push("Use responsive grids → sm:grid-cols-2 lg:grid-cols-3.");
    if (low.includes("alignment")) tailwindNotes.push("Align items → items-center justify-between.");
  }

  /* ---------------------------------------------------------------------- */
  /* FINAL RETURN */
  /* ---------------------------------------------------------------------- */

  return {
    summary: summaryLines.join("\n"),
    reactCode,
    tailwindNotes,
    variables,
    breakpoints,
    visualDeltas,
    tokens,
  };
}
