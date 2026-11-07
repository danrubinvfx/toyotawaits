import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FAQPage, { generateMetadata } from '@/app/faq/page';
import { MarketProvider } from '@/context/MarketContext';

describe('FAQPage (/faq Route)', () => {
  it('generates the exact required metadata for SEO and canonical URL', () => {
    const metadata = generateMetadata();

    expect(metadata.title).toBe(
      'Toyota Wait Times & Dealer Markup FAQ (US & Canada 2026) | ToyotaWaits'
    );
    expect(metadata.description).toBe(
      'Frequently asked questions on Toyota allocation transit times, dealer markups (ADM), deposit refund rules, and crowdsourced delivery tracking in the US and Canada.'
    );
    expect(metadata.alternates?.canonical).toBe('https://www.toyotawaits.ca/faq');
  });

  it('renders the clean page heading, subcopy, and semantic details accordions', () => {
    const { container } = render(
      <MarketProvider initialMarket="CA">
        <FAQPage />
      </MarketProvider>
    );

    // Heading
    expect(
      screen.getByRole('heading', { level: 1, name: 'Frequently Asked Questions' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/crowdsourced wait-time and pricing methodology/i, { exact: false })
    ).toBeInTheDocument();

    // Verify semantic details accordions
    const detailsList = container.querySelectorAll('details');
    expect(detailsList.length).toBe(12); // 4 US + 4 CA + 4 General

    detailsList.forEach((detail) => {
      expect(detail.className).toContain('border');
      expect(detail.className).toContain('border-zinc-800');
      expect(detail.className).toContain('bg-zinc-900/40');
      expect(detail.className).toContain('rounded-xl');
      expect(detail.className).toContain('p-4');
    });
  });

  it('injects machine-readable FAQPage JSON-LD structured data declaring US and CA queries', () => {
    const { container } = render(
      <MarketProvider initialMarket="CA">
        <FAQPage />
      </MarketProvider>
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();

    const json = JSON.parse(script!.textContent || '{}');
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('FAQPage');
    expect(Array.isArray(json.mainEntity)).toBe(true);
    expect(json.mainEntity.length).toBe(12);

    // Verify key US entities in JSON-LD
    const questionNames = json.mainEntity.map((q: { name: string }) => q.name);
    expect(questionNames).toContain(
      'Do Toyota dealers in the United States charge over MSRP (ADM)?'
    );
    expect(questionNames).toContain(
      'How does the Toyota allocation system work in the US?'
    );
    expect(questionNames).toContain(
      'Are vehicle waitlist deposits refundable in the United States?'
    );
    expect(questionNames).toContain(
      'Can I track my Toyota build status using a VIN or permanent freight code?'
    );

    // Verify key CA entities in JSON-LD
    expect(questionNames).toContain(
      'How do OMVIC and Canadian provincial all-in pricing laws protect vehicle buyers?'
    );
    expect(questionNames).toContain(
      'Are vehicle waitlist deposits refundable under Canadian regulations?'
    );

    // Verify Platform entity
    expect(questionNames).toContain(
      'Is ToyotaWaits affiliated with Toyota Motor Corporation?'
    );
  });

  it('renders all 4 high-intent United States allocation and ADM questions', () => {
    render(
      <MarketProvider initialMarket="US">
        <FAQPage />
      </MarketProvider>
    );

    // Q1: ADM
    expect(
      screen.getByText('Do Toyota dealers in the United States charge over MSRP (ADM)?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Unlike Canada where provincial all-in pricing rules restrict surprise fees, US dealers operate as independent franchises and can add Additional Dealer Markup \(ADM\)/i
      )
    ).toBeInTheDocument();

    // Q2: Allocation
    expect(
      screen.getByText('How does the Toyota allocation system work in the US?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Toyota Motor North America \(TMNA\) and regional distributors \(such as Southeast Toyota and Gulf States Toyota\) distribute vehicles twice monthly via dealer allocations/i
      )
    ).toBeInTheDocument();

    // Q3: Refundable deposits
    expect(
      screen.getByText('Are vehicle waitlist deposits refundable in the United States?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /In states like California, dealer deposits on unsigned purchase agreements are generally fully refundable by law/i
      )
    ).toBeInTheDocument();

    // Q4: VIN / Freight code tracking
    expect(
      screen.getByText(
        'Can I track my Toyota build status using a VIN or permanent freight code?'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Once an allocation enters build phase \(status 'A' or 'F'\), a temporary allocation hash or 17-digit VIN is assigned/i
      )
    ).toBeInTheDocument();
  });

  it('renders non-affiliation disclosure and community data transparency items', () => {
    render(
      <MarketProvider initialMarket="CA">
        <FAQPage />
      </MarketProvider>
    );

    expect(
      screen.getByText('Is ToyotaWaits affiliated with Toyota Motor Corporation?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'No. ToyotaWaits is an independent, community-driven tracker and research tool not endorsed by or affiliated with Toyota Motor Sales, U.S.A., Inc., or Toyota Canada Inc.'
      )
    ).toBeInTheDocument();
  });

  it('supports interactive market filtering via pills', () => {
    render(
      <MarketProvider initialMarket="CA">
        <FAQPage />
      </MarketProvider>
    );

    const usFilterBtn = screen.getByTestId('faq-filter-us');
    fireEvent.click(usFilterBtn);

    // US category visible
    expect(
      screen.getByText('United States: Allocations, Markups & Pricing (USD)')
    ).toBeInTheDocument();
    // Canadian category hidden when filtered to US
    expect(
      screen.queryByText('Canada: Provincial Queues & All-In Pricing (CAD)')
    ).not.toBeInTheDocument();

    // Toggle back to All
    const allFilterBtn = screen.getByTestId('faq-filter-all');
    fireEvent.click(allFilterBtn);

    expect(
      screen.getByText('United States: Allocations, Markups & Pricing (USD)')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Canada: Provincial Queues & All-In Pricing (CAD)')
    ).toBeInTheDocument();
    expect(
      screen.getByText('General Platform & Consumer Transparency')
    ).toBeInTheDocument();
  });
});
