export default function AccountPage() {
  return (
    <div
      className="w-full px-10 py-16 text-white max-w-3xl mx-auto space-y-10"
      data-layout-boundary="account-content"
    >
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Account Settings
      </h1>

      {/* Client component */}
      <AccountForm />
    </div>
  );
}

import AccountForm from "./AccountForm";
