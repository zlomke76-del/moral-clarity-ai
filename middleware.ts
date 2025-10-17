// middleware.ts at repo root
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host");

  // Redirect .com or www to the canonical .ai host
  if (host === "www.moralclarityai.com" || host === "moralclarityai.com") {
    const url = req.nextUrl.clone();     // preserves pathname + search
    url.protocol = "https";
    url.hostname = "moralclarity.ai";    // only change the host!
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

// Optional: limit middleware to app routes and keep static assets fast
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
