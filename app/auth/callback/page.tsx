"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import { resolveOrCreateWorkspace } from "@/lib/workspaces";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    (async () => {
      const supabase = createSupabaseBrowser();

      // Required for implicit flow (magic links)
      await supabase.auth.getSession();

      // Validate that user exists
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth/sign-in?err=missing-session");
        return;
      }

      // Ensure profile exists in mca_user_profiles
      const { data: existingProfiles } = await supabase
        .from("mca_user_profiles")
        .select("*")
        .eq("user_uid", session.user.id);

      if (!existingProfiles || existingProfiles.length === 0) {
        await supabase.from("mca_user_profiles").insert({
          user_uid: session.user.id,
          display_name: session.user.email || "User",
        });
      }

      // Resolve workspace
      const workspaceId = await resolveOrCreateWorkspace();

      // Preferred redirect
      const next = params?.get("next") || `/w/${workspaceId}`;
      router.replace(next);
    })();
  }, []);

  return (
    <main className="min-h-screen grid place-items-center text-white">
      Processing login…
    </main>
  );
}

