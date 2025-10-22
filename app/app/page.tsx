// app/app/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import FeatureGrid from "@/app/components/FeatureGrid";

export const dynamic = "force-dynamic";

export default async function AppDashboard() {
  // server-side session check using the cookie
  const cookieStore = cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
      auth: { persistSession: false },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/auth?next=${encodeURIComponent("/app")}`);
  }

  return (
    <main className="min-h-screen">
      <FeatureGrid />
    </main>
  );
}
