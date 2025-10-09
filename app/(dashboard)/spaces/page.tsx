// app/(dashboard)/spaces/page.tsx
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export default async function SpacesPage() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Next's cookies() is mutable in Server Components
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  // If the user isn’t signed in this just returns an empty list (RLS)
  const { data: spaces, error } = await supabase
    .from('spaces')
    .select('id,name,created_at')
    .order('created_at', { ascending: false })

  if (error) {
    // helpful render-time message while developing
    return (
      <div className="text-sm text-red-600">
        Failed to load spaces: {error.message}
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {(spaces ?? []).map((s) => (
        <div key={s.id} className="rounded border p-3">
          <div className="font-medium">{s.name}</div>
          <div className="text-xs opacity-60">{s.id}</div>
        </div>
      ))}
      {!spaces?.length && (
        <div className="text-sm opacity-60">
          No spaces yet. Create your first one from “New Project”.
        </div>
      )}
    </div>
  )
}
