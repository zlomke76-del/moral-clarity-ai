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

  return (
    <div className="max-w-3xl mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      {loading && (
        <div className="text-gray-300 mb-4">Loading your profile…</div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-800 text-red-200 rounded">
          {error}
        </div>
      )}

      {saveSuccess && (
        <div className="mb-4 p-3 bg-green-800 text-green-200 rounded">
          Profile saved successfully
        </div>
      )}

      {!loading && (
        <form onSubmit={saveProfile} className="space-y-6">

          <Section title="Basic Information">
            <label className="block mb-2">
              <span className="text-gray-300">Name</span>
              <input
                type="text"
                value={fields.name}
                onChange={(e) =>
                  setFields({ ...fields, name: e.target.value })
                }
                className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700"
              />
            </label>
          </Section>

          <Section title="Contact Information">
            <label className="block mb-2">
              <span className="text-gray-300">Address</span>
              <input
                type="text"
                value={fields.address}
                onChange={(e) =>
                  setFields({ ...fields, address: e.target.value })
                }
                className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700"
              />
            </label>

            <label className="block mb-2">
              <span className="text-gray-300">City</span>
              <input
                type="text"
                value={fields.city}
                onChange={(e) =>
                  setFields({ ...fields, city: e.target.value })
                }
                className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700"
              />
            </label>

            <label className="block mb-2">
              <span className="text-gray-300">State</span>
              <input
                type="text"
                value={fields.state}
                onChange={(e) =>
                  setFields({ ...fields, state: e.target.value })
                }
                className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700"
              />
            </label>

            <label className="block mb-2">
              <span className="text-gray-300">Contact Info</span>
              <input
                type="text"
                value={fields.contact_info}
                onChange={(e) =>
                  setFields({ ...fields, contact_info: e.target.value })
                }
                className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700"
              />
            </label>
          </Section>

          <Section title="Special Instructions">
            <textarea
              value={fields.special_instructions}
              onChange={(e) =>
                setFields({
                  ...fields,
                  special_instructions: e.target.value,
                })
              }
              className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700"
              rows={4}
            />
          </Section>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      )}
    </div>
  );
}
