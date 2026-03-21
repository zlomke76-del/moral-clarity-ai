import Link from "next/link";
import { ArrowLeft, BrainCircuit, Sparkles } from "lucide-react";

import MemoryWorkspaceClient from "./MemoryWorkspaceClient";
import RolodexWorkspaceClient from "./RolodexWorkspaceClient";

export const dynamic = "force-dynamic";

export default async function WorkspaceMemoryPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden px-8 py-7">
      <header className="flex-shrink-0">
        <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.015)_100%)] px-6 py-6 shadow-[0_14px_40px_rgba(0,0,0,0.18)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.08),transparent_28%),radial-gradient(circle_at_left,rgba(56,189,248,0.06),transparent_22%)]" />

          <div className="relative z-10 flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/app"
                className="group inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm font-medium text-white/72 transition-all hover:border-white/14 hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Back to Studio
              </Link>

              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/14 bg-amber-300/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-100/80">
                <Sparkles className="h-3.5 w-3.5" />
                Memory Workspace
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                <BrainCircuit className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  Workspace Memories
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
                  Long-term factual memory and human-managed relationships for
                  this workspace. Review, organize, and steward the information
                  Solace should retain with continuity and care.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  Function
                </div>
                <div className="mt-2 text-sm font-medium text-white/88">
                  Memory Review
                </div>
                <div className="mt-1 text-xs leading-5 text-white/48">
                  Inspect and manage durable factual context.
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  Layer
                </div>
                <div className="mt-2 text-sm font-medium text-white/88">
                  Human Stewardship
                </div>
                <div className="mt-1 text-xs leading-5 text-white/48">
                  Keep memory explicit, curated, and reviewable.
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  Workspace
                </div>
                <div className="mt-2 text-sm font-medium text-white/88">
                  {workspaceId}
                </div>
                <div className="mt-1 text-xs leading-5 text-white/48">
                  Current active workspace context.
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-6 flex-1 min-h-0 overflow-hidden">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.01)_100%)] shadow-[0_16px_50px_rgba(0,0,0,0.2)]">
          <div className="flex-shrink-0 border-b border-white/8 px-6 py-4">
            <div className="text-sm font-medium text-white/88">
              Memory Console
            </div>
            <div className="mt-1 text-xs text-white/45">
              Select, create, and manage workspace memories and associated
              relationships.
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
            <div className="space-y-8">
              <section className="rounded-2xl border border-white/6 bg-black/10 p-4">
                <MemoryWorkspaceClient
                  workspaceId={workspaceId}
                  initialItems={[]}
                />
              </section>

              <section className="rounded-2xl border border-white/6 bg-black/10 p-4">
                <RolodexWorkspaceClient workspaceId={workspaceId} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
