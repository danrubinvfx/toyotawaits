import { describe, it, expect } from 'vitest';
import {
  getCommunitySubmissions,
  insertSubmission,
  getSubmissionsForExport,
} from '@/lib/db/submissions';

describe('Regional Schema Partitioning and Filtering (CA vs US)', () => {
  it('partitions public feed to Canadian submissions by default or when CA is requested', async () => {
    const defaultSubmissions = await getCommunitySubmissions();
    expect(defaultSubmissions.length).toBeGreaterThan(0);
    expect(defaultSubmissions.every((s) => s.country_code !== 'US')).toBe(true);

    const caSubmissions = await getCommunitySubmissions('CA');
    expect(caSubmissions.length).toBe(defaultSubmissions.length);
    expect(caSubmissions.every((s) => s.country_code === 'CA' || !s.country_code)).toBe(true);
  });

  it('partitions public feed to U.S. submissions when US is requested', async () => {
    const usSubmissions = await getCommunitySubmissions('US');
    expect(usSubmissions.length).toBeGreaterThan(0);
    expect(usSubmissions.every((s) => s.country_code === 'US')).toBe(true);
    // Verify U.S. specific fields exist
    expect(usSubmissions.some((s) => Boolean(s.state))).toBe(true);
    expect(usSubmissions.some((s) => typeof s.dealer_markup_adm === 'number')).toBe(true);
  });

  it('successfully creates and retrieves a new U.S. submission with ADM and port destination', async () => {
    const created = await insertSubmission({
      modelId: 'rav4',
      powertrainId: 'rav4-hybrid',
      trimId: 'rav4-xle-hybrid',
      countryCode: 'US',
      state: 'OR',
      dealershipCity: 'Portland',
      dealershipName: 'Toyota of Portland',
      modelYear: 2026,
      orderDate: '2025-05-15',
      status: 'pending',
      pricing: 'above_msrp',
      mandatoryAddonsCad: 0,
      dealerMarkupAdm: 1995,
      portDestination: 'Portland Port',
      tradeInRequired: false,
      notes: 'ADM $1995 charged by dealer.',
      editKeyHash: 'hash-us-test-1234567890abcdef',
      isFlagged: false,
    });

    expect(created.id).toBeDefined();
    expect(created.country_code).toBe('US');
    expect(created.state).toBe('OR');
    expect(created.dealer_markup_adm).toBe(1995);
    expect(created.port_destination).toBe('Portland Port');

    // Retrieve via US partition feed
    const usFeed = await getCommunitySubmissions('US');
    const match = usFeed.find((s) => s.id === created.id);
    expect(match).toBeDefined();
    expect(match?.state).toBe('OR');
  });

  it('exports partitioned data filtering by country_code', async () => {
    const usExport = await getSubmissionsForExport({ country_code: 'US' });
    expect(usExport.length).toBeGreaterThan(0);
    expect(usExport.every((row) => row.country_code === 'US')).toBe(true);

    const caExport = await getSubmissionsForExport({ country_code: 'CA' });
    expect(caExport.length).toBeGreaterThan(0);
    expect(caExport.every((row) => row.country_code !== 'US')).toBe(true);
  });
});
