// app/api/spaces/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies } // <-- just pass the function, no adapter object
  )

  const body = await req.json()
  // TODO: use supabase with RLS (e.g., supabase.from('spaces').insert(...))
  return NextResponse.json({ ok: true })
}
