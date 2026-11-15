import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CorollaCross2026Vs2027GuidePage, {
  generateMetadata,
  dynamic,
  instant,
} from '@/app/guides/toyota-corolla-cross-2026-vs-2027/page';
import { MarketProvider } from '@/context/MarketContext';

describe('2026 vs. 2027 Toyota Corolla Cross Guide Page', () => {
  it('has valid Next.js 16 route segment exports', () => {
    expect(dynamic).toBe('force-dynamic');
    expect(instant).toBe(false);
  });

  it('has valid SEO metadata and canonical URL matching specification requirements', () => {
    const meta = generateMetadata();
    expect(meta.title).toBe(
      '2026 vs. 2027 Toyota Corolla Cross Canada: Pricing, Trims & Wait Times | ToyotaWaits'
    );
    expect(meta.description).toBe(
      'Compare the 2026 and 2027 Toyota Corolla Cross & Hybrid in Canada. Breakdown of 2027 Canadian MSRP increases (~$565–$955), carryover 196-hp hybrid specs, and MTM Huntsville queue rollovers.'
    );
    expect(meta.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/guides/toyota-corolla-cross-2026-vs-2027'
    );
  });

  it('renders JSON-LD FAQPage schema with the 3 mandatory Canadian questions', () => {
    const { container } = render(
      <MarketProvider initialMarket="CA">
        <CorollaCross2026Vs2027GuidePage />
      </MarketProvider>
    );

    const scripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]'));
    expect(scripts.length).toBeGreaterThanOrEqual(1);

    const parsedSchemas = scripts.map((s) => JSON.parse(s.textContent || '{}'));
    const faqPage = parsedSchemas.find((s) => s['@type'] === 'FAQPage');

    expect(faqPage).toBeDefined();
    expect(faqPage.mainEntity).toHaveLength(3);

    expect(faqPage.mainEntity[0].name).toBe(
      'What changed on the 2027 Toyota Corolla Cross in Canada?'
    );
    expect(faqPage.mainEntity[0].acceptedAnswer.text).toBe(
      'The 2027 Toyota Corolla Cross is a mechanical carryover in Canada following its 2026 styling refresh. Gas models keep the 169-hp 2.0L engine and Hybrid models keep the 196-hp 5th-gen AWD system, while Canadian all-in prices rise ~$565 on Gas trims and ~$950 on Hybrid trims.'
    );

    expect(faqPage.mainEntity[1].name).toBe(
      'Will my 2026 Corolla Cross Hybrid deposit roll over into a 2027?'
    );
    expect(faqPage.mainEntity[1].acceptedAnswer.text).toBe(
      'Yes. Because Canadian Corolla Cross Hybrid waitlists run 6 to 12+ months from the Huntsville, Alabama (MTM) plant, unallocated 2026 orders automatically roll into 2027 VINs without resetting your dealership queue position.'
    );

    expect(faqPage.mainEntity[2].name).toBe(
      'Should I take a 2026 Corolla Cross allocation or wait for a 2027?'
    );
    expect(faqPage.mainEntity[2].acceptedAnswer.text).toBe(
      'Take an incoming 2026 allocation immediately. Because there are no hardware or powertrain upgrades for 2027 in Canada, passing on a 2026 only delays delivery by months and adds ~$565 to $955 CAD in model-year price increases.'
    );
  });

  it('renders the Year-Over-Year Comparison Table, Decision Matrix, Live Inventory CTA, and Day-1 Gear Shelf', () => {
    render(
      <MarketProvider initialMarket="CA">
        <CorollaCross2026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /2026 vs\. 2027 Toyota Corolla Cross Canada: Pricing, Trims & Wait Times/i,
      })
    ).toBeInTheDocument();

    // Comparison Table checks
    expect(
      screen.getByRole('heading', {
        name: /Year-Over-Year Comparison Table \(2026 vs\. 2027 Canadian Specs\)/i,
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/2\.0L 4-Cyl \(169 hp, CVT, FWD\/AWD, 7\.4–7\.8 L\/100 km\)/i)).toHaveLength(2);
    expect(screen.getAllByText(/2\.0L 5th-Gen Hybrid e-AWD \(196 hp, e-CVT, 5\.6 L\/100 km combined\)/i)).toHaveLength(2);
    expect(screen.getByText(/\$31,973 \(2026\)/)).toBeInTheDocument();
    expect(screen.getByText(/\$32,538 \(2027\)/)).toBeInTheDocument();
    expect(screen.getByText(/\$35,428 \(2026\)/)).toBeInTheDocument();
    expect(screen.getByText(/\$35,993 \(2027\)/)).toBeInTheDocument();
    expect(screen.getByText(/\$39,297 \(2026\)/)).toBeInTheDocument();
    expect(screen.getByText(/\$40,248 \(2027\)/)).toBeInTheDocument();
    expect(screen.getByText(/\$42,122 \(2026\)/)).toBeInTheDocument();
    expect(screen.getByText(/\$43,078 \(2027\)/)).toBeInTheDocument();

    // Decision Matrix
    expect(
      screen.getByRole('heading', {
        name: /“Pass or Take It\?” Decision Matrix/i,
      })
    ).toBeInTheDocument();

    // Live Inventory & Calculator CTAs
    const inventoryLink = screen.getByRole('link', {
      name: /Explore Live Corolla Cross Inventory ↗/i,
    });
    expect(inventoryLink).toHaveAttribute('href', '/inventory?model=Corolla%20Cross');

    const calculatorLink = screen.getByRole('link', {
      name: /Run Hybrid vs\. Gas Payback Calculator →/i,
    });
    expect(calculatorLink).toHaveAttribute('href', '/calculator/corolla-cross-hybrid');

    // Day-1 Delivery Gear Shelf (4 cards)
    expect(screen.getByText('Confirmed Fit 2022–2027')).toBeInTheDocument();
    expect(screen.getByText('Plug & Play TSS Housing')).toBeInTheDocument();
    expect(screen.getByText('9H Anti-Glare')).toBeInTheDocument();
    expect(screen.getByText('Day-1 Essential')).toBeInTheDocument();

    const gearLinks = [
      screen.getByRole('link', { name: /Check Floor Liners on Amazon ↗/i }),
      screen.getByRole('link', { name: /Check FitcamX on Amazon ↗/i }),
      screen.getByRole('link', { name: /Check Screen Protector on Amazon ↗/i }),
      screen.getByRole('link', { name: /Check Console Tray on Amazon ↗/i }),
    ];

    for (const link of gearLinks) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
      expect(link.getAttribute('href')).toContain('amazon.ca/s?k=');
      expect(link.getAttribute('href')).toContain('tag=toyotawaits-20');
    }
  });
});
