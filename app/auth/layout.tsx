export const metadata = {
  title: "Sign In — Moral Clarity AI",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative z-[10] bg-[#020617]">
      {children}
    </div>
  );
}
