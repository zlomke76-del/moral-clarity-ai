// middleware.ts (repo root)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Your canonical apex
const CANONICAL = "moralclarity.ai";

// Subdomains that should never be rewritten by the host canonicalization
const EXEMPT_SUBDOMAINS = new Set(["app", "studio", "api"]); // adjust as needed

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const url = req.nextUrl;

  // Determine subdomain (if any)
  const parts = host.split(".");
  const sub = parts.length > 2 ? parts[0] : "";
  const base = parts.slice(-2).join(".");

  // 1) Skip exempt subdomains on the canonical base (e.g., app.moralclarity.ai)
  if (EXEMPT_SUBDOMAINS.has(sub) && base === CANONICAL) {
    return NextResponse.next();
  }

  // 2) .com → .ai (preserve subdomain, path, query, and hash)
  if (host.endsWith("moralclarityai.com")) {
    const newHost = host.replace("moralclarityai.com", CANONICAL);
    const to = url.clone();
    to.protocol = "https";
    to.hostname = newHost;          // only change the host!
    return NextResponse.redirect(to, 308);
  }

  // 3) www → apex (comment this block out if you prefer www as primary)
  if (host === `www.${CANONICAL}`) {
    const to = url.clone();
    to.protocol = "https";
    to.hostname = CANONICAL;        // www → apex
    return NextResponse.redirect(to, 308);
  }

  return NextResponse.next();
}

// Skip static assets for performance
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
