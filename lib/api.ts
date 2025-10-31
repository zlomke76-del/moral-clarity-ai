// lib/api.ts
const API_BASE = 'https://studio.moralclarity.ai';

export async function askSolace(payload: any) {
  const session = await supabase.auth.getSession();
  const uid = session.data.session?.user?.id ?? 'guest';
  return fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Key': uid,            // <- REQUIRED for memory writes
      'X-Last-Mode': payload.lastMode ?? '',
    },
    body: JSON.stringify(payload),
  });
}
