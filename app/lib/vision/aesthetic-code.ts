// app/lib/vision/aesthetic-code.ts

/**
 * Aesthetic → Code translator
 *
 * Turns Solace’s visual recommendations into Tailwind/React code blocks
 * that match the MCAI design language (Next.js + shadcn + Tailwind).
 *
 * This helper NEVER analyzes images — it only takes structured
 * aesthetic suggestions and converts them into implementable UI.
 */

export type AestheticHint = {
  layout?: string;                // e.g. "two-column", "hero", "card grid"
  components?: string[];          // ["hero", "card"], optional
  issues?: string[];              // ["poor contrast", "tight spacing"]
  suggestions?: string[];         // raw textual recommendations
  notes?: string;                 // optional long-form
};

export type AestheticCodeResult = {
  summary: string;
  reactCode: string;
  tailwindNotes: string[];
  variables: string[];
  breakpoints: string[];
};

export function generateUIFromAesthetics(hint: AestheticHint): AestheticCodeResult {
  const layout = hint.layout?.toLowerCase() ?? "";
  const issues = hint.issues ?? [];
  const suggestions = hint.suggestions ?? [];

  /* ==== High-level summary ==== */
  const summaryLines = [
    `Layout: ${layout || "unspecified"}`,
    issues.length ? `Issues detected: ${issues.join(", ")}` : "",
    suggestions.length ? `Applied suggestions: ${suggestions.join("; ")}` : "",
  ].filter(Boolean);

  /* ==== Layout templates ==== */
  let reactCode = "";
  let variables: string[] = [];
  const breakpoints = ["sm", "md", "lg", "xl"];

  if (layout.includes("hero")) {
    reactCode = `
export default function HeroSection() {
  return (
    <section className="bg-[#0f172a] text-white px-6 md:px-12 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {/* Title goes here */}
          </h1>
          <p className="text-neutral-300">
            {/* Subtitle text */}
          </p>
        </div>
        <div className="flex items-center justify-center">
          {/* Optional image or illustration */}
        </div>
      </div>
    </section>
  );
}
    `.trim();

    variables = ["title", "subtitle"];
  }

  if (layout.includes("two") || layout.includes("2")) {
    reactCode = `
export default function TwoColumnBlock() {
  return (
    <section className="px-6 md:px-12 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>{/* left content */}</div>
        <div>{/* right content */}</div>
      </div>
    </section>
  );
}
    `.trim();

    variables = ["leftContent", "rightContent"];
  }

  if (!reactCode) {
    reactCode = `
export default function GenericBlock() {
  return (
    <section className="px-6 md:px-12 py-12">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-8">
        {/* Content goes here */}
      </div>
    </section>
  );
}
    `.trim();
  }

  /* ==== Tailwind notes extracted from suggestions ==== */
  const tailwindNotes = [];

  for (const s of suggestions) {
    const low = s.toLowerCase();
    if (low.includes("padding")) tailwindNotes.push("Adjust padding → px-?, py-?");
    if (low.includes("contrast")) tailwindNotes.push("Increase text/background contrast.");
    if (low.includes("spacing")) tailwindNotes.push("Use gap-x-?, gap-y-?, space-y-? utilities.");
    if (low.includes("background")) tailwindNotes.push("Set bg-[hex] or bg-neutral-* class.");
    if (low.includes("grid")) tailwindNotes.push("Use grid-cols-? or responsive md:grid-cols-? classes.");
  }

  return {
    summary: summaryLines.join("\n"),
    reactCode,
    tailwindNotes,
    variables,
    breakpoints,
  };
}
