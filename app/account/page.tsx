"use client";

import { useState } from "react";

// Sectional card container
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 border border-neutral-700 rounded-lg p-4 bg-neutral-900">
      <h2 className="text-lg font-semibold mb-2 text-white">{title}</h2>
      {children}
    </div>
  );
}

// Helper icon (solid and warning) for demo
function CheckIcon() {
  return <span className="inline-block w-4 h-4 text-green-500 mr-1">&#10003;</span>;
}
function WarnIcon() {
  return <span className="inline-block w-4 h-4 text-yellow-400 mr-1">&#9888;</span>;
}

// Main Account Page component
export default function AccountPage() {
  // Initial state (prototype-level, not wired)
  const [name, setName] = useState("");
  const [titles, setTitles] = useState([{ title: "", primary: true }]);
  const [emails, setEmails] = useState([{ email: "", primary: true, verified: false, label: "" }]);
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateLoc, setStateLoc] = useState("");
  const [special, setSpecial] = useState("");

  // Mutator helpers for dynamic fields
  const handlePrimary = (arr, idx, setter) => {
    const next = arr.map((item, i) => ({ ...item, primary: i === idx }));
    setter(next);
  };

  // Editing for titles, emails
  const updateTitles = (idx, field, val) => {
    setTitles(titles.map((t, i) => (i === idx ? { ...t, [field]: val } : t)));
  };
  const addTitle = () => setTitles([...titles, { title: "", primary: false }]);
  const removeTitle = (idx) => setTitles(titles.filter((_, i) => i !== idx));

  const updateEmails = (idx, field, val) => {
    setEmails(emails.map((e, i) => (i === idx ? { ...e, [field]: val } : e)));
  };
  const addEmail = () => setEmails([...emails, { email: "", primary: false, verified: false, label: "" }]);
  const removeEmail = (idx) => setEmails(emails.filter((_, i) => i !== idx));

  // Controlled render for titles/emails
  const renderTitle = (t, i) => (
    <div key={i} className="flex items-center mb-2">
      <input
        type="text"
        value={t.title}
        onChange={(e) => updateTitles(i, "title", e.target.value)}
        placeholder="Enter title"
        className="w-48 p-1 mr-2 rounded bg-neutral-800 border border-neutral-700 text-white"
      />
      <button
        onClick={() => handlePrimary(titles, i, setTitles)}
        className={`mr-2 px-2 py-1 rounded text-xs ${
          t.primary
            ? "bg-blue-700 text-white font-bold"
            : "bg-neutral-700 text-neutral-300"
        }`}
        title={t.primary ? "Primary" : "Set as primary"}
      >
        {t.primary ? "Primary" : "Set Primary"}
      </button>
      {titles.length > 1 && (
        <button
          onClick={() => removeTitle(i)}
          className="ml-2 px-2 py-1 rounded bg-neutral-800 text-neutral-500 text-xs"
        >
          Remove
        </button>
      )}
    </div>
  );

  const renderEmail = (e, i) => (
    <div key={i} className="flex items-center mb-2">
      <input
        type="email"
        value={e.email}
        onChange={(ev) => updateEmails(i, "email", ev.target.value)}
        placeholder="Enter email"
        className="w-60 p-1 mr-2 rounded bg-neutral-800 border border-neutral-700 text-white"
      />
      <button
        onClick={() => handlePrimary(emails, i, setEmails)}
        className={`mr-2 px-2 py-1 rounded text-xs ${
          e.primary
            ? "bg-blue-700 text-white font-bold"
            : "bg-neutral-700 text-neutral-300"
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
        onChange={(ev) => updateEmails(i, "label", ev.target.value)}
        placeholder="Label (optional)"
        className="w-28 p-1 ml-2 rounded bg-neutral-800 border border-neutral-700 text-white"
      />
      {emails.length > 1 && (
        <button
          onClick={() => removeEmail(i)}
          className="ml-2 px-2 py-1 rounded bg-neutral-800 text-neutral-500 text-xs"
        >
          Remove
        </button>
      )}
    </div>
  );

  // MVP: No backend wiring
  return (
    <div className="p-8 text-white max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>

      <Section title="Personal Information">
        <div className="mb-4">
          <label className="block mb-1 text-neutral-400" htmlFor="acc-name">
            Name
          </label>
          <input
            id="acc-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-white"
          />
        </div>
        <label className="block mb-1 text-neutral-400">Titles</label>
        {titles.map(renderTitle)}
        <button
          onClick={addTitle}
          className="mt-2 px-3 py-1 rounded bg-neutral-700 text-neutral-300 text-sm"
        >
          + Add Title
        </button>
      </Section>

      <Section title="Contact Details">
        <label className="block mb-1 text-neutral-400">Email Addresses</label>
        {emails.map(renderEmail)}
        <button
          onClick={addEmail}
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
            value={contact}
            onChange={(e) => setContact(e.target.value)}
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
              value={city}
              onChange={(e) => setCity(e.target.value)}
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
              value={stateLoc}
              onChange={(e) => setStateLoc(e.target.value)}
              placeholder="State"
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-white"
              autoComplete="off"
            />
          </div>
        </div>
      </Section>

      <Section title="Special Instructions">
        <textarea
          value={special}
          onChange={(e) => setSpecial(e.target.value)}
          placeholder="Add any specific notes or preferences (optional)"
          className="w-full p-2 rounded bg-neutral-800 border border-neutral-700 text-white h-24 resize-none"
        />
        <p className="text-neutral-500 text-xs mt-2">
          Note: Special instructions are user-provided, not authoritative, and are excluded from automated system decisions.
        </p>
      </Section>
    </div>
  );
}
