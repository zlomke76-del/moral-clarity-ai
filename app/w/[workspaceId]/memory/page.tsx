// /app/w/[workspaceId]/memory/page.tsx
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase';
import MemoryComposer from '@/components/MemoryComposer';
import MemoryList from '@/components/MemoryList';

export const dynamic = 'force-dynamic';

export default async function WorkspaceMemoryPage({
  params,
  searchParams,
}: {
  params: { workspaceId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const workspaceId = params.workspaceId;

  // Pull recent workspace memories
  const sb = supabaseServer();
  const { data, error } = await sb
    .schema('mca')
    .from('memories')
    .select('id,title,created_at,workspace_id')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(50);

  const rows =
    !error && Array.isArray(data) ? data : [];

  return (
    <section className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Workspace Memories</h1>
          <p className="text-sm text-neutral-400">
            Workspace: <code className="text-neutral-300">{workspaceId}</code>
          </p>
        </div>
        <Link
          href={`/w/${workspaceId}`}
          className="text-sm text-neutral-300 hover:text-white underline underline-offset-4"
        >
          Back to workspace
        </Link>
      </header>

      <MemoryComposer workspaceId={workspaceId} />

      <MemoryList items={rows} emptyHint="No memories yet. Add your first above." />
    </section>
  );
}
