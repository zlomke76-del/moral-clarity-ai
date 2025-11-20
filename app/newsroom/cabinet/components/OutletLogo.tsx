// app/newsroom/cabinet/components/OutletLogo.tsx
"use client";

import * as React from "react";

type OutletLogoProps = {
  domain: string;
  className?: string;
};

/**
 * Small, neutral outlet logo.
 * Default implementation uses Clearbit-style logo URLs.
 * You can later swap this to a Supabase storage URL map if desired.
 */
export function OutletLogo({ domain, className }: OutletLogoProps) {
  if (!domain) return null;

  const normalized = domain.replace(/^https?:\/\//, "").replace(/\/.+$/, "");
  const src = `https://logo.clearbit.com/${normalized}`;

  return (
    <div
      className={
        "flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-neutral-800 bg-neutral-900/80 " +
        (className ?? "")
      }
    >
      <img
        src={src}
        alt={normalized}
        className="h-full w-full object-contain opacity-80"
        loading="lazy"
        onError={(e) => {
          // If logo lookup fails, fall back to initials
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {/* Fallback initials (shown when img is hidden) */}
      <span className="text-[10px] font-medium uppercase text-neutral-300">
        {normalized
          .replace(/^www\./, "")
          .split(".")[0]
          .slice(0, 3)}
      </span>
    </div>
  );
}
