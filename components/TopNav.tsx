// components/TopNav.tsx
import Link from "next/link";

export default function TopNav() {
  return (
    <div className="border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-10 max-w-6xl items-center px-4 text-sm text-neutral-300 gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
        <Link
          href="/memories"
          className="hover:text-white transition-colors flex-shrink-0"
        >
          Memories
        </Link>
        <Link
          href="/journey"
          className="hover:text-white transition-colors flex-shrink-0"
        >
          Journey Planner
        </Link>
        <Link
          href="/workspace"
          className="hover:text-white transition-colors flex-shrink-0"
        >
          Workspaces
        </Link>
        <Link
          href="/status"
          className="hover:text-white transition-colors flex-shrink-0"
        >
          System
        </Link>
      </div>
    </div>
  );
}
