"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const supabase = createSupabaseBrowser();

      // 1. Let Supabase read tokens from URL (implicit flow)
      const { error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) {
        console.error("Error loading session:", sessionErr);
      }

      // 2. Get the user — if missing, fallback to sign-in
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/sign-in?err=no_user");
        return;
      }

      const userEmail = user.email!;
      
      // 3. Look up the user's workspace
      const { data: membership, error: memErr } = await supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("email", userEmail)
        .maybeSingle();

      if (memErr) {
        console.error("workspace lookup error:", memErr);
      }

      // 4. If user has a workspace → send them there
      if (membership?.workspace_id) {
        router.replace(`/w/${membership.workspace_id}`);
        return;
      }

      // 5. If user is new → send to onboarding or workspace creation
      router.replace("/welcome"); // You can adjust this
    };

    run();
  }, [router, params]);

  return (
    <div className="min-h-screen grid place-items-center text-white">
      <p>Finishing sign-in…</p>
    </div>
  );
}


