// lib/supabase/server.ts
// ------------------------------------------------------------
// SERVER-ONLY Supabase client
// - Next.js 16 compatible
// - cookies() is async in server utilities
// ------------------------------------------------------------

import { createServerClient } from '@supabase/ssr'

export function createSupabaseServerClient(req: Request, res: Response) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set(name, value, options)
        },
        remove(name: string, options: any) {
          res.cookies.delete(name, options)
        },
      },
    }
  )
}
