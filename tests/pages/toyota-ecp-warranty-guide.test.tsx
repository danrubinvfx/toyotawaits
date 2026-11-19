import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ToyotaEcpWarrantyGuidePage, {
  metadata,
} from '@/app/guides/toyota-ecp-warranty-guide/page';

describe('ToyotaEcpWarrantyGuidePage Route', () => {
  it('defines high-CTR metadata for toyota warranty and ECP searches', () => {
    expect(metadata.title).toBe(
      'Toyota Warranty & ECP Extended Warranty Guide (Factory vs. Dealer Pricing) | ToyotaWaits'
    );
    expect(metadata.description).toBe(
      'Compare Toyota factory bumper-to-bumper, hybrid & battery coverage vs. ECP extended warranty pricing, wholesale benchmarks, and the 31-day rule.'
    );
    expect(metadata.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/guides/toyota-ecp-warranty-guide'
    );
  });

  it('renders FAQPage JSON-LD schema covering factory coverage, ECP value/pricing, and 31-day rule', () => {
    const { container } = render(<ToyotaEcpWarrantyGuidePage />);

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
