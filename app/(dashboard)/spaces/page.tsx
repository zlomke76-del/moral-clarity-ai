// app/(dashboard)/spaces/page.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function SpacesPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );

  // thanks to RLS, this returns only the caller’s spaces
  const { data: spaces } = await supabase
    .from('spaces')
    .select('id,name,created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="grid gap-4">
      {spaces?.map(s => (
        <div key={s.id} className="rounded border p-3">
          <div className="font-medium">{s.name}</div>
          <div className="text-xs opacity-60">{s.id}</div>
        </div>
      ))}
    </div>
  );
}
