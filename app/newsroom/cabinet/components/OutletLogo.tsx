"use client";

import { useState } from "react";

type Props = {
  domain: string;
  name: string;
  className?: string;
};

export default function OutletLogo({ domain, name, className }: Props) {
  const [broken, setBroken] = useState(false);

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
      <img
        src={url}
        alt={name || domain}
        className="h-full w-full object-contain"
        onError={() => setBroken(true)}
      />
    </div>
  );
}
