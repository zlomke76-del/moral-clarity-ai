// components/Breadcrumb.tsx
"use client";

import Link from "next/link";

export type Crumb = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-zinc-600">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-zinc-900" : undefined}>{item.label}</span>
              )}
              {!isLast && <span className="text-zinc-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
