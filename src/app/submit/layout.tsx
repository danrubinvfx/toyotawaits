import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Wait Time (Anonymous) | ToyotaWaits.ca',
  description:
    'Contribute your Toyota reservation deposit or vehicle delivery date anonymously to help Canadian buyers track genuine allocation wait times.',
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
