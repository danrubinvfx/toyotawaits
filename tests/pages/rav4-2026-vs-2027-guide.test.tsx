import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Rav42026Vs2027GuidePage, {
  generateMetadata,
  dynamic,
} from '@/app/guides/toyota-rav4-2026-vs-2027/page';
import { MarketProvider } from '@/context/MarketContext';
import { WSJCalloutBanner } from '@/components/news/WSJCalloutBanner';

describe('2026 vs. 2027 Toyota RAV4 Guide Page', () => {
  it('has valid Next.js dynamic route configuration', () => {
    expect(dynamic).toBe('force-dynamic');
  });

  it('has valid SEO metadata matching specification requirements', () => {
    const meta = generateMetadata();
    expect(meta.title).toBe(
      '2026 vs. 2027 Toyota RAV4: Key Differences, NACS Port & Wait Times | ToyotaWaits'
    );
    expect(meta.description).toBe(
      'Compare the 2026 and 2027 Toyota RAV4 (Hybrid & PHEV). Breakdown of native NACS Supercharging, 321-hp PHEV upgrade, 9.1" Woodland lift, and allocation queue rollovers.'
    );
    expect(meta.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/guides/toyota-rav4-2026-vs-2027'
    );
  });

  it('renders JSON-LD FAQPage schema with the 3 mandatory questions', () => {
    const { container } = render(
      <MarketProvider initialMarket="CA">
        <Rav42026Vs2027GuidePage />
      </MarketProvider>
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const json = JSON.parse(script!.textContent || '{}');

    expect(json['@type']).toBe('FAQPage');
    expect(json.mainEntity).toHaveLength(3);

    expect(json.mainEntity[0].name).toBe(
      'What are the major differences between the 2026 and 2027 Toyota RAV4?'
    );
    expect(json.mainEntity[0].acceptedAnswer.text).toBe(
      'The 2027 RAV4 introduces a native NACS (Tesla-style) charging port and DC fast charging on all PHEVs, upgrades PHEV power to 321 hp (6th-gen system), increases Woodland ground clearance to 9.1 inches, and standardizes Toyota Safety Sense 4.0 with an integrated drive recorder.'
    );

    expect(json.mainEntity[1].name).toBe(
      'Will my 2026 RAV4 allocation roll over into a 2027 model year?'
    );
    expect(json.mainEntity[1].acceptedAnswer.text).toBe(
      "Yes. In Toyota's bi-weekly dealer allocation system, build slots clearing Japanese or North American plants between November and January will transition to 2027 VINs without losing queue position."
    );

    expect(json.mainEntity[2].name).toBe(
      'Should I pass on a 2026 RAV4 Plug-in Hybrid to get a 2027?'
    );
    expect(json.mainEntity[2].acceptedAnswer.text).toBe(
      'Only if native NACS Supercharger access and 11 kW Level 2 charging are critical to you. Passing on a late 2026 build will push delivery back by 6 to 12 months, subject you to annual model-year price bumps, and may cross into lower federal PHEV incentive brackets.'
    );
  });

  it('renders page header and carryover comparison table', () => {
    render(
      <MarketProvider initialMarket="CA">
        <Rav42026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(
      screen.getByRole('heading', {
        name: /2026 vs\. 2027 Toyota RAV4: Key Differences, NACS Port & Wait Times/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Year-Over-Year Carryover & Upgrade Comparison/i)).toBeInTheDocument();
    expect(screen.getByText(/Native NACS \(J3400\) \+ Level 3 DC Fast Charging/i)).toBeInTheDocument();
    expect(screen.getByText(/321 hp net system \(6th-Gen\)/i)).toBeInTheDocument();
    expect(screen.getByText(/9\.1 inches \(231 mm\)/i)).toBeInTheDocument();
    expect(screen.getByText(/TSS 4\.0 with Factory Drive Recorder/i)).toBeInTheDocument();
  });

  it('renders "Pass or Take It?" decision engine with clear criteria', () => {
    render(
      <MarketProvider initialMarket="CA">
        <Rav42026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(screen.getByText(/"Pass or Take It\?" Buyer Decision Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/Take the 2026 Allocation If:/i)).toBeInTheDocument();
    expect(screen.getByText(/Hold Out for the 2027 If:/i)).toBeInTheDocument();
    expect(screen.getByText(/\+6 to \+12 Months/i)).toBeInTheDocument();
  });

  it('renders live inventory bridge banner linking to RAV4 stock', () => {
    render(
      <MarketProvider initialMarket="CA">
        <Rav42026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(screen.getByText(/Looking for an Immediate In-Transit Allocation\?/i)).toBeInTheDocument();
    const inventoryLink = screen.getByRole('link', { name: /Explore Live RAV4 Inventory ↗/i });
    expect(inventoryLink).toHaveAttribute('href', '/inventory?model=Toyota%20RAV4');
  });

  it('details Nagakusa, Takaoka and TMMK factory queue rollover and rebate dynamics', () => {
    render(
      <MarketProvider initialMarket="CA">
        <Rav42026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(screen.getByText(/Nagakusa, Takaoka & TMMK Plant Changeovers/i)).toBeInTheDocument();
    expect(screen.getByText(/Provincial & Federal Incentive Phase-Downs/i)).toBeInTheDocument();
  });

  it('renders Delivery Day Gear shelf with 4 cards and localized Amazon links', () => {
    render(
      <MarketProvider initialMarket="CA">
        <Rav42026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(screen.getByText(/Delivery Day Gear Shelf: Tested 2026 & 2027 Fitments/i)).toBeInTheDocument();

    // 1. NACS EVSE
    expect(screen.getByText(/Tesla Universal Wall Connector \(NACS & J1772 Level 2 EVSE\)/i)).toBeInTheDocument();
    expect(screen.getByText(/2027 Ready/i)).toBeInTheDocument();
    const evseLink = screen.getByRole('link', { name: /View EVSE on Amazon ↗/i });
    expect(evseLink.getAttribute('href')).toContain('tag=toyotawaits-20');
    expect(evseLink.getAttribute('href')).toContain('amazon.ca');
    expect(evseLink).toHaveAttribute('target', '_blank');
    expect(evseLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

    // 2. High-Wall Floor Mats
    expect(screen.getByText(/High-Wall 3D All-Weather Floor Mats/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirmed Fit 2019-2027/i)).toBeInTheDocument();
    const matsLink = screen.getByRole('link', { name: /Check Mats on Amazon ↗/i });
    expect(matsLink.getAttribute('href')).toContain('tag=toyotawaits-20');
    expect(matsLink.getAttribute('href')).toContain('amazon.ca');

    // 3. TSS Dashcam
    expect(screen.getByText(/FitcamX 4K OEM Integrated Dashcam \/ Backup Solution/i)).toBeInTheDocument();
    const dashcamLink = screen.getByRole('link', { name: /View Dashcam on Amazon ↗/i });
    expect(dashcamLink.getAttribute('href')).toContain('tag=toyotawaits-20');
    expect(dashcamLink.getAttribute('href')).toContain('amazon.ca');

    // 4. Spigen Screen Protector
    expect(screen.getByText(/Spigen Tempered Glass Screen Protector \(10\.5" \/ 12\.3"\)/i)).toBeInTheDocument();
    const screenLink = screen.getByRole('link', { name: /Check Screen Protector ↗/i });
    expect(screenLink.getAttribute('href')).toContain('tag=toyotawaits-20');
    expect(screenLink.getAttribute('href')).toContain('amazon.ca');
  });

  it('routes to Amazon.com with US tag when US market is active', () => {
    render(
      <MarketProvider initialMarket="US">
        <Rav42026Vs2027GuidePage />
      </MarketProvider>
    );

    const evseLink = screen.getByRole('link', { name: /View EVSE on Amazon ↗/i });
    expect(evseLink.getAttribute('href')).toContain('tag=toyotawaits07-20');
    expect(evseLink.getAttribute('href')).toContain('amazon.com');
  });
});

describe('WSJCalloutBanner', () => {
  it('renders official 2027 announcement alert linking to the guide', () => {
    render(
      <MarketProvider initialMarket="CA">
        <WSJCalloutBanner forceShow={true} />
      </MarketProvider>
    );

    expect(screen.getByTestId('wsj-callout-banner')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Official Update: Toyota announces 2027 RAV4 with native NACS port, 321-hp PHEV, and 9\.1" Woodland lift\. See how 2026 build slots roll over →/i
      )
    ).toBeInTheDocument();

    const link = screen.getByRole('link', {
      name: /Official Update: Toyota announces 2027 RAV4 with native NACS port, 321-hp PHEV, and 9\.1" Woodland lift\. See how 2026 build slots roll over →/i,
    });
    expect(link).toHaveAttribute('href', '/guides/toyota-rav4-2026-vs-2027');
  });
});
