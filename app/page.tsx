// app/page.tsx

import { redirect } from "next/navigation";

export default function RootPage() {
  // ✅ Always send root traffic to the main workspace
  redirect("/app");
}

