// app/app/neutrality-check/page.tsx
import type { Metadata } from 'next';
import ClientNeutralityApp from './ClientPage';

export const metadata: Metadata = {
  title: 'Neutrality Check · Studio | Moral Clarity AI',
  description:
    'Interactive workspace for running Solace neutrality assessments on news articles and drafts.',
};

export default function Page() {
  return <ClientNeutralityApp />;
}
