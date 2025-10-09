// app/(dashboard)/spaces/page.tsx
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export default async function SpacesPage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options?: CookieOptions) =>
          cookieStore.set({ name, value, ...options }),
        remove: (name: string, options?: CookieOptions) =>
          cookieStore.set({ name, value: '', ...options, maxAge: 0 }),
      },
    }
  );

  const { data: spaces } = await supabase
    .from('spaces')
    .select('id, name, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Spaces</h1>
      <div className="grid gap-3">
        {spaces?.map((space) => (
          <div key={space.id} className="rounded border p-3">
            <div className="font-medium">{space.name}</div>
            <div className="text-xs opacity-60">{space.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
