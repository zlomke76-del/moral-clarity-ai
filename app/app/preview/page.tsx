// app/app/preview/page.tsx
// Temporary, no-auth preview of the Six Blocks dashboard.
// Visit: https://studio.moralclarity.ai/app/preview?k=YOUR_PREVIEW_KEY
// Set PREVIEW_KEY in Vercel (Environment Variables) to control access.

import { notFound, redirect } from "next/navigation";
import FeatureGrid from "@/app/components/FeatureGrid";

export const dynamic = "force-dynamic";
export const metadata = {
  robots: { index: false, follow: false }, // don't let search engines index this
};

export default function PreviewPage({
  searchParams,
}: {
  searchParams: { k?: string };
}) {
  const requiredKey = process.env.PREVIEW_KEY;

  // If you set PREVIEW_KEY in Vercel, require it via ?k=...
  if (requiredKey) {
    if (!searchParams?.k) {
      return notFound(); // no key provided
    }
    if (searchParams.k !== requiredKey) {
      return notFound(); // wrong key
    }
  }

  // Optional: if you decide to disable the preview entirely later,
  // set PREVIEW_DISABLED=true in Vercel to hard redirect away.
  if (process.env.PREVIEW_DISABLED === "true") {
    redirect("/"); // or "/auth"
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-2">
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-amber-200">
          <strong>Preview mode:</strong> This view ignores authentication. Don’t share the link publicly.
        </div>
      </div>
      <FeatureGrid />
    </main>
  );
}
