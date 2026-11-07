import type { Metadata } from 'next';
import { QuoteAuditorClient } from '@/components/compliance/QuoteAuditorClient';

export const metadata: Metadata = {
  title: 'Toyota Dealer Quote Auditor Canada | Check AMVIC, OMVIC & VSA Fees',
  description:
    'Audit your Toyota dealership bill of sale or quote. Strip doc fees, $800 block heaters, and unnecessary protection packages before signing.',
  alternates: {
    canonical: 'https://www.toyotawaits.ca/tools/quote-auditor',
  },
  openGraph: {
    title: 'Toyota Dealer Quote Auditor Canada | Check AMVIC, OMVIC & VSA Fees',
    description:
      'Audit your Toyota dealership bill of sale or quote. Strip doc fees, $800 block heaters, and unnecessary protection packages before signing.',
    url: 'https://www.toyotawaits.ca/tools/quote-auditor',
    type: 'website',
  },
};

export default function QuoteAuditorPage() {
  return <QuoteAuditorClient />;
}
