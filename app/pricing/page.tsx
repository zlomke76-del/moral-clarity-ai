// app/pricing/page.tsx
import { redirect } from "next/navigation";

export const metadata = {
  title: "Support & Access",
  description:
    "Support Moral Clarity AI through transparent, non-extractive access plans.",
};

export default function PricingRedirectPage() {
  redirect("/buy");
}
