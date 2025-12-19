"use client";

import { useState } from "react";

type Props = {
  domain: string;
  name?: string;
  className?: string;
};

export default function OutletLogo({ domain, name, className }: Props) {
  const [broken, setBroken] = useState(false);

  const sizeClass = className ?? "h-10 w-10";

  const label = name || domain || "?";
  const initial =
    label.trim().length > 0 ? label.trim()[0].toUpperCase() : "?";

  // Normalize domain (IMPORTANT)
  const normalizedDomain = domain
    ?.replace(/^https?:\/\//, "")
    ?.replace(/^www\./, "")
    ?.trim();

  const src = normalizedDomain
    ? `https://logo.clearbit.com/${normalizedDomain}`
    : null;

  // FALLBACK (intentional)
  if (!src || broken) {
    return (
      <div
        className={[
          "flex items-center justify-center rounded-lg",
          "bg-neutral-800 text-neutral-100",
          "font-semibold text-sm",
          sizeClass,
        ].join(" ")}
        title={label}
      >
        {initial}
      </div>
    );
  }

  return (
    <div
      className={[
        "flex items-center justify-center rounded-lg",
        "bg-neutral-900 overflow-hidden",
        sizeClass,
      ].join(" ")}
    >
      <img
        src={src}
        alt={label}
        className="h-full w-full object-contain"
        onError={() => setBroken(true)}
      />
    </div>
  );
}
