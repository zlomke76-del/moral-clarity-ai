// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import { resolveOrCreateWorkspace } from "@/lib/workspaces";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const supabase = createSupabaseBrowser();

      // Required for implicit flow (magic links); this will also
      // parse the tokens from the URL and persist the session.
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;

      if (!session) {
        router.replace("/auth/sign-in?err=missing-session");
        return;
      }

      // Ensure profile exists in mca_user_profiles
      const { data: profiles, error: profileErr } = await supabase
        .from("mca_user_profiles")
        .select("*")
        .eq("user_uid", session.user.id);

      if (cancelled) return;

      if (profileErr) {
        console.error("mca_user_profiles lookup error", profileErr);
        router.replace("/auth/sign-in?err=profile-error");
        return;
      }

      if (!profiles || profiles.length === 0) {
        const { error: insertErr } = await supabase
          .from("mca_user_profiles")
          .insert({
            user_uid: session.user.id,
            display_name: session.user.email || "User",
          });

        if (cancelled) return;

        if (insertErr) {
          console.error("mca_user_profiles insert error", insertErr);
          router.replace("/auth/sign-in?err=profile-insert-error");
          return;
        }
      }

      // Resolve or create workspace for this user_uid/auth user id
      let workspaceId: string;
      try {
        workspaceId = await resolveOrCreateWorkspace();
      } catch (e) {
        console.error("resolveOrCreateWorkspace error", e);
        router.replace("/auth/sign-in?err=workspace-error");
        return;
      }

      if (cancelled) return;

      // Always land in the workspace; we no longer rely on ?next=
      router.replace(`/w/${workspaceId}`);
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="min-h-screen grid place-items-center bg-black text-white">
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold">Signing you in…</p>
        <p className="text-sm text-neutral-400">
          Please wait while we finish connecting your Solace workspace.
        </p>
      </div>
    </main>
  );
}

