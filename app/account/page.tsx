"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session, User } from "@supabase/supabase-js";

// Section container
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 border border-neutral-700 rounded-lg p-4 bg-neutral-900">
      <h2 className="text-lg font-semibold mb-2 text-white">{title}</h2>
      {children}
    </div>
  );
}

function CheckIcon() {
  return <span className="inline-block w-4 h-4 text-green-500 mr-1">&#10003;</span>;
}
function WarnIcon() {
  return <span className="inline-block w-4 h-4 text-yellow-400 mr-1">&#9888;</span>;
}

const initialFields = {
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
  const supabase = createClientComponentClient();
  const [fields, setFields] = useState(initialFields);

  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // User ID
  const [userId, setUserId] = useState<string | null>(null);

  // On mount, fetch user data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      setSaveSuccess(false);
      // Get user ID from auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!user) {
        setError("Unauthorized. Please log in.");
        setLoading(false);
        return;
      }
      setUserId(user.id);

      // Fetch profile
      const { data, error: dbError } = await supabase
        .from("account.users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (dbError && dbError.code !== "PGRST116") { // "No rows found" is allowed (new user)
        setError("Error loading account data.");
        setLoading(false);
        return;
      }

      if (data) {
        setFields({
          name: data.name || "",
          titles: data.titles?.length
            ? data.titles
            : [{ title: "", primary: true }],
          emails: data.emails?.length
            ? data.emails
            : [{ email: "", primary: true, verified: false, label: "" }],
          contact_info: data.contact_info || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          special_instructions: data.special_instructions || "",
        });
      }
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler helpers
  function mutateField<K extends keyof typeof initialFields>(field: K, value: (typeof initialFields)[K]) {
    setFields((f) => ({ ...f, [field]: value }));
  }

  function handlePrimary(arr, idx, field) {
    mutateField(field, arr.map((item, i) => ({ ...item, primary: i === idx })));
  }

  // CREATE, ADD, REMOVE helpers for multipliable
  function updateArr(field, idx, itemObj) {
    mutateField(field, fields[field].map((item, i) => (i === idx ? { ...item, ...itemObj } : item)));
  }
  function addArr(field, item) {
    mutateField(field, [...fields[field], item]);
  }
  function removeArr(field, idx) {
    mutateField(field, fields[field].filter((_, i) => i !== idx));
  }

  // SAVE (Upsert) -- create or update profile
  async function saveProfile(e) {
    e.preventDefault();
    if (!userId) {
      setError("No user authenticated.");
      return;
    }
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    // Minimal validation
    if (!fields.name) {
      setError("Name is required.");
      setSaving(false);
      return;
    }
    if (
      !fields.emails.length ||
      !fields.emails.some((e) => e.primary && e.email)
    ) {
      setError("At least one primary email is required.");
      setSaving(false);
      return;
    }
    // Upsert
    const { error: upError } = await supabase
      .from("account.users")
      .upsert([
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

  // -- RENDER section helpers --
  function renderTitle(t, i) {
    return (
      <div key={i} className="flex items-center mb-2">
        <input
          type="text"
          value={t.title}
          onChange={(e) => updateArr("titles", i, { title: e.target.value })}
          placeholder="Enter title"
          className="w-48 p-1 mr-2 rounded bg-neutral-800 border border-neutral-700 text-white"
        />
        <button
          type="button"
          onClick={() => handlePrimary(fields.titles, i, "titles")}
          className={`mr-2 px-2 py-1 rounded text-xs ${
            t.primary ? "bg-blue-700 text-white font-bold" : "bg-neutral-700 text-neutral-300"
          }`}
          title={t.primary ? "Primary" : "Set as primary"}
        >
          {t.primary ? "Primary" : "Set Primary"}
        </button>
        {fields.titles.length > 1 && (
          <button
            type="button"
            onClick={() => removeArr("titles", i)}
            className="ml-2 px-2 py-1 rounded bg-neutral-800 text-neutral-500 text-xs"
          >
            Remove
          </button>
        )}
      </div>
    );
  }

  function renderEmail(e, i) {
    return (
      <div key={i} className="flex items-center mb-2">
        <input
          type="email"
          value={e.email}
          onChange={(ev) => updateArr("emails", i, { email: ev.target.value })}
          placeholder="Enter email"
          className="w-60 p-1 mr-2 rounded bg-neutral-800 border border-neutral-700 text-white"
        />
        <button
          type="button"
          onClick={() => handlePrimary(fields.emails, i, "emails")}
          className={`mr-2 px-2 py-1 rounded text-xs ${
            e.primary ? "bg-blue-700 text-white font-bold" : "bg-neutral-700 text-neutral-300"
          }`}
          title={e.primary ? "Primary" : "Set as primary"}
        >
          {e.primary ? "Primary" : "Set Primary"}
        </button>
        <span className="mr-2">
          {e.verified ? (
            <CheckIcon />
          ) : (
            <span title="Verification pending">
              <WarnIcon />
            </span>
          )}
        </span>
        <input
          type="text"
          value={e.label}
          onChange={(ev) => updateArr("emails", i, { label: ev.target.value })}
          placeholder="Label (optional)"
          className="w-28 p-1 ml-2 rounded bg-neutral-800 border border-neutral-700 text-white"
        />
        {fields.emails.length > 1 && (
          <button
            type="button"
            onClick={() => removeArr("emails", i)}
            className="ml-2 px-2 py-1 rounded bg-neutral-800 text-neutral-500 text-xs"
          >
            Remove
          </button>
        )}
      </div>
    );
  }

  // Main render
  return (
    <div className="p-8 text-white max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>
      {loading ? (
        <div className="text-neutral-400">Loading...</div>
      ) : (
        <form onSubmit={saveProfile}>
          <Section title="Personal Information">
            <div className="mb-4">
              <label className="block mb-1 text-neutral-400" htmlFor="acc-name">
                Name
              </label>
              <input
                id="acc-name"
                type="text"
                value={fields.name}
                onChange={(e) => mutateField("name", e.target.value)}
                placeholder="Full name"
                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-white"
                required
              />
            </div>
            <label className="block mb-1 text-neutral-400">Titles</label>
            {fields.titles.map(renderTitle)}
            <button
              type="button"
              onClick={() => addArr("titles", { title: "", primary: false })}
              className="mt-2 px-3 py-1 rounded bg-neutral-700 text-neutral-300 text-sm"
            >
              + Add Title
            </button>
          </Section>

          <Section title="Contact Details">
            <label className="block mb-1 text-neutral-400">Email Addresses</label>
            {fields.emails.map(renderEmail)}
            <button
              type="button"
              onClick={() => addArr("emails", { email: "", primary: false, verified: false, label: "" })}
              className="mt-2 px-3 py-1 rounded bg-neutral-700 text-neutral-300 text-sm"
            >
              + Add Email
            </button>
            <div className="mt-4">
              <label className="block mb-1 text-neutral-400" htmlFor="acc-contact">
                Contact Information (optional)
              </label>
              <input
                id="acc-contact"
                type="text"
                value={fields.contact_info}
                onChange={(e) => mutateField("contact_info", e.target.value)}
                placeholder="Phone or secondary contact"
                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-white"
              />
            </div>
          </Section>

          <Section title="Location (Optional)">
            <div className="mb-4">
              <label className="block mb-1 text-neutral-400" htmlFor="acc-address">
                Address
              </label>
              <input
                id="acc-address"
                type="text"
                value={fields.address}
                onChange={(e) => mutateField("address", e.target.value)}
                placeholder="Street address"
                className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-white"
                autoComplete="off"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-neutral-400" htmlFor="acc-city">
                  City
                </label>
                <input
                  id="acc-city"
                  type="text"
                  value={fields.city}
                  onChange={(e) => mutateField("city", e.target.value)}
                  placeholder="City"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-white"
                  autoComplete="off"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-neutral-400" htmlFor="acc-state">
                  State
                </label>
                <input
                  id="acc-state"
                  type="text"
                  value={fields.state}
                  onChange={(e) => mutateField("state", e.target.value)}
                  placeholder="State"
                  className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-white"
                  autoComplete="off"
                />
              </div>
            </div>
          </Section>

          <Section title="Special Instructions">
            <textarea
              value={fields.special_instructions}
              onChange={(e) => mutateField("special_instructions", e.target.value)}
              placeholder="Add any specific notes or preferences (optional)"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-white h-24 resize-none"
            />
            <p className="text-neutral-500 text-xs mt-2">
              Note: Special instructions are user-provided, not authoritative, and are excluded from automated system decisions.
            </p>
          </Section>
          {error && <p className="text-red-400 mb-2">{error}</p>}
          {saveSuccess && <p className="text-green-400 mb-2">Saved successfully.</p>}
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-6 py-2 mt-2 rounded"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}
