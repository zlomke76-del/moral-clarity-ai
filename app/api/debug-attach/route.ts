// app/api/debug-attach/route.ts
// Temporary endpoint to inspect signed URLs / content-types during triage.
import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const url = body?.url as string | undefined;
  if (!url) return NextResponse.json({ error: 'no url' }, { status: 400 });

  try {
    const r = await fetch(url);
    const contentType = r.headers.get('content-type') || 'unknown';
    const status = r.status;
    const ab = await r.arrayBuffer();
    const buf = Buffer.from(ab);
    const preview = buf.slice(0, 1000).toString('utf8').replace(/\0/g, '');
    return NextResponse.json({ status, contentType, length: buf.length, preview });
  } catch (e: any) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
