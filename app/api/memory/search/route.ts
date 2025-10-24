// app/api/memory/search/route.ts
import { NextResponse } from 'next/server';
import { searchMemories } from '@/lib/memory';

function getUserKey(req: Request) {
  return req.headers.get('x-user-key') || 'guest';
}

export async function POST(req: Request) {
  const user_key = getUserKey(req);
  const { query, k = 8 } = await req.json();
  if (!query) return new NextResponse('query required', { status: 400 });
  const hits = await searchMemories(user_key, query, k);
  return NextResponse.json({ hits });
}
