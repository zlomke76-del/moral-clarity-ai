import type { ReactNode } from "react";

export default function EdgeOfKnowledgeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="w-full flex justify-center">
      <div
        className="
          w-full max-w-[1360px]
          rounded-[2.5rem]
          border border-sky-900/40
          bg-[#020617]/84
          backdrop-blur-xl
          px-6 py-8
          shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_40px_120px_rgba(0,0,0,0.65)]
          md:px-8 md:py-10
        "
      >
        {children}
      </div>
    </section>
  );
}
