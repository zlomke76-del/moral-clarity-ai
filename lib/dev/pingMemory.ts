'use client'
import { createClient } from '@/lib/supabase/client'

export async function pingMemory(note = 'hello from UI') {
  const supabase = createClient()
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) throw new Error('No user')
  const user_id = u.user.id

  // WRITE
  const { error: wErr } = await supabase
    .from('memory_pings')
    .insert({ user_id, note })
  if (wErr) throw wErr

  // READ
  const { data, error: rErr } = await supabase
    .from('memory_pings')
    .select('id, note, created_at')
    .order('created_at', { ascending: false })
    .limit(3)
  if (rErr) throw rErr

  console.log('[ping] latest rows', data)
  return data
}
