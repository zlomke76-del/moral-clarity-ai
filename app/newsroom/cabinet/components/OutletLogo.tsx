// app/newsroom/cabinet/components/OutletLogo.tsx
"use client";

import { useState } from "react";

type Props = {
  domain: string;
  name: string;
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

export default function OutletLogo({ domain, name }: Props) {
  const [failed, setFailed] = useState(false);
  const host = normalizeDomain(domain);

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
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-neutral-900 text-[11px] font-semibold text-neutral-100">
        {initials}
      </div>
    );
  }

  const logoUrl = `https://logo.clearbit.com/${host}`;

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      className="h-9 w-9 rounded-md border border-neutral-800 bg-neutral-900 object-contain"
      onError={() => setFailed(true)}
    />
  );
}


