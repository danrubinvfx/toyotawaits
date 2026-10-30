import { describe, it, expect } from 'vitest';
import { generateNotificationEmail } from '@/lib/email/notification-template';
import {
  AMAZON_ASSOCIATES_DISCLOSURE,
  SIENNA_HITCH_GUIDE_URL,
  generateAllocationDropAlertEmail,
  getCuratedGearForDropAlert,
} from '@/lib/alerts/templates';

describe('Notification Email Engine & Template Generator', () => {
  const samplePayload = {
    recipientEmail: 'buyer@example.ca',
    model: 'RAV4',
    modelSlug: 'rav4',
    trim: 'XSE Technology Package (AWD)',
    province: 'BC',
    orderDate: '2025-06-15',
    deliveryDate: '2026-07-20',
    waitDays: 400,
    medianWaitDays: 410,
    momTrendPercent: '-12 days',
    activeOrdersCount: 18,
    unsubscribeToken: 'c3756b2c-6332-4752-9b27-44f331ca8711',
  };

  it('generates compliant List-Unsubscribe headers with HTTPS and mailto URLs', () => {
    const email = generateNotificationEmail(samplePayload);

    expect(email.headers).toBeDefined();
    expect(email.headers['List-Unsubscribe']).toContain('https://toyotawaits.ca/unsubscribe?token=c3756b2c-6332-4752-9b27-44f331ca8711');
    expect(email.headers['List-Unsubscribe']).toContain('mailto:unsubscribe@toyotawaits.ca');
    expect(email.headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');
  });

  it('includes branding header and high-contrast dark-mode styling', () => {
    const email = generateNotificationEmail(samplePayload);

    expect(email.html).toContain('ToyotaWaits.ca 🍁 Canada');
    expect(email.html).toContain('#09090b'); // Dark-mode background
    expect(email.html).toContain('#f59e0b'); // Amber accent color
    expect(email.subject).toContain('RAV4');
    expect(email.subject).toContain('BC');
  });

  it('renders complete vehicle match details (spec, location, deposit, delivery, days waited)', () => {
    const email = generateNotificationEmail(samplePayload);

    expect(email.html).toContain('RAV4');
    expect(email.html).toContain('XSE Technology Package (AWD)');
    expect(email.html).toContain('BC');
    expect(email.html).toContain('400 days');
    expect(email.text).toContain('400 days');
    expect(email.text).toContain('2025-06-15');
    expect(email.text).toContain('2026-07-20');
  });

  it('renders regional benchmark delta grid (median wait, MoM trend, active orders)', () => {
    const email = generateNotificationEmail(samplePayload);

    expect(email.html).toContain('410 Days');
    expect(email.html).toContain('-12 days');
    expect(email.html).toContain('18 Orders');
  });

  it('contains primary Re-engagement CTA and secondary Delivery Prep / Mods link', () => {
    const email = generateNotificationEmail(samplePayload);

    // Primary CTA
    expect(email.html).toContain('https://toyotawaits.ca/estimates?model=rav4&province=BC');
    expect(email.html).toContain('View Updated Estimates');

    // Secondary Delivery Prep Card & Mods link
    expect(email.html).toContain('https://toyotawaits.ca/mods/rav4');
    expect(email.html).toContain('Delivery Day Prep &amp; Community Mods');
    expect(email.text).toContain('https://toyotawaits.ca/mods/rav4');
  });

  it('contains functional one-click unsubscribe links in footer and body', () => {
    const email = generateNotificationEmail(samplePayload);

    const unsubUrl = 'https://toyotawaits.ca/unsubscribe?token=c3756b2c-6332-4752-9b27-44f331ca8711';
    expect(email.html).toContain(unsubUrl);
    expect(email.html).toContain('Unsubscribe with one click');
    expect(email.text).toContain(unsubUrl);
  });

  it('renders Ko-fi community project support link above unsubscribe link in footer', () => {
    const email = generateNotificationEmail(samplePayload);

    const kofiUrl = 'https://ko-fi.com/toyotawaits';
    const supportText = 'ToyotaWaits is an independent community project. If this tracker helped you, support hosting costs at';

    expect(email.html).toContain(kofiUrl);
    expect(email.html).toContain(supportText);
    expect(email.text).toContain(kofiUrl);
    expect(email.text).toContain(supportText);
  });

  describe('Allocation Drop Alert Enhancements (Calculator CTA, Gear Picks, Guide Cross-Links)', () => {
    it('renders RAV4 calculator CTA, FitcamX & TuxMat gear picks, and wait-times hub link in HTML and text', () => {
      const email = generateAllocationDropAlertEmail({
        model: 'RAV4',
        trim: 'XSE AWD',
        vin: '2T3P1RFV5TC123456',
        dealerName: 'Jim Pattison Toyota Downtown',
        vdpUrl: 'https://www.jptoyota-downtown.com/vehicles/rav4-1',
        unsubscribeToken: 'tok-rav4-123',
      });

      const expectedCalcText =
        'Planning your budget? Calculate your annual fuel savings and break-even timeline for this RAV4 on our Hybrid Savings Calculator: https://www.toyotawaits.ca/calculator/rav4';
      expect(email.text).toContain(expectedCalcText);
      expect(email.html).toContain('https://www.toyotawaits.ca/calculator/rav4');

      // 2 Curated Picks for RAV4: FitcamX OEM 4K Dashcam & TuxMat TPE Liners
      expect(email.html).toContain('FitcamX OEM 4K Dashcam');
      expect(email.html).toContain('TuxMat TPE Liners');
      expect(email.html).toContain('Check on Amazon ↗');
      expect(email.text).toContain('FitcamX OEM 4K Dashcam');
      expect(email.text).toContain('TuxMat TPE Liners');

      // Zero-404 search URLs with CA Associate tag
      for (const pick of email.gearPicks) {
        expect(pick.url).toContain('https://www.amazon.ca/s?k=');
        expect(pick.url).toContain('tag=toyotawaits-20');
        expect(email.html).toContain(pick.url);
        expect(email.text).toContain(pick.url);
      }

      // Standard Amazon Associates disclosure
      expect(email.html).toContain(AMAZON_ASSOCIATES_DISCLOSURE);
      expect(email.text).toContain(AMAZON_ASSOCIATES_DISCLOSURE);

      // Model Hub Cross-Link for non-Sienna
      expect(email.html).toContain('https://www.toyotawaits.ca/wait-times/rav4');
      expect(email.text).toContain('https://www.toyotawaits.ca/wait-times/rav4');
    });

    it('renders Sienna calculator CTA, 3-Row Liners & Sliding Console Organizer, and Sienna Trailer Hitch Guide link', () => {
      const email = generateAllocationDropAlertEmail({
        model: 'Sienna',
        trim: 'XSE 7-Passenger',
        vin: '5TDGSKFC1TS289848',
        dealerName: 'Jim Pattison Toyota Surrey',
      });

      expect(email.text).toContain(
        'Planning your budget? Calculate your annual fuel savings and break-even timeline for this Sienna on our Hybrid Savings Calculator: https://www.toyotawaits.ca/calculator/sienna'
      );
      expect(email.html).toContain('https://www.toyotawaits.ca/calculator/sienna');

      // 2 Curated Picks for Sienna
      expect(email.html).toContain('3-Row Custom Floor Liners');
      expect(email.html).toContain('Center Console Sliding Organizer');
      expect(email.text).toContain('3-Row Custom Floor Liners');
      expect(email.text).toContain('Center Console Sliding Organizer');

      // Sienna Trailer Hitch & Bike Rack Guide cross-link
      expect(email.guideUrl).toBe(SIENNA_HITCH_GUIDE_URL);
      expect(email.html).toContain(SIENNA_HITCH_GUIDE_URL);
      expect(email.text).toContain(SIENNA_HITCH_GUIDE_URL);
    });

    it('renders Grand Highlander calculator CTA, 12.3" Matte Screen Protector & TSS 3.0 Dashcam, and wait-times hub link', () => {
      const email = generateAllocationDropAlertEmail({
        model: 'Grand Highlander',
        trim: 'Limited',
        vin: '5TDAAAA50RS001122',
        dealerName: 'OpenRoad Toyota Richmond',
      });

      expect(email.text).toContain(
        'Planning your budget? Calculate your annual fuel savings and break-even timeline for this Grand Highlander on our Hybrid Savings Calculator: https://www.toyotawaits.ca/calculator/grand-highlander'
      );
      expect(email.html).toContain('https://www.toyotawaits.ca/calculator/grand-highlander');

      // 2 Curated Picks for Grand Highlander
      expect(email.html).toContain('12.3" Matte Screen Protector');
      expect(email.html).toContain('TSS 3.0 Dashcam');
      expect(email.text).toContain('12.3" Matte Screen Protector');
      expect(email.text).toContain('TSS 3.0 Dashcam');

      // Model Hub Cross-Link
      expect(email.html).toContain('https://www.toyotawaits.ca/wait-times/grand-highlander');
      expect(email.text).toContain('https://www.toyotawaits.ca/wait-times/grand-highlander');
    });

    it('supports US market Associate tag (toyotawaits07-20) on zero-404 search URLs', () => {
      const usPicks = getCuratedGearForDropAlert('RAV4', 'US');
      expect(usPicks).toHaveLength(2);
      for (const pick of usPicks) {
        expect(pick.url).toContain('https://www.amazon.com/s?k=');
        expect(pick.url).toContain('tag=toyotawaits07-20');
      }
    });

    it('renders articulate vehicle dossier with header, status badge, pricing, dealership, and stock # for single vehicle', () => {
      const email = generateAllocationDropAlertEmail({
        model: 'Corolla Hatchback',
        trim: 'SE Upgrade',
        modelYear: 2026,
        powertrain: '2.0L',
        drivetrain: 'FWD',
        vin: '2T1BURHE7TC123456',
        status: 'in_transit',
        stockNumber: 'STK-2026-CH',
        dealerName: 'Jim Pattison Toyota Surrey',
        dealerCity: 'Surrey, BC',
        sellingPrice: 31796,
        vdpUrl: 'https://www.jptoyota-surrey.com/vehicles/corolla-hatch-1',
      });

      // Subject format: Allocation Alert: ${vehicle.model} (${vehicle.trim}) at ${vehicle.dealerName}
      expect(email.subject).toBe('Allocation Alert: Corolla Hatchback (SE Upgrade) at Jim Pattison Toyota Surrey');

      // Header: 2026 Corolla Hatchback SE Upgrade - 2.0L FWD
      expect(email.html).toContain('2026 Corolla Hatchback SE Upgrade - 2.0L FWD');
      expect(email.text).toContain('2026 Corolla Hatchback SE Upgrade - 2.0L FWD');

      // Status Badge: In Transit
      expect(email.html).toContain('In Transit');
      expect(email.text).toContain('Status: In Transit');

      // Key details grid: VIN, Pricing ($31,796 CAD), Dealership, Stock #
      expect(email.html).toContain('2T1BURHE7TC123456');
      expect(email.html).toContain('$31,796 CAD');
      expect(email.html).toContain('Jim Pattison Toyota Surrey · Surrey, BC');
      expect(email.html).toContain('STK-2026-CH');

      // Direct Action
      expect(email.html).toContain('View Dealer Listing');
      expect(email.html).toContain('https://www.jptoyota-surrey.com/vehicles/corolla-hatch-1');
    });

    it('renders multi-vehicle batch digest with consolidated subject and distinct cards', () => {
      const email = generateAllocationDropAlertEmail({
        recipientEmail: 'buyer@example.ca',
        vehicles: [
          {
            vin: '2T1BURHE7TC111111',
            model: 'Corolla Hatchback',
            trim: 'SE Upgrade',
            modelYear: 2026,
            powertrain: '2.0L FWD',
            status: 'in_transit',
            stockNumber: 'STK-01',
            dealerName: 'Jim Pattison Toyota Surrey',
            dealerCity: 'Surrey, BC',
            sellingPrice: 31796,
            vdpUrl: 'https://dealer.ca/v1',
          },
          {
            vin: '2T3P1RFV5TC222222',
            model: 'RAV4',
            trim: 'XSE',
            modelYear: 2025,
            powertrain: 'Hybrid AWD',
            status: 'on_lot',
            dealerName: 'OpenRoad Toyota Richmond',
            dealerCity: 'Richmond, BC',
            sellingPrice: 42500,
            vdpUrl: 'https://dealer.ca/v2',
          },
        ],
      });

      // Subject format: Allocation Alert: ${vehicles.length} New Toyota Matches Observed (${distinctModels.join(', ')})
      expect(email.subject).toBe('Allocation Alert: 2 New Toyota Matches Observed (Corolla Hatchback, RAV4)');

      // Both vehicles present in HTML and plain-text
      expect(email.html).toContain('2026 Corolla Hatchback SE Upgrade - 2.0L FWD');
      expect(email.html).toContain('2025 RAV4 XSE - Hybrid AWD');
      expect(email.html).toContain('2T1BURHE7TC111111');
      expect(email.html).toContain('2T3P1RFV5TC222222');
      expect(email.html).toContain('Jim Pattison Toyota Surrey · Surrey, BC');
      expect(email.html).toContain('OpenRoad Toyota Richmond · Richmond, BC');

      expect(email.text).toContain('2T1BURHE7TC111111');
      expect(email.text).toContain('2T3P1RFV5TC222222');
    });

    it('renders Corolla Hatchback hero gear essentials without copy-paste bleed (FitcamX, Floor Liners, Console Tray)', () => {
      const email = generateAllocationDropAlertEmail({
        model: 'Corolla Hatchback',
        trim: 'SE Upgrade',
        vin: '2T1BURHE7TC123456',
        dealerName: 'Jim Pattison Toyota Surrey',
      });

      // 3 Curated Hero Essentials for Corolla Hatchback
      expect(email.gearPicks).toHaveLength(3);

      const [dashcam, floorLiners, consoleTray] = email.gearPicks;

      // 1. FitcamX OEM 4K Integrated Dashcam
      expect(dashcam.title).toBe('FitcamX OEM-Integrated 4K Dashcam');
      expect(dashcam.description).toBe(
        'Clean factory-look dashcam drawing power directly from the TSS rearview mirror harness without exposed wires.'
      );
      expect(dashcam.searchQuery).toBe('Fitcamx dash cam Toyota Corolla Hatchback 2020-2026 OEM 4K');
      expect(dashcam.url).toContain('https://www.amazon.ca/s?k=');
      expect(dashcam.url).toContain('tag=toyotawaits-20');

      // 2. Laser-Measured All-Weather Floor Liners
      expect(floorLiners.title).toBe('Custom-Fit All-Weather Floor Liners');
      expect(floorLiners.description).toBe(
        'High-wall TPE waterproof liners engineered for Corolla Hatchback floor wells and retention clips.'
      );
      expect(floorLiners.searchQuery).toBe(
        'Toyota Corolla Hatchback custom all weather floor mats liners'
      );
      expect(floorLiners.url).toContain('https://www.amazon.ca/s?k=');
      expect(floorLiners.url).toContain('tag=toyotawaits-20');

      // 3. Center Console Drop-In Divider Tray
      expect(consoleTray.title).toBe('Center Console Armrest Organizer Tray');
      expect(consoleTray.description).toBe(
        'Dual-tier organizer tray dividing the deep armrest compartment with coin and cable slots.'
      );
      expect(consoleTray.searchQuery).toBe(
        'Toyota Corolla Hatchback center console organizer tray 2020-2026'
      );
      expect(consoleTray.url).toContain('https://www.amazon.ca/s?k=');
      expect(consoleTray.url).toContain('tag=toyotawaits-20');

      // Zero copy-paste bleed: NO knee cushions or generic armrest covers
      expect(email.html).not.toContain('knee cushion');
      expect(email.html).not.toContain('Stops right knee soreness');
      expect(email.text).not.toContain('knee cushion');
    });
  });
});
