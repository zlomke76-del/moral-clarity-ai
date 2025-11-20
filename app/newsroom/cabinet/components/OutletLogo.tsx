"use client";

type Props = {
  domain: string;
  name?: string;
  className?: string;
};

/**
 * Lightweight outlet logo renderer.
 *
 * - Attempts to load `https://logo.clearbit.com/<domain>`
 * - Falls back to an initial in a neutral pill if the logo fails.
 */
export default function OutletLogo({ domain, name, className }: Props) {
  const initial =
    (name || domain || "?")
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .charAt(0)
      .toUpperCase() || "?";

  const src = `https://logo.clearbit.com/${domain}`;

  return (
    <div
      className={[
        "flex items-center justify-center overflow-hidden rounded-md bg-neutral-900",
        className ?? "h-8 w-8",
      ].join(" ")}
    >
      {/* Using plain img here keeps it simple and avoids Next/Image config in app dir */}
      <img
        src={src}
        alt={name || domain}
        className="h-full w-full object-contain"
        onError={(e) => {
          // If logo fails, show initial instead
          const target = e.currentTarget;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.textContent = initial;
            parent.classList.add(
              "text-xs",
              "font-semibold",
              "text-neutral-100"
            );
          }
        }}
      />
    </div>
  );
}

