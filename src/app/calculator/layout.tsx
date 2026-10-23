import React from 'react';

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ToyotaWaits Canadian Vehicle Energy Savings & Payback Calculator',
    url: 'https://toyotawaits.ca/calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript and HTML5 support',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CAD',
    },
    description:
      'Calculate real-world Canadian fuel and electricity savings comparing Hybrid (HEV), Plug-in Hybrid (PHEV), and Gas vehicles with verified NRCan ratings and delivery wait times.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
