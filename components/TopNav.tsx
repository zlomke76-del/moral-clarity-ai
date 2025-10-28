// components/TopNav.tsx
import Link from "next/link";

export default function TopNav() {
  return (
    <div className="border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-10 max-w-6xl items-center gap-6 px-4 text-sm text-neutral-300">
        <Link href="/memories" className="hover:text-white transition-colors">
          Memories
        </Link>
        <Link href="/journey" className="hover:text-white transition-colors">
          Journey Planner
        </Link>
        <Link href="/workspace" className="hover:text-white transition-colors">
          Workspaces
        </Link>
        <Link href="/status" className="hover:text-white transition-colors">
          System
        </Link>
      </div>
    </div>
  );
}
