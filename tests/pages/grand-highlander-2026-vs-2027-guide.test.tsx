import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GrandHighlander2026Vs2027GuidePage, {
  generateMetadata,
  dynamic,
  instant,
} from '@/app/guides/toyota-grand-highlander-2026-vs-2027/page';
import { MarketProvider } from '@/context/MarketContext';

describe('2026 vs. 2027 Toyota Grand Highlander Guide Page', () => {
  it('has valid Next.js route segment exports', () => {
    expect(dynamic).toBe('force-dynamic');
    expect(instant).toBe(false);
  });

  it('has valid SEO metadata matching specification requirements', () => {
    const meta = generateMetadata();
    expect(meta.title).toBe(
      '2026 vs. 2027 Toyota Grand Highlander: Woodland Edition, Trims & Wait Times | ToyotaWaits'
    );
    expect(meta.description).toBe(
      'Compare the 2026 and 2027 Grand Highlander. Details on the new Hybrid Woodland Edition, +12mm ground clearance, blacked-out MAX Platinum, and Canadian queue rollovers.'
    );
    expect(meta.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/guides/toyota-grand-highlander-2026-vs-2027'
    );
  });

  it('renders JSON-LD FAQPage schema with required questions', () => {
    const { container } = render(
      <MarketProvider initialMarket="CA">
        <GrandHighlander2026Vs2027GuidePage />
      </MarketProvider>
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const json = JSON.parse(script!.textContent || '{}');

    expect(json['@type']).toBe('FAQPage');
    expect(json.mainEntity.length).toBeGreaterThanOrEqual(2);

    expect(json.mainEntity[0].name).toBe(
      'What are the major changes for the 2027 Toyota Grand Highlander?'
    );
    expect(json.mainEntity[0].acceptedAnswer.text).toBe(
      'The 2027 Grand Highlander introduces a new Hybrid Woodland Edition with all-terrain tires, +12 mm ground clearance, and a 1,500W power outlet. It also standardizes a heated steering wheel on the XLE and blacks out the trim on the Hybrid MAX Platinum.'
    );

    expect(json.mainEntity[1].name).toBe(
      'Will my 2026 Grand Highlander allocation automatically roll into a 2027?'
    );
    expect(json.mainEntity[1].acceptedAnswer.text).toBe(
      'Yes. Due to 8–14 month Canadian delivery queues, allocations clearing the Indiana plant during the winter switchover transition to 2027 VINs without losing queue position.'
    );
  });

  it('renders page header and side-by-side comparison table', () => {
    render(
      <MarketProvider initialMarket="CA">
        <GrandHighlander2026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(
      screen.getByRole('heading', {
        name: /2026 vs\. 2027 Toyota Grand Highlander: Woodland Edition, Trims & Wait Times/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Side-by-Side Comparison: 2026 vs\. 2027 Grand Highlander/i)).toBeInTheDocument();
    expect(screen.getByText(/Woodland Edition Trim/i)).toBeInTheDocument();
    expect(screen.getByText(/XLE Heated Steering Wheel/i)).toBeInTheDocument();
    expect(screen.getByText(/Hybrid MAX Platinum Styling/i)).toBeInTheDocument();
    expect(screen.getByText(/Canadian Winter Win/i)).toBeInTheDocument();
  });

  it('renders "Should You Pass on a 2026?" guide section', () => {
    render(
      <MarketProvider initialMarket="CA">
        <GrandHighlander2026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(
      screen.getByText(/Executive Verdict: Should You Pass on a 2026 Grand Highlander\?/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Powertrain Carryover/i)).toBeInTheDocument();
    expect(screen.getByText(/\+8 to \+14 Months/i)).toBeInTheDocument();
    expect(screen.getByText(/\+\$600 – \$1,200 CAD/i)).toBeInTheDocument();
  });

  it('renders live inventory bridge button linking to Grand Highlander stock', () => {
    render(
      <MarketProvider initialMarket="CA">
        <GrandHighlander2026Vs2027GuidePage />
      </MarketProvider>
    );

    const bridgeLink = screen.getByRole('link', {
      name: /View Live Grand Highlander Stock ↗/i,
    });
    expect(bridgeLink).toHaveAttribute(
      'href',
      '/inventory?model=Toyota%20Grand%20Highlander'
    );
  });

  it('renders vetted Day-1 accessory shelf with TuxMat, Spigen, and CURT', () => {
    render(
      <MarketProvider initialMarket="CA">
        <GrandHighlander2026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(screen.getByText(/Delivery Day Gear Shelf: Vetted 2026 & 2027 Fitments/i)).toBeInTheDocument();
    expect(screen.getByText(/TuxMat Custom High-Wall 3-Row Floor Liners/i)).toBeInTheDocument();
    expect(screen.getByText(/Spigen Tempered Glass Screen Protector \(12\.3-inch\)/i)).toBeInTheDocument();
    expect(screen.getByText(/CURT Class 3 Trailer Hitch Receiver \(2-inch\)/i)).toBeInTheDocument();

    const tuxmatLink = screen.getByRole('link', { name: /Check TuxMat on Amazon ↗/i });
    expect(tuxmatLink).toHaveAttribute('target', '_blank');
    expect(tuxmatLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
    expect(tuxmatLink.getAttribute('href')).toContain('tag=toyotawaits-20');

    const spigenLink = screen.getByRole('link', { name: /Check Screen Protector ↗/i });
    expect(spigenLink).toHaveAttribute('target', '_blank');
    expect(spigenLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
    expect(spigenLink.getAttribute('href')).toContain('tag=toyotawaits-20');

    const curtLink = screen.getByRole('link', { name: /Check Hitch on Amazon ↗/i });
    expect(curtLink).toHaveAttribute('target', '_blank');
    expect(curtLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');
    expect(curtLink.getAttribute('href')).toContain('tag=toyotawaits-20');
  });
});
