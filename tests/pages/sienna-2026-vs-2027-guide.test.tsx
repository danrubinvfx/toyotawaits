import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sienna2026Vs2027GuidePage, {
  generateMetadata,
  dynamic,
} from '@/app/guides/toyota-sienna-2026-vs-2027/page';
import { MarketProvider } from '@/context/MarketContext';

describe('2026 vs. 2027 Toyota Sienna Guide Page', () => {
  it('has valid Next.js 16 dynamic route configuration', () => {
    expect(dynamic).toBe('force-dynamic');
  });

  it('has valid SEO metadata matching specification requirements', () => {
    const meta = generateMetadata();
    expect(meta.title).toBe(
      '2026 vs. 2027 Toyota Sienna Canada: Price Hike, Changes & Waitlist Rollover | ToyotaWaits'
    );
    expect(meta.description).toBe(
      'Compare the 2026 and 2027 Toyota Sienna. Full trim level matrix (LE, XLE, XSE, Limited, Platinum), carryover specs, Canadian queue rollovers, live lot inventory, and Day-1 gear.'
    );
    expect(meta.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/guides/toyota-sienna-2026-vs-2027'
    );
  });

  it('renders JSON-LD FAQPage schema with the 3 mandatory questions', () => {
    const { container } = render(
      <MarketProvider initialMarket="CA">
        <Sienna2026Vs2027GuidePage />
      </MarketProvider>
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const json = JSON.parse(script!.textContent || '{}');

    expect(json['@type']).toBe('FAQPage');
    expect(json.mainEntity).toHaveLength(3);

    expect(json.mainEntity[0].name).toBe(
      'Are there mechanical differences between the 2026 and 2027 Toyota Sienna?'
    );
    expect(json.mainEntity[0].acceptedAnswer.text).toBe(
      'No. The 2027 Sienna is a direct mechanical carryover sharing the identical 245-hp 2.5L hybrid synergy powertrain, AWD-e architecture, and 33.5 cu. ft. sunken cargo well.'
    );

    expect(json.mainEntity[1].name).toBe(
      'Will my Canadian 2026 Sienna allocation automatically turn into a 2027?'
    );
    expect(json.mainEntity[1].acceptedAnswer.text).toBe(
      "Yes. In Toyota's bi-weekly dealer allocation system, deposits placed in late 2026 roll to a 2027 VIN when the Indiana assembly plant transitions tooling between November and January without losing queue priority."
    );

    expect(json.mainEntity[2].name).toBe(
      'What is the difference between the Sienna XSE and LE suspension?'
    );
    expect(json.mainEntity[2].acceptedAnswer.text).toBe(
      'The XSE features exclusive sport-tuned dampers and thicker anti-sway bars for flatter cornering, whereas LE, XLE, Limited, and Platinum use standard soft-ride comfort tuning.'
    );
  });

  it('renders page header and carryover comparison table', () => {
    render(
      <MarketProvider initialMarket="CA">
        <Sienna2026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(
      screen.getByRole('heading', {
        name: /2026 vs\. 2027 Toyota Sienna: Key Differences, Trim Matrix & Wait Times/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Year-Over-Year Carryover Comparison/i)).toBeInTheDocument();
    expect(screen.getAllByText(/2.5L 4-Cyl Hybrid \(245 hp net\)/i)).toHaveLength(2);
    expect(screen.getAllByText(/33.5 cu\. ft\. deep sunken tub/i)).toHaveLength(2);
    expect(screen.getAllByText(/3,500 lbs \/ 1,585 kg/i)).toHaveLength(2);
  });

  it('renders all 5 trim grades in the trim matrix', () => {
    render(
      <MarketProvider initialMarket="CA">
        <Sienna2026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(screen.getByText(/LE \(8-Passenger\)/i)).toBeInTheDocument();
    expect(screen.getByText(/XLE \(7 or 8-Pass\)/i)).toBeInTheDocument();
    expect(screen.getByText(/XSE \(7-Passenger\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Limited \(7-Passenger\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Platinum \(7-Passenger\)/i)).toBeInTheDocument();
  });

  it('details Indiana TMMI queue rollover mechanics', () => {
    render(
      <MarketProvider initialMarket="CA">
        <Sienna2026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(screen.getByText(/The TMMI Indiana Factory Switchover \(Nov–Jan\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Why Passing on a 2026 Build Slot Is a Costly Mistake/i)).toBeInTheDocument();
  });

  it('renders live inventory bridge banner linking to Sienna stock', () => {
    render(
      <MarketProvider initialMarket="CA">
        <Sienna2026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(screen.getByText(/Looking for an Incoming Allocation Right Now\?/i)).toBeInTheDocument();
    const inventoryLink = screen.getByRole('link', { name: /Explore Live Sienna Stock ↗/i });
    expect(inventoryLink).toHaveAttribute('href', '/inventory?model=Toyota%20Sienna');
  });

  it('renders Delivery Day Gear shelf with localized Amazon and partner links', () => {
    render(
      <MarketProvider initialMarket="CA">
        <Sienna2026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(screen.getByText(/Direct-Fit Delivery Day Gear Shelf/i)).toBeInTheDocument();

    // Muslogy Partner card
    expect(screen.getByText(/Muslogy Center Console Sliding Organizer & Bridge Box/i)).toBeInTheDocument();
    expect(screen.getByText(/Partner Deal · 2% Off/i)).toBeInTheDocument();
    expect(screen.getByText(/Code: TOYOTAWAITS/i)).toBeInTheDocument();
    const muslogyLink = screen.getByRole('link', { name: /Claim 2% Off Muslogy ↗/i });
    expect(muslogyLink).toHaveAttribute('href', '/out/muslogy-sienna');
    expect(muslogyLink).toHaveAttribute('target', '_blank');
    expect(muslogyLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

    // CURT Hitch card
    expect(screen.getByText(/CURT 13470 Class 3 Trailer Hitch Receiver \(2"\)/i)).toBeInTheDocument();
    expect(screen.getByText(/100% bolt-on, zero bumper trimming\./i)).toBeInTheDocument();
    const curtLink = screen.getByRole('link', { name: /View Hitch on Amazon ↗/i });
    expect(curtLink.getAttribute('href')).toContain('tag=toyotawaits-20');
    expect(curtLink.getAttribute('href')).toContain('amazon.ca');
    expect(curtLink).toHaveAttribute('target', '_blank');
    expect(curtLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

    // FitcamX card
    expect(screen.getByText(/FitcamX 4K OEM Integrated Dashcam/i)).toBeInTheDocument();
    expect(screen.getByText(/Plug-and-play into TSS rear-view mirror harness without fuse tapping\./i)).toBeInTheDocument();
    const fitcamxLink = screen.getByRole('link', { name: /View Camera on Amazon ↗/i });
    expect(fitcamxLink.getAttribute('href')).toContain('tag=toyotawaits-20');
    expect(fitcamxLink.getAttribute('href')).toContain('amazon.ca');

    // Floor liners card
    expect(screen.getByText(/3-Row High-Wall All-Weather Floor Liners/i)).toBeInTheDocument();
    const floorMatsLink = screen.getByRole('link', { name: /Check Amazon Stock ↗/i });
    expect(floorMatsLink.getAttribute('href')).toContain('tag=toyotawaits-20');
    expect(floorMatsLink.getAttribute('href')).toContain('amazon.ca');
  });

  it('routes to Amazon.com with US tag when US market is selected', () => {
    render(
      <MarketProvider initialMarket="US">
        <Sienna2026Vs2027GuidePage />
      </MarketProvider>
    );

    const curtLink = screen.getByRole('link', { name: /View Hitch on Amazon ↗/i });
    expect(curtLink.getAttribute('href')).toContain('tag=toyotawaits07-20');
    expect(curtLink.getAttribute('href')).toContain('amazon.com');
  });
});
