import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ToyotaEcpWarrantyGuidePage, {
  generateMetadata,
  dynamic,
  instant,
} from '@/app/guides/toyota-ecp-warranty-guide/page';

describe('ToyotaEcpWarrantyGuidePage Route', () => {
  it('defines Next.js 16 route segment exports', () => {
    expect(dynamic).toBe('force-dynamic');
    expect(instant).toBe(false);
  });

  it('defines high-CTR metadata for toyota warranty and ECP searches', async () => {
    const metadata = await generateMetadata();
    expect(metadata.title).toBe(
      'Toyota Canada Warranty (3yr/60k & 8yr Hybrid) + Real ECP Extended Warranty Cost | ToyotaWaits'
    );
    expect(metadata.description).toBe(
      "Full breakdown of Toyota's 3-year comprehensive, 5-year powertrain, and 8-year hybrid battery warranties—plus real dealer wholesale vs. retail pricing on Toyota ECP / VSA Platinum plans."
    );
    expect(metadata.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/guides/toyota-ecp-warranty-guide'
    );
  });

  it('renders factory coverage summary box and FAQPage JSON-LD schema covering factory coverage, ECP value/pricing, and 31-day rule', async () => {
    const { container } = render(await ToyotaEcpWarrantyGuidePage());

    expect(screen.getByTestId('factory-warranty-summary-box')).toBeInTheDocument();
    expect(screen.getByText('3yr / 60,000 km')).toBeInTheDocument();
    expect(screen.getByText('5yr / 100,000 km')).toBeInTheDocument();
    expect(screen.getByText('8yr / 160,000 km')).toBeInTheDocument();
    expect(screen.getByText('10yr / 240,000 km')).toBeInTheDocument();

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    const faqScript = Array.from(scripts).find((s) => s.innerHTML.includes('FAQPage'));
    expect(faqScript).toBeDefined();

    const parsed = JSON.parse(faqScript!.innerHTML);
    expect(parsed['@type']).toBe('FAQPage');
    const questions = parsed.mainEntity.map((item: { name: string }) => item.name);

    expect(questions).toContain(
      "What does Toyota's standard factory warranty and hybrid/battery warranty cover?"
    );
    expect(questions).toContain(
      'Is Toyota ECP extended warranty worth it, and how much should you pay vs. dealer retail?'
    );
    expect(questions).toContain(
      'How does the 31-day post-delivery window work for buying a Toyota ECP plan?'
    );
  });
});
