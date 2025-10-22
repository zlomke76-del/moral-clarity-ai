// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/app/:path*"], // only guard /app routes
};

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Allow the unauthenticated preview route if you keep it under /app/preview
  if (pathname.startsWith("/app/preview")) {
    return NextResponse.next();
  }

  // If you later add cookie-based checks here, you can redirect unauthenticated users:
  // (We keep logic simple because the server components already check session.)
  return NextResponse.next();
}
