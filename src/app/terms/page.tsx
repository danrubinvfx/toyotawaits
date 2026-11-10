import React from 'react';
import type { Metadata } from 'next';
import LegalPage, { metadata as legalMetadata } from '../legal/page';

export const metadata: Metadata = {
  ...legalMetadata,
  title: 'Terms of Service, Legal Safe Harbors & Disclaimers | ToyotaWaits',
  alternates: {
    canonical: 'https://www.toyotawaits.ca/terms',
  },
};

export default function TermsPage() {
  return <LegalPage />;
}
