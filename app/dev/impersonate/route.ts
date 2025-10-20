import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect("/");
  res.cookies.set("mcai_demo", "1", {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
  });
  return res;
}
