import type { Metadata } from 'next';
import { OmvicPriceChecker } from '@/components/compliance/OmvicPriceChecker';

export const metadata: Metadata = {
  title: 'OMVIC All-In Price Checker & Dealer Quote Auditor | ToyotaWaits.ca',
  description:
    'Audit your Ontario Toyota dealership quote against OMVIC All-In Price Advertising regulations (MVDA). Identify non-compliant admin fees, security etching, and mandatory add-ons.',
  alternates: {
    canonical: 'https://www.toyotawaits.ca/tools/omvic-checker',
  },
  openGraph: {
    title: 'OMVIC All-In Price Checker & Dealer Quote Auditor | ToyotaWaits.ca',
    description:
      'Verify whether your Ontario Toyota dealership quote complies with provincial All-In Price Advertising laws and generate an OMVIC-backed buyer rebuttal script.',
    url: 'https://www.toyotawaits.ca/tools/omvic-checker',
    type: 'website',
  },
};

export default function OmvicCheckerPage() {
  return <OmvicPriceChecker />;
}
