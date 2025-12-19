// app/newsroom/layout.tsx
import { ReactNode } from "react";

export const metadata = {
  title: "Moral Clarity Newsroom",
  description: "Solace-guided newsroom workspace",
};

export default function NewsroomLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-screen-xl px-6 py-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-serif tracking-tight">
            Moral Clarity Newsroom
          </h1>
          <p className="mt-2 text-sm opacity-80">
            Powered by Solace — neutral, transparent, ethical journalism tools.
          </p>
        </header>

        {children}
      </div>
    </div>
  );
}
