/**
 * Aesthetic Engine 4.0 — Hybrid (Screenshot Repair + UI Compiler)
 *
 * INPUTS:
 *  1) <aesthetic> JSON blocks produced by Solace Vision
 *  2) Raw "issues" extracted from screenshots or Vision messages
 *
 * OUTPUTS:
 *  - Full React (Next.js + shadcn) components
 *  - Responsive Tailwind code
 *  - Multi-section templates
 *  - Visual rhythm, spacing, contrast, motion suggestions
 *  - Layout repair recommendations
 */

export type AestheticHint = {
  mode?: "auto-repair" | "compiler" | "hybrid";

  // High-level structural inference
  layout?: string;                         // "hero", "card-grid", "dashboard-2col"
  sections?: Array<{
    id: string;
    layout: string;
    summary?: string;
  }>;

  // Visual findings
  issues?: string[];                       // from screenshot analysis
  strengths?: string[];
  suggestions?: string[];

  // Extracted design tokens
  palette?: Record<string, string>;        // bg, fg, accent, surface, card, border
  spacing?: Record<string, string>;        // sm/md/lg vertical or horizontal rhythm
  typography?: Record<string, string>;     // heading/body/mono rules

  // Additional metadata
  notes?: string;
};

export type AestheticCodeResult = {
  summary: string;
  components: string[];                    // list of compiled React components
  files: Record<string, string>;           // filename → full code
  designTokens: Record<string, any>;
  tailwindNotes: string[];
  layoutWarnings: string[];
};

/* ============================================================
   Core Engine
   ============================================================ */
export function generateUIFromAesthetics(hint: AestheticHint): AestheticCodeResult {
  const mode = hint.mode || "hybrid";

  const issues = hint.issues || [];
  const suggestions = hint.suggestions || [];
  const sections = hint.sections || [];

  const components: string[] = [];
  const files: Record<string, string> = {};
  const tailwindNotes: string[] = [];
  const layoutWarnings: string[] = [];

  /* ============================================================
        1.  Layout Repair Engine (Screenshot → Repair)
     ============================================================ */

  if (mode === "auto-repair" || mode === "hybrid") {
    for (const issue of issues) {
      const low = issue.toLowerCase();

      if (low.includes("spacing"))
        tailwindNotes.push("Adjust vertical rhythm → space-y-6, gap-8");

      if (low.includes("contrast"))
        tailwindNotes.push("Use text-neutral-100 on bg-neutral-900 or #0f0f0f");

      if (low.includes("alignment"))
        tailwindNotes.push("Use mx-auto, grid-cols-12, and col-span patterns");

      if (low.includes("density"))
        tailwindNotes.push("Increase padding: px-8 py-10 on surface blocks");

      if (low.includes("card"))
        tailwindNotes.push("Use rounded-2xl shadow-sm bg-neutral-900/50");
    }
  }

  /* ============================================================
        2.  Compiler Mode (JSON → React Components)
     ============================================================ */

  if ((mode === "compiler" || mode === "hybrid") && sections.length) {
    for (const sec of sections) {
      const code = compileSection(sec);
      components.push(sec.id);
      files[`Section_${sec.id}.tsx`] = code;
    }
  }

  /* ============================================================
        3.  Fallback Generator (simple block)
     ============================================================ */

  if (!sections.length) {
    const fallback = defaultGenericBlock();
    components.push("GenericBlock");
    files["GenericBlock.tsx"] = fallback;
  }

  /* ============================================================
        4.  Summary
     ============================================================ */

  const summary =
    [
      `Mode: ${mode}`,
      hint.layout ? `Detected layout: ${hint.layout}` : "",
      issues.length ? `Issues: ${issues.join(", ")}` : "",
      suggestions.length ? `Suggestions: ${suggestions.join("; ")}` : "",
    ]
      .filter(Boolean)
      .join("\n");

  return {
    summary,
    components,
    files,
    designTokens: {
      palette: hint.palette || {},
      spacing: hint.spacing || {},
      typography: hint.typography || {},
    },
    tailwindNotes,
    layoutWarnings,
  };
}

/* ============================================================
   Section Compiler
   ============================================================ */

function compileSection(sec: {
  id: string;
  layout: string;
  summary?: string;
}): string {
  const layout = sec.layout.toLowerCase();

  if (layout.includes("hero")) return heroTemplate(sec);
  if (layout.includes("grid")) return gridTemplate(sec);
  if (layout.includes("two") || layout.includes("2col")) return twoColTemplate(sec);

  return genericTemplate(sec);
}

/* ============================================================
   Templates
   ============================================================ */

function heroTemplate(sec: any): string {
  return `
"use client";
import { Button } from "@/components/ui/button";

export default function ${sec.id}() {
  return (
    <section className="bg-[#0f172a] text-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {/* Headline */}
          </h1>
          <p className="text-neutral-300 text-lg leading-relaxed">
            {/* Subtitle */}
          </p>
          <Button className="mt-4">Get Started</Button>
        </div>

        <div className="flex justify-center items-center">
          <div className="w-full h-64 bg-neutral-800 rounded-xl" />
        </div>
      </div>
    </section>
  );
}
`;
}

function gridTemplate(sec: any): string {
  return `
"use client";

export default function ${sec.id}() {
  return (
    <section className="py-16 px-6 md:px-12">
      <h2 className="text-xl font-semibold mb-8">{/* Title */}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1,2,3].map(i => (
          <div
            key={i}
            className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6"
          >
            <h3 className="font-medium mb-2">{/* Card Title */}</h3>
            <p className="text-neutral-400">{/* Body */}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
}

function twoColTemplate(sec: any): string {
  return `
"use client";

export default function ${sec.id}() {
  return (
    <section className="py-20 px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>{/* Left Content */}</div>
        <div>{/* Right Content */}</div>
      </div>
    </section>
  );
}
`;
}

function genericTemplate(sec: any): string {
  return `
"use client";

export default function ${sec.id}() {
  return (
    <section className="py-16 px-6 md:px-12">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-10">
        {/* Content */}
      </div>
    </section>
  );
}
`;
}

/* ============================================================
   Fallback simple block
   ============================================================ */

function defaultGenericBlock(): string {
  return `
"use client";

export default function GenericBlock() {
  return (
    <section className="py-16 px-6 md:px-12">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-10">
        {/* Fallback content */}
      </div>
    </section>
  );
}
`;
}
