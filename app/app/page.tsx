// app/app/page.tsx

/**
 * Main Solace workspace entry.
 *
 * We don't need to render the chat UI directly here because SolaceDock
 * is mounted globally in app/layout.tsx. This page's job is simply to
 * provide a stable surface for that workspace.
 */
export default function AppIndexPage() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* SolaceDock renders globally; this keeps layout centered. */}
    </div>
  );
}
