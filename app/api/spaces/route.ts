// app/api/spaces/route.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );

  const body = await req.json();
  const { data, error } = await supabase.rpc('api_create_space', {
    p_name: body.name,
    p_description: body.description ?? '',
    p_topic: body.topic ?? 'general',
    p_is_public: !!body.isPublic,
  });

  if (error) return new Response(error.message, { status: 400 });
  return Response.json({ id: data });
}
