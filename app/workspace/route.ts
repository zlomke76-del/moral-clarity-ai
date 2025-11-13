// app/workspace/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const rc = url.searchParams.get('rc'); // route code like "geljkek1"

  // TODO: use rc and user session to look up the right workspace.
  // For now, we can at least return a shape Solace can live with.

  return NextResponse.json(
    {
      ok: true,
      workspace: null,
      rc,
      memoriesEnabled: false,
    },
    { status: 200 },
  );
}
