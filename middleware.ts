import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  if (host === 'moralclarity.ai') {
    const url = new URL(req.url);
    url.host = 'www.moralclarity.ai';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  // skip static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
