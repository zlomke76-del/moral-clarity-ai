"use client";

import { useEffect, useState } from "react";
import React from "react";
import { createBrowserClient } from "@supabase/ssr";

// Section container
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 border border-neutral-700 rounded-lg p-4 bg-neutral-900">
      <h2 className="text-lg font-semibold mb-2 text-white">{title}</h2>
      {children}
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="inline-block w-4 h-4 text-green-500 mr-1">&#10003;</span>
  );
}
function WarnIcon() {
  return (
    <span className="inline-block w-4 h-4 text-yellow-400 mr-1">&#9888;</span>
  );
}

type Title = { title: string; primary: boolean };
type Email = {
  email: string;
  primary: boolean;
  verified: boolean;
  label: string;
};
type Fields = {
  name: string;
  titles: Title[];
  emails: Email[];
  contact_info: string;
  address: string;
  city: string;
  state: string;
  special_instructions: string;
};

const initialFields: Fields = {
  name: "",
  titles: [{ title: "", primary: true }],
  emails: [{ email: "", primary: true, verified: false, label: "" }],
  contact_info: "",
  address: "",
  city: "",
  state: "",
  special_instructions: "",
};

export default function AccountPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [fields, setFields] = useState<Fields>(initialFields);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      setSaveSuccess(false);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("Unauthorized. Please log in.");
        setLoading(false);
        return;
      }

      setUserId(user.id);

      // ⭐ UPDATED: now reads from public.users
      const { data: profile, error: dbError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (dbError && dbError.code !== "PGRST116") {
        setError("Error loading account data.");
        setLoading(false);
        return;
      }

      if (profile) {
        setFields({
          name: profile.name ?? "",
          titles:
            Array.isArray(profile.titles) && profile.titles.length
              ? profile.titles
              : [{ title: "", primary: true }],
          emails:
            Array.isArray(profile.emails) && profile.emails.length
              ? profile.emails
              : [{ email: "", primary: true, verified: false, label: "" }],
          contact_info: profile.contact_info ?? "",
          address: profile.address ?? "",
          city: profile.city ?? "",
          state: profile.state ?? "",
          special_instructions: profile.special_instructions ?? "",
        });
      }

      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();

    if (!userId) {
      setError("No user authenticated.");
      return;
    }

    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    // ⭐ UPDATED: now writes to public.users
    const { error: upError } = await supabase.from("users").upsert([
      {
        id: userId,
        ...fields,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (upError) {
      setError("Could not save profile. " + upError.message);
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }

    setSaving(false);
  }

  // render omitted for brevity — unchanged
  return <div>{/* unchanged render JSX */}</div>;
}
