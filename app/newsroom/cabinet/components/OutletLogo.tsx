// app/newsroom/cabinet/components/OutletLogo.tsx
"use client";

import { useState } from "react";

type Props = {
  domain: string;
  name: string;
  className?: string;
};

function normalizeDomain(domain: string): string {
  // crude normalizer: strip protocol & path, keep host
  try {
    if (domain.startsWith("http://") || domain.startsWith("https://")) {
      const url = new URL(domain);
      return url.hostname;
    }
    return domain.split("/")[0];
  } catch {
    return domain;
  }
}

export default function OutletLogo({ domain, name, className }: Props) {
  const [failed, setFailed] = useState(false);
  const host = normalizeDomain(domain);

  const baseClasses =
    "rounded-md border border-neutral-800 bg-neutral-900 object-contain";
  const combined = [baseClasses, className || "h-9 w-9"].join(" ");

  if (failed || !host) {
    // simple initials fallback
    const initials =
      name && name.length > 0
        ? name
            .replace(/^https?:\/\//, "")
            .replace(/\..+$/, "")
            .slice(0, 3)
            .toUpperCase()
        : "MC";

    return (
      <div className={combined + " flex items-center justify-center text-[11px] font-semibold text-neutral-100"}>
        {initials}
      </div>
    );
  }

  const logoUrl = `https://logo.clearbit.com/${host}`;

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      className={combined}
      onError={() => setFailed(true)}
    />
  );
}


