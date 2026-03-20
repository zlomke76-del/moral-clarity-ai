export default function EdgeOfKnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative w-full flex justify-center py-12">
      {/* HARD BACKDROP ISOLATION LAYER */}
      <div className="absolute inset-0 bg-[#020617]/60 backdrop-blur-sm" />

      <div
        className="
          relative z-10
          w-full max-w-[1360px]
          rounded-[2.5rem]

          bg-[#020617]/95
          border border-sky-900/40

          px-8 py-10

          shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_50px_140px_rgba(0,0,0,0.75)]

          md:px-10 md:py-12
        "
      >
        {children}
      </div>
    </section>
  );
}
