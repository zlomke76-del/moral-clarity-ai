// app/dev/impersonate/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Cookie says: treat this session as an authenticated demo user
  const res = NextResponse.redirect(new URL("/app", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
  res.cookies.set("mcai_demo", "1", { httpOnly: true, sameSite: "lax", path: "/" });
  // Optional: mock plan/persona for entitlement checks
  res.cookies.set("mcai_demo_entitlements", JSON.stringify({ plan: "Plus", isPaid: true }), {
    httpOnly: false, sameSite: "lax", path: "/"
  });
  return res;
}
