// app/neutrality-check/page.tsx
import type { Metadata } from 'next';
import ClientNeutralityMarketing from './ClientPage';

export const metadata: Metadata = {
  title: 'Neutrality Check | Moral Clarity AI',
  description:
    'Have Solace review a news article for bias, omissions, and framing. Built for journalists, editors, and readers.',
};

export default function Page() {
  return <ClientNeutralityMarketing />;
}
