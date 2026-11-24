import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const mockHeaders = vi.fn();

vi.mock('next/headers', () => ({
  headers: () => mockHeaders(),
}));

import Sienna2026Vs2027GuidePage, {
  generateMetadata,
  dynamic,
} from '@/app/guides/toyota-sienna-2026-vs-2027/page';
import { MarketProvider } from '@/context/MarketContext';

describe('2026 vs. 2027 Toyota Sienna Guide Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeaders.mockRejectedValue(new Error('No active request headers'));
  });
  it('has valid Next.js 16 dynamic route configuration', async () => {
    expect(dynamic).toBe('force-dynamic');
  });

  it('has valid SEO metadata matching specification requirements', async () => {
    const meta = await generateMetadata();
    expect(meta.title).toBe(
      '2026 vs. 2027 Toyota Sienna Canada: Changes, Pricing & Wait Times | ToyotaWaits'
    );
    expect(meta.description).toBe(
      'Compare the 2026 and 2027 Toyota Sienna in Canada. Full trim matrix, XLE AWD return, MSRP changes, and how dealer waitlist rollovers work.'
    );
    expect(meta.alternates?.canonical).toBe(
      'https://www.toyotawaits.ca/guides/toyota-sienna-2026-vs-2027'
    );
  });

  it('renders JSON-LD FAQPage schema with updated 2027 THS 6 and TSS 4.0 specs', async () => {
    const { container } = render(
      <MarketProvider initialMarket="CA">
        {await Sienna2026Vs2027GuidePage()}
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
    expect(json.mainEntity[0].acceptedAnswer.text).toContain('THS 6');
    expect(json.mainEntity[0].acceptedAnswer.text).toContain('251 hp');
    expect(json.mainEntity[0].acceptedAnswer.text).toContain('1.15 kWh Li-ion battery');
    expect(json.mainEntity[0].acceptedAnswer.text).toContain('Toyota Safety Sense 4.0');

    expect(json.mainEntity[1].name).toBe(
      'Will my Canadian 2026 Sienna allocation automatically turn into a 2027?'
    );
    expect(json.mainEntity[1].acceptedAnswer.text).toContain('early 2027');

    expect(json.mainEntity[2].name).toBe(
      'What is the difference between the Sienna XSE and LE suspension, and what is new for 2027?'
    );
    expect(json.mainEntity[2].acceptedAnswer.text).toContain('sport-tuned dampers');
    expect(json.mainEntity[2].acceptedAnswer.text).toContain('12.9-inch rear screen');
  });

  it('renders page header, Pass or Take It verdict, and 2026 vs 2027 comparison table', async () => {
    render(
      <MarketProvider initialMarket="CA">
        {await Sienna2026Vs2027GuidePage()}
      </MarketProvider>
    );

    expect(
      screen.getByRole('heading', {
        name: /2026 vs\. 2027 Toyota Sienna: Key Differences, Trim Matrix & Wait Times/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /Pass or Take It\? 2026 Allocation vs\. 2027 Upgrade Verdict/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Year-Over-Year Comparison \(2026 vs\. 2027\)/i)).toBeInTheDocument();
    expect(screen.getByText(/2\.5L 4-Cyl Hybrid \(245 hp net\)/i)).toBeInTheDocument();
    expect(screen.getByText(/6th-Gen Hybrid \(THS 6, 251 hp net\)/i)).toBeInTheDocument();
    expect(screen.getByText(/New steering, AHB-C posture control & -1\.6 dB dash silencer/i)).toBeInTheDocument();
    expect(screen.getByText(/Toyota Safety Sense 4\.0 \+ Drive Recorder dash cam/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Standard 12\.3" touchscreen \+ 12\.3" digital cluster; new Storm Cloud paint/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/33\.5 cu\. ft\. deep sunken tub/i)).toHaveLength(2);
    expect(screen.getAllByText(/3,500 lbs \/ 1,585 kg/i)).toHaveLength(2);
  });

  it('renders all 5 trim grades in the trim matrix with 2027 upgrades', async () => {
    render(
      <MarketProvider initialMarket="CA">
        {await Sienna2026Vs2027GuidePage()}
      </MarketProvider>
    );

    expect(screen.getByText(/LE \(8-Passenger\)/i)).toBeInTheDocument();
    expect(screen.getByText(/XLE \(7 or 8-Pass\)/i)).toBeInTheDocument();
    expect(screen.getByText(/XSE \(7-Passenger\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Limited \(7-Passenger\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Platinum \(7-Passenger\)/i)).toBeInTheDocument();
    expect(screen.getByText(/XLE\+ adds 8-way power passenger seat/i)).toBeInTheDocument();
    expect(screen.getByText(/Ventilated & memory front seats, Head-Up Display \(HUD\), Panoramic View Monitor/i)).toBeInTheDocument();
  });

  it('details Indiana TMMI queue rollover mechanics and Pass or Take It tradeoff', async () => {
    render(
      <MarketProvider initialMarket="CA">
        {await Sienna2026Vs2027GuidePage()}
      </MarketProvider>
    );

    expect(screen.getByText(/The TMMI Indiana Factory Switchover \(Nov–Jan\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Pass or Take It\? Weighing a 2026 Slot vs\. Early-2027 Arrival/i)).toBeInTheDocument();
  });

  it('renders live inventory bridge banner linking to Sienna stock', async () => {
    render(
      <MarketProvider initialMarket="CA">
        {await Sienna2026Vs2027GuidePage()}
      </MarketProvider>
    );

    expect(screen.getByText(/Looking for an Incoming Allocation Right Now\?/i)).toBeInTheDocument();
    const inventoryLink = screen.getByRole('link', { name: /Explore Live Sienna Stock ↗/i });
    expect(inventoryLink).toHaveAttribute('href', '/inventory?model=Toyota%20Sienna');
  });

  it('renders Delivery Day Gear shelf with localized Amazon, partner links, and 2027 fitment notes', async () => {
    render(
      <MarketProvider initialMarket="CA">
        {await Sienna2026Vs2027GuidePage()}
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

    // FitcamX card with 2027 Drive Recorder annotation
    expect(screen.getByText(/FitcamX 4K OEM Integrated Dashcam/i)).toBeInTheDocument();
    expect(
      screen.getByText(/2027 Siennas include factory Drive Recorder & TSS 4\.0/i)
    ).toBeInTheDocument();
    const fitcamxLink = screen.getByRole('link', { name: /View Camera on Amazon ↗/i });
    expect(fitcamxLink.getAttribute('href')).toContain('tag=toyotawaits-20');
    expect(fitcamxLink.getAttribute('href')).toContain('amazon.ca');

    // 12.3" Screen Protector card with 2027 standard 12.3" fitment annotation
    expect(screen.getByText(/Tempered Glass 12\.3" Screen Protector/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Fits all 2027 trims \(standard 12\.3" display\)/i)
    ).toBeInTheDocument();
    const protectorLink = screen.getByRole('link', { name: /View Protector on Amazon ↗/i });
    expect(protectorLink.getAttribute('href')).toContain('tag=toyotawaits-20');
    expect(protectorLink.getAttribute('href')).toContain('amazon.ca');
    expect(protectorLink).toHaveAttribute('target', '_blank');
    expect(protectorLink).toHaveAttribute('rel', 'sponsored noopener noreferrer nofollow');

    // Floor liners card
    expect(screen.getByText(/3-Row High-Wall All-Weather Floor Liners/i)).toBeInTheDocument();
    const floorMatsLink = screen.getByRole('link', { name: /Check Amazon Stock ↗/i });
    expect(floorMatsLink.getAttribute('href')).toContain('tag=toyotawaits-20');
    expect(floorMatsLink.getAttribute('href')).toContain('amazon.ca');
  });

  it('routes to Amazon.com with US tag when US market is selected', async () => {
    render(
      <MarketProvider initialMarket="US">
        {await Sienna2026Vs2027GuidePage()}
      </MarketProvider>
    );

    const curtLink = screen.getByRole('link', { name: /View Hitch on Amazon ↗/i });
    expect(curtLink.getAttribute('href')).toContain('tag=toyotawaits07-20');
    expect(curtLink.getAttribute('href')).toContain('amazon.com');
  });

  it('emits US metadata and localized US copy when requested on www.toyotawaits.com', async () => {
    mockHeaders.mockResolvedValue(
      new Headers({
        'x-forwarded-host': 'www.toyotawaits.com',
      })
    );

    const meta = await generateMetadata();
    expect(meta.alternates?.canonical).toBe(
      'https://www.toyotawaits.com/guides/toyota-sienna-2026-vs-2027'
    );
    expect(meta.alternates?.languages).toEqual({
      'en-CA': 'https://www.toyotawaits.ca/guides/toyota-sienna-2026-vs-2027',
      'en-US': 'https://www.toyotawaits.com/guides/toyota-sienna-2026-vs-2027',
      'x-default': 'https://www.toyotawaits.ca/guides/toyota-sienna-2026-vs-2027',
    });

    render(
      <MarketProvider initialMarket="US">
        {await Sienna2026Vs2027GuidePage()}
      </MarketProvider>
    );

    expect(screen.getByText(/Independent US Buyer Intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/Complete US Trim Level Matrix/i)).toBeInTheDocument();
    expect(screen.getByText(/How US Sienna Allocation Queue Rollovers Work/i)).toBeInTheDocument();
    expect(screen.queryByText(/Canadian buyers/i)).not.toBeInTheDocument();
  });
});
