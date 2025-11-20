// app/newsroom/cabinet/components/OutletLogo.tsx
"use client";

type Props = {
  name?: string;           // <- make optional so callers can pass only domain
  domain: string;
  size?: "sm" | "md" | "lg";
};

export function OutletLogo({ name, domain, size = "lg" }: Props) {
  const label = name && name.trim().length > 0 ? name : domain;
  const initials = getInitials(label);
  const palette = pickColor(domain || label);
  const { wrapper, text } = sizeClasses(size);

  return (
    <div
      className={[
        "flex items-center justify-center rounded-md",
        "bg-gradient-to-br",
        palette.bg,
        wrapper,
      ].join(" ")}
    >
      <span className={["font-semibold tracking-tight", text].join(" ")}>
        {initials}
      </span>
    </div>
  );
}

function getInitials(label: string): string {
  if (!label) return "?";

  // If it looks like a domain, try to pull the main segment (e.g., "npr", "bbc", "nytimes")
  const domainMatch = label.match(/([a-z0-9-]+)\./i);
  if (domainMatch && domainMatch[1]) {
    const part = domainMatch[1];
    if (part.length <= 3) return part.toUpperCase();
    return part
      .split(/[^a-z0-9]+/i)
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
  }

  // Otherwise, take initials from words
  const words = label
    .replace(/https?:\/\//, "")
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);
  if (!words.length) return label.slice(0, 3).toUpperCase();

  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function pickColor(seed: string) {
  const hash = simpleHash(seed);
  const paletteIndex = hash % COLOR_PALETTES.length;
  return COLOR_PALETTES[paletteIndex];
}

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const COLOR_PALETTES = [
  { bg: "from-emerald-700/80 via-emerald-500/80 to-emerald-400/80" },
  { bg: "from-sky-700/80 via-sky-500/80 to-sky-400/80" },
  { bg: "from-indigo-700/80 via-indigo-500/80 to-indigo-400/80" },
  { bg: "from-amber-700/80 via-amber-500/80 to-amber-400/80" },
  { bg: "from-rose-700/80 via-rose-500/80 to-rose-400/80" },
  { bg: "from-slate-700/80 via-slate-500/80 to-slate-400/80" },
];

function sizeClasses(size: "sm" | "md" | "lg") {
  switch (size) {
    case "sm":
      return { wrapper: "h-8 w-8", text: "text-xs" };
    case "md":
      return { wrapper: "h-10 w-10", text: "text-sm" };
    case "lg":
    default:
      return { wrapper: "h-14 w-14", text: "text-base" };
  }
}
