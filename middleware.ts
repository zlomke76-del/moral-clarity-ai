import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const CANONICAL = "moralclarity.ai";
const EXEMPT_SUBDOMAINS = new Set(["app", "studio", "api"]);

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const url = req.nextUrl;

  const parts = host.split(".");
  const sub = parts.length > 2 ? parts[0] : "";
  const base = parts.slice(-2).join(".");

  // Don't touch app/studio on the canonical base
  if (EXEMPT_SUBDOMAINS.has(sub) && base === CANONICAL) {
    return NextResponse.next();
  }

  // .com → .ai (preserve subdomain, path, query)
  if (host.endsWith("moralclarityai.com")) {
    const to = url.clone();
    to.protocol = "https";
    to.hostname = host.replace("moralclarityai.com", CANONICAL);
    return NextResponse.redirect(to, 308);
  }

  // OPTIONAL: www → apex (do NOT do apex → www)
  if (host === `www.${CANONICAL}`) {
    const to = url.clone();
    to.protocol = "https";
    to.hostname = CANONICAL;
    return NextResponse.redirect(to, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
