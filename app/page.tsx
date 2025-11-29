// app/page.tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  // Always go to the main workspace
  redirect("/w/" + process.env.NEXT_PUBLIC_MCA_WORKSPACE_ID);
}


