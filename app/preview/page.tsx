// app/preview/page.tsx
// Temporary no-auth preview for the Six Blocks dashboard.
// Visit: https://studio.moralclarity.ai/preview?k=YOUR_PREVIEW_KEY
// Set PREVIEW_KEY in Vercel env. Delete this file when done.

import { notFound, redirect } from "next/navigation";
import FeatureGrid from "@/app/components/FeatureGrid";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default function PreviewPage({
  searchParams,
}: {
  searchParams: { k?: string };
}) {
  const requiredKey = process.env.PREVIEW_KEY;

  if (process.env.PREVIEW_DISABLED === "true") {
    redirect("/");
  }

  if (requiredKey) {
    if (!searchParams?.k) return notFound();
    if (searchParams.k !== requiredKey) return notFound();
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-2">
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-amber-200">
          <strong>Preview mode:</strong> No auth. Don’t share this link.
        </div>
      </div>
      <FeatureGrid />
    </main>
  );
}
