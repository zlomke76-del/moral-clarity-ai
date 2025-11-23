/**
 * Aesthetic Engine 2.1
 *
 * Converts Solace's <aesthetic> metadata into production-ready UI:
 *  - Tailwind improvement hints
 *  - React layout blueprints
 *  - Design tokens (colors, typography, spacing)
 *  - Visual deltas (contrast, spacing, hierarchy)
 *
 * Does NOT analyze images. Only interprets structured JSON.
 */

export type AestheticHint = {
  layout?: string;
  components?: string[];
  issues?: string[];
  suggestions?: string[];
  notes?: string;
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
/*                               MAIN ENGINE                                   */
/* -------------------------------------------------------------------------- */

export function generateUIFromAesthetics(hint: AestheticHint): AestheticCodeResult {
  const layout = hint.layout?.toLowerCase() || "generic";
  const issues = hint.issues ?? [];
  const suggestions = hint.suggestions ?? [];

  /* ---------------------------------------------------------------------- */
  /* SUMMARY */
  /* ---------------------------------------------------------------------- */

  const summaryParts = [
    `Layout detected: ${layout}`,
    issues.length ? `Issues: ${issues.join(", ")}` : "",
    suggestions.length ? `Suggestions applied: ${suggestions.join("; ")}` : "",
  ].filter(Boolean);

  const summary = summaryParts.join("\n");

  /* ---------------------------------------------------------------------- */
  /* VISUAL DELTAS — Direct UI corrections */
  /* ---------------------------------------------------------------------- */

  const visualDeltas: string[] = [];
  for (const issue of issues) {
    const low = issue.toLowerCase();

    if (low.includes("contrast"))
      visualDeltas.push("Increase contrast: use text-white, text-neutral-200, or bg-neutral-950.");

    if (low.includes("spacing"))
      visualDeltas.push("Increase spacing: apply space-y-6, py-12, gap-8.");

    if (low.includes("alignment"))
      visualDeltas.push("Fix alignment: add items-center or justify-between.");

    if (low.includes("hierarchy"))
      visualDeltas.push("Improve hierarchy: use text-4xl font-bold for primary headers.");
  }

  /* ---------------------------------------------------------------------- */
  /* DESIGN TOKENS - Derived from Solace metadata */
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
    if (s.gap) tokens.spacing.push(`Grid gap: ${s.gap}`);
    if (s.density) tokens.spacing.push(`Density: ${s.density}`);
  }

  /* ---------------------------------------------------------------------- */
  /* REACT CODE TEMPLATES */
  /* ---------------------------------------------------------------------- */

  let reactCode = "";
  let variables: string[] = [];
  const breakpoints = ["sm", "md", "lg", "xl"];

  /* HERO --------------------------------------------------------------- */
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
          {/* image / visual */}
        </div>
      </div>
    </section>
  );
}
    `.trim();

    variables = ["title", "description", "ctaButtons"];
  }

  /* TWO COLUMN --------------------------------------------------------- */
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

    variables = ["left", "right"];
  }

  /* CARD GRID ---------------------------------------------------------- */
  else if (layout.includes("card") || layout.includes("grid")) {
    reactCode = `
export default function CardGrid() {
  return (
    <section className="px-6 md:px-12 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">
              {/* card title */}
            </h3>
            <p className="text-neutral-400 text-sm">
              {/* card description */}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
    `.trim();

    variables = ["cards[]"];
  }

  /* GENERIC BLOCK ------------------------------------------------------ */
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
  /* TAILWIND NOTES (from suggestions) */
  /* ---------------------------------------------------------------------- */

  const tailwindNotes: string[] = [];
  for (const s of suggestions) {
    const low = s.toLowerCase();
    if (low.includes("padding")) tailwindNotes.push("Adjust padding → px-6 md:px-12 py-16.");
    if (low.includes("contrast")) tailwindNotes.push("Increase contrast → bg-neutral-950 text-white.");
    if (low.includes("spacing")) tailwindNotes.push("Increase spacing → gap-8 space-y-6.");
    if (low.includes("grid")) tailwindNotes.push("Use responsive grids → sm:grid-cols-2 lg:grid-cols-3.");
    if (low.includes("alignment")) tailwindNotes.push("Align items → items-center justify-center.");
  }

  /* ---------------------------------------------------------------------- */
  /* RETURN */
  /* ---------------------------------------------------------------------- */

  return {
    summary,
    reactCode,
    tailwindNotes,
    variables,
    breakpoints,
    visualDeltas,
    tokens,
  };
}
