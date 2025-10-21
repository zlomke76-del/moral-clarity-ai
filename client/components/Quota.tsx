// client/components/Quota.tsx
'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Quota() {
  const supabase = createClientComponentClient();

  const [capMb, setCapMb] = useState<number | null>(null);
  const [usedMb, setUsedMb] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1) Cap (falls back to 1024 if no row)
      const { data: capRow } = await supabase
        .from('user_caps')
        .select('value')
        .eq('user_id', user.id)
        .eq('cap', 'memory_quota_mb')
        .maybeSingle();
      const cap = capRow?.value ?? 1024;
      setCapMb(cap);

      // 2) Usage (replace with your real view/table/rpc)
      // Example assumes a view `memory_usage_mb(user_id, used_mb)`
      const { data: usage } = await supabase
        .from('memory_usage_mb')
        .select('used_mb')
        .eq('user_id', user.id)
        .maybeSingle();

      setUsedMb(usage?.used_mb ?? 0);
    })();
  }, []);

  if (capMb == null || usedMb == null) return null;
  const pct = Math.min(100, Math.round((usedMb / capMb) * 100));

  return (
    <div className="text-sm">
      <div className="mb-1">Memory: {usedMb} / {capMb} MB</div>
      <div className="h-2 w-64 bg-zinc-800 rounded">
        <div className="h-2 bg-blue-600 rounded" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
