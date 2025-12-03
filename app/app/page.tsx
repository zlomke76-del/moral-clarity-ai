// app/app/page.tsx
import { redirect } from "next/navigation";

/**
 * Legacy /app route.
 *
 * We used to send magic-link callbacks to /app, but the main workspace
 * shell now lives at the root (/). This page simply redirects there so:
 * - Old magic links keep working.
 * - Any hard-coded /app links don't 404.
 */
export default function AppIndexPage() {
  redirect("/");
}
