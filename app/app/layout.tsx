// app/app/layout.tsx
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100">
      {/* LEFT SIDEBAR */}
      <div className="w-64 border-r border-neutral-800 bg-neutral-900/40">
        <NeuralSidebar />
      </div>

      {/* MAIN WORKSPACE AREA */}
      <div className="flex-1 relative overflow-hidden">
        <div className="h-full w-full overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

