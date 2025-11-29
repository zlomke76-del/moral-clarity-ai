// app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  // After login, send users somewhere real instead of 404.
  // You can change this to /w/<workspaceId> later if you want.
  redirect("/memory");
}
