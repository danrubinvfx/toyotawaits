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
      '2026 vs. 2027 Toyota RAV4: NACS Charging, Trims & Wait Times | ToyotaWaits'
    );
    expect(meta.description).toBe(
      'Compare the 2026 and 2027 Toyota RAV4. Breakdown of native NACS Tesla charging, 11kW AC onboard charger, 321 hp PHEV, 9.1-inch Woodland lift, and Canadian delivery queues.'
    );
    expect(meta.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/guides/toyota-rav4-2026-vs-2027'
    );
  });

  it('renders JSON-LD FAQPage schema with the mandatory questions', () => {
    const { container } = render(
      <MarketProvider initialMarket="CA">
        <Rav42026Vs2027GuidePage />
      </MarketProvider>
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const json = JSON.parse(script!.textContent || '{}');

    expect(json['@type']).toBe('FAQPage');
    expect(json.mainEntity.length).toBeGreaterThanOrEqual(2);

    expect(json.mainEntity[0].name).toBe(
      'What are the biggest upgrades on the 2027 Toyota RAV4?'
    );
    expect(json.mainEntity[0].acceptedAnswer.text).toBe(
      'The 2027 RAV4 introduces native NACS ports for direct Tesla Supercharger access, Level 3 DC fast charging on PHEVs, an upgraded 11 kW AC onboard charger, and TSS 4.0 with a factory dashcam.'
    );

    expect(json.mainEntity[1].name).toBe(
      'Should I accept a 2026 RAV4 allocation or hold out for a 2027?'
    );
    expect(json.mainEntity[1].acceptedAnswer.text).toBe(
      'Hybrid (HEV) buyers should take a 2026 build immediately to dodge annual MSRP inflation. Plug-in Hybrid (PHEV) buyers wanting native Tesla Supercharging may prefer waiting for 2027, though taking delivery in 2026 locks in an extra $500 in Canadian federal iZEV rebates.'
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
        name: /2026 vs\. 2027 Toyota RAV4: NACS Charging, Trims & Wait Times/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/2026 vs\. 2027 RAV4 Specification Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/Native NACS \(SAE J3400\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Standard on PHEV \(Level 3 DC\)/i)).toBeInTheDocument();
    expect(screen.getByText(/321 hp \(6th-Gen\)/i)).toBeInTheDocument();
    expect(screen.getByText(/9\.1" \(231 mm\)/i)).toBeInTheDocument();
    expect(screen.getByText(/TSS 4\.0 Factory Integrated Drive Recorder/i)).toBeInTheDocument();
    expect(screen.getByText(/\$2,500 CAD \(Full\)/i)).toBeInTheDocument();
  });

  it('renders "The Verdict" decision matrix with clear criteria', () => {
    render(
      <MarketProvider initialMarket="CA">
        <Rav42026Vs2027GuidePage />
      </MarketProvider>
    );

    expect(screen.getByText(/The Verdict: What Should Deposit Holders Do\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Gas Deposit Holders/i)).toBeInTheDocument();
    expect(screen.getByText(/Hybrid \(HEV\) Holders/i)).toBeInTheDocument();
    expect(screen.getByText(/PHEV Deposit Holders/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. Point-of-Sale Rebate Security/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. NACS & DC Fast Charging ROI Reality/i)).toBeInTheDocument();
    expect(screen.getByText(/18\.1 kWh battery and 68 km EV range/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Queue Reset Penalty/i)).toBeInTheDocument();
    expect(screen.getByText(/resets wait times by 8–14\+ months/i)).toBeInTheDocument();
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

    // 2. High-Wall Floor Mats / TuxMat
    expect(screen.getByText(/TuxMat Laser-Fit All-Weather Floor Liners/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirmed Fit 2019-2027/i)).toBeInTheDocument();
    const matsLink = screen.getByRole('link', { name: /View TuxMat on Amazon ↗/i });
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
