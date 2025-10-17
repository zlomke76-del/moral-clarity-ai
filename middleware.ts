// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  // only redirect apex + www .com → .ai
  if (
    (host === "moralclarityai.com" || host === "www.moralclarityai.com") &&
    !host.startsWith("app.")
  ) {
    const url = req.nextUrl.clone();
    url.protocol = "https";
    url.hostname = "moralclarity.ai"; // canonical
    return NextResponse.redirect(url, 308);
  }

  // do not redirect the app subdomain
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
