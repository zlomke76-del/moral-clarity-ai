/**
 * Aesthetic Engine 3.0
 * -------------------------------------------------------
 * Translates Solace's <aesthetic> blocks into:
 * - High-level design summary
 * - UI component recommendations
 * - Tailwind + shadcn code
 * - Responsive tokens
 * - Aesthetic diffs (before → after)
 *
 * This engine does NOT analyze images. It only converts
 * structured aesthetic JSON into usable React/Tailwind code.
 */

export type AestheticHint = {
  layout?: string;                // "hero", "dashboard", "feed", "two-column"
  components?: string[];          // ["card", "stat", "modal"]
  issues?: string[];              // ["poor contrast", "too dense"]
  suggestions?: string[];         // ["Increase spacing", "Use grid of 3"]
  notes?: string;                 // optional long-form
  styleTokens?: Record<string, string>; // optional token map
};

export type AestheticCodeResult = {
  summary: string;
  component: string;
  reactCode: string;
  wireframe: string;
  tailwindNotes: string[];
  variables: string[];
  breakpoints: string[];
  beforeAfter: string[];
  tokens: Record<string, string>;
};

/* ---------------------------------------------------------
 * Utility helpers
 * -------------------------------------------------------- */

function clean(str: string | undefined): string {
  return (str || "").trim().toLowerCase();
}

function mkTokenMap(h: AestheticHint): Record<string, string> {
  return {
    spacing: h.styleTokens?.spacing || "space-y-4 md:space-y-6",
    radius: h.styleTokens?.radius || "rounded-xl",
    shadow: h.styleTokens?.shadow || "shadow-lg",
    bg: h.styleTokens?.bg || "bg-neutral-900/60",
    border: h.styleTokens?.border || "border border-neutral-800",
    textPrimary: h.styleTokens?.textPrimary || "text-white",
    textSecondary: h.styleTokens?.textSecondary || "text-neutral-300",
  };
}

/* ---------------------------------------------------------
 * Layout templates
 * -------------------------------------------------------- */

function heroTemplate(tokens: Record<string, string>) {
  return `
export default function HeroBlock() {
  return (
    <section className="px-6 md:px-12 py-16 ${tokens.bg} ${tokens.radius}">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="${tokens.spacing}">
          <h1 className="text-3xl md:text-5xl font-bold ${tokens.textPrimary}">
            {/* headline */}
          </h1>
          <p className="${tokens.textSecondary}">
            {/* subheadline */}
          </p>
        </div>

        <div className="flex items-center justify-center">
          {/* image/illustration */}
        </div>
      </div>
    </section>
  );
}
  `.trim();
}

function dashboardTemplate(tokens: Record<string, string>) {
  return `
export default function DashboardGrid() {
  return (
    <section className="px-6 md:px-12 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="${tokens.bg} ${tokens.radius} ${tokens.border} p-6 ${tokens.shadow}">
          {/* metric card */}
        </div>
        <div className="${tokens.bg} ${tokens.radius} ${tokens.border} p-6 ${tokens.shadow}">
          {/* metric card */}
        </div>
        <div className="${tokens.bg} ${tokens.radius} ${tokens.border} p-6 ${tokens.shadow}">
          {/* metric card */}
        </div>
        <div className="${tokens.bg} ${tokens.radius} ${tokens.border} p-6 ${tokens.shadow}">
          {/* metric card */}
        </div>
      </div>
    </section>
  );
}
  `.trim();
}

function feedTemplate(tokens: Record<string, string>) {
  return `
export default function FeedList() {
  return (
    <section className="px-6 md:px-12 py-12">
      <div className="space-y-4">
        {[1,2,3].map((i) => (
          <div
            key={i}
            className="${tokens.bg} ${tokens.radius} ${tokens.border} p-6 ${tokens.shadow}"
          >
            {/* feed item */}
          </div>
        ))}
      </div>
    </section>
  );
}
  `.trim();
}

function twoColumnTemplate(tokens: Record<string, string>) {
  return `
export default function TwoColumn() {
  return (
    <section className="px-6 md:px-12 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="${tokens.spacing}">
          {/* left */}
        </div>
        <div className="${tokens.spacing}">
          {/* right */}
        </div>
      </div>
    </section>
  );
}
  `.trim();
}

function genericTemplate(tokens: Record<string, string>) {
  return `
export default function GenericBlock() {
  return (
    <section className="px-6 md:px-12 py-12">
      <div className="${tokens.bg} ${tokens.radius} ${tokens.border} p-8 ${tokens.shadow}">
        {/* content */}
      </div>
    </section>
  );
}
  `.trim();
}

/* ---------------------------------------------------------
 * Wireframe generator (ASCII)
 * -------------------------------------------------------- */

function wireframe(layout: string): string {
  if (layout.includes("hero"))
    return `
[ HERO BLOCK ]
 -------------------------------
| Headline + Subheadline | IMG |
 -------------------------------`;

  if (layout.includes("dash"))
    return `
[ DASHBOARD GRID ]
 -------------------------------
| Card | Card | Card | Card     |
 -------------------------------`;

  if (layout.includes("feed"))
    return `
[ FEED LIST ]
 ----------------
|  Item         |
|  Item         |
|  Item         |
 ----------------`;

  if (layout.includes("two"))
    return `
[ TWO COLUMN ]
 ------------------------
|   Left   |   Right    |
 ------------------------`;

  return `
[ GENERIC BLOCK ]
 ------------------------
|      Content          |
 ------------------------`;
}

/* ---------------------------------------------------------
 * Tailwind Delta Inference
 * -------------------------------------------------------- */

function tailwindDelta(suggestions: string[]): string[] {
  const out: string[] = [];

  for (const s of suggestions) {
    const low = s.toLowerCase();

    if (low.includes("contrast")) out.push("Increase contrast: text-white / bg-neutral-900");
    if (low.includes("spacing")) out.push("Increase spacing: gap-6, space-y-6");
    if (low.includes("padding")) out.push("Try px-6 md:px-12 or p-8");
    if (low.includes("grid")) out.push("Use grid-cols-2/3/4 with responsive md: and lg:");
    if (low.includes("background")) out.push("Use bg-neutral-900/60 or bg-[#0f172a]");
    if (low.includes("alignment")) out.push("Use flex-center or items-center justify-between");
    if (low.includes("hierarchy")) out.push("Increase heading size (text-4xl+) and reduce noise");
  }

  return out;
}

/* ---------------------------------------------------------
 * Before / After diff
 * -------------------------------------------------------- */

function makeDiff(issues: string[], suggestions: string[]): string[] {
  const diff: string[] = [];

  for (const i of issues) diff.push(`Before: ${i}`);
  for (const s of suggestions) diff.push(`After: ${s}`);

  return diff;
}

/* ---------------------------------------------------------
 * MAIN ENTRY: generateUIFromAesthetics
 * -------------------------------------------------------- */

export function generateUIFromAesthetics(hint: AestheticHint): AestheticCodeResult {
  const layout = clean(hint.layout);
  const issues = hint.issues || [];
  const suggestions = hint.suggestions || [];
  const tokens = mkTokenMap(hint);

  let reactCode = "";
  let component = "";

  if (layout.includes("hero")) {
    reactCode = heroTemplate(tokens);
    component = "HeroBlock";
  } else if (layout.includes("dash")) {
    reactCode = dashboardTemplate(tokens);
    component = "DashboardGrid";
  } else if (layout.includes("feed")) {
    reactCode = feedTemplate(tokens);
    component = "FeedList";
  } else if (layout.includes("two") || layout.includes("2")) {
    reactCode = twoColumnTemplate(tokens);
    component = "TwoColumn";
  } else {
    reactCode = genericTemplate(tokens);
    component = "GenericBlock";
  }

  return {
    summary: [
      `Layout: ${hint.layout || "unspecified"}`,
      issues.length ? `Issues: ${issues.join(", ")}` : "",
      suggestions.length ? `Suggestions: ${suggestions.join("; ")}` : "",
      hint.notes ? `Notes: ${hint.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),

    component,
    reactCode,
    wireframe: wireframe(layout),
    tailwindNotes: tailwindDelta(suggestions),
    variables: ["title", "subtitle", "leftContent", "rightContent"],
    breakpoints: ["sm", "md", "lg", "xl"],
    beforeAfter: makeDiff(issues, suggestions),
    tokens,
  };
}

