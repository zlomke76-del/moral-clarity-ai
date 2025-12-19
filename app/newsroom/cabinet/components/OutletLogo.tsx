// app/newsroom/cabinet/components/OutletLogo.tsx
"use client";

import { useState } from "react";

type Props = {
  domain: string;
  name: string;
  logoUrl?: string | null;
  className?: string;
};

export default function OutletLogo({
  domain,
  name,
  logoUrl,
  className,
}: Props) {
  const [broken, setBroken] = useState(false);

  const baseClass =
    "flex items-center justify-center overflow-hidden rounded-lg bg-neutral-900 text-sm font-semibold text-neutral-50";
  const sizeClass = className ?? "h-10 w-10";

  const labelSource = name || domain || "?";
  const initial =
    labelSource.trim().length > 0
      ? labelSource.trim()[0]!.toUpperCase()
      : "?";

  // If no logo URL or it failed, render fallback
  if (!logoUrl || broken) {
    return (
      <div className={`${baseClass} ${sizeClass}`}>
        {initial}
      </div>
    );
  }

  return (
    <div className={`${baseClass} ${sizeClass}`}>
      <img
        src={logoUrl}
        alt={name || domain}
        className="h-full w-full object-contain"
        onError={() => setBroken(true)}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
