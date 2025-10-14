import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.rpc("exec_sql", {
    q: `
      select category,
        count(*) filter (where status='open')   as open_count,
        count(*) filter (where status='closed') as closed_count
      from public.support_requests
      group by category
      order by category;
    `,
  } as any);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data ?? []);
}
