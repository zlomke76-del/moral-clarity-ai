// app/api/memory/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getUserKey(req: Request) {
  return req.headers.get('x-user-key') || 'guest';
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error } = await sb.from('user_memories').delete().eq('id', params.id);
  if (error) return new NextResponse(error.message, { status: 400 });
  return NextResponse.json({ ok: true });
}
