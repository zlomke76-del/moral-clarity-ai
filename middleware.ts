// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host');
  if (host === 'www.moralclarityai.com') {
    const url = req.nextUrl.clone();
    url.host = 'moralclarity.ai';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}
