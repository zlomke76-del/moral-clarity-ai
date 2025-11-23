// app/newsroom/cabinet/components/OutletLogo.tsx
"use client";

import { useState } from "react";

type Props = {
  domain: string;
  name: string;
  className?: string;
};

export default function OutletLogo({ domain, name, className }: Props) {
  const [broken, setBroken] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state

  const baseClass =
    "flex items-center justify-center overflow-hidden rounded-lg bg-neutral-900 text-sm font-semibold text-neutral-50";
  const sizeClass = className ?? "h-10 w-10";

  const labelSource = name || domain || "?";
  const initial =
    labelSource.trim().length > 0
      ? labelSource.trim()[0]!.toUpperCase()
      : "?";

  if (broken || !domain) {
    return (
      <div className={`${baseClass} ${sizeClass}`}>
        {initial}
      </div>
    );
  }

  const url = `https://logo.clearbit.com/${domain}`;

  return (
    <div className={`${baseClass} ${sizeClass}`}>
      {loading && <span>Loading...</span>} {/* Loading indicator */}
      <img
        src={url}
        alt={name ? `${name} logo` : `Logo for ${domain}`} // More descriptive alt text
        className="h-full w-full object-contain"
        onError={() => {
          setBroken(true);
          setLoading(false); // Stop loading on error
        }}
        onLoad={() => setLoading(false)} // Stop loading when the image loads
      />
    </div>
  );
}
