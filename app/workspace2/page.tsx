import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default function Workspace2Redirect() {
  redirect("/app"); // send them to the main workspace route
}
