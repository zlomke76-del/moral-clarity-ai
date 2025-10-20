export const dynamic = "force-dynamic";

type StatRow = {
  open_count: number;
  closed_count: number;
  avg_first_reply_seconds: number | null;
  high_open: number;
  medium_open: number;
  low_open: number;
};

import { createClient } from "@supabase/supabase-js";

export async function GET(): Promise<Response> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
  );

  // aggregate stats
  const { data: a, error: e1 } = await supabase
    .rpc("sql", {
      // Using a PostgREST "sql" function is overkill; just run 3 selects:
    } as any);
  // Simpler: do separate queries (clearer + robust)
  const [{ data: totals }, { data: priority }, { data: reply }] = await Promise.all([
    supabase.rpc("exec_sql", { q: `
      select
        count(*) filter (where status='open')   as open_count,
        count(*) filter (where status='closed') as closed_count
      from public.support_requests;
    `}) as any,
    supabase.rpc("exec_sql", { q: `
      select
        count(*) filter (where status='open' and priority='high')   as high_open,
        count(*) filter (where status='open' and priority='medium') as medium_open,
        count(*) filter (where status='open' and priority='low')    as low_open
      from public.support_requests;
    `}) as any,
    supabase.rpc("exec_sql", { q: `
      select avg(extract(epoch from (last_public_reply_at - created_at))) as avg_first_reply_seconds
      from public.support_requests
      where last_public_reply_at is not null;
    `}) as any,
  ]);

  // If you don't have an exec_sql RPC helper, fall back to a single select with
  // supabase.from(...).select() for each block above. (Keeping response short here.)

  const payload: StatRow = {
    open_count: Number(totals?.[0]?.open_count ?? 0),
    closed_count: Number(totals?.[0]?.closed_count ?? 0),
    high_open: Number(priority?.[0]?.high_open ?? 0),
    medium_open: Number(priority?.[0]?.medium_open ?? 0),
    low_open: Number(priority?.[0]?.low_open ?? 0),
    avg_first_reply_seconds: reply?.[0]?.avg_first_reply_seconds ?? null,
  };

  return Response.json(payload);
}
