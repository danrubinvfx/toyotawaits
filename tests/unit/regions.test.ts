import { describe, it, expect } from 'vitest';
import {
  CANADIAN_PROVINCES,
  CANADIAN_PROVINCES_LIST,
  US_STATES,
  US_STATES_LIST,
  getRegionsForMarket,
  getRegionLabel,
  getDefaultRegion,
  getRegionByCode,
  isValidRegionForMarket,
} from '@/lib/constants/regions';

describe('Regions & Market Constants', () => {
  it('maintains all 13 Canadian provinces and territories', () => {
    const requiredCA = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];
    expect(CANADIAN_PROVINCES.length).toBe(13);
    for (const prov of requiredCA) {
      expect(CANADIAN_PROVINCES).toContain(prov);
      expect(CANADIAN_PROVINCES_LIST.some((p) => p.code === prov)).toBe(true);
    }
  });

  it('supports all 50 US states plus DC', () => {
    expect(US_STATES.length).toBe(51);
    expect(US_STATES).toContain('CA');
    expect(US_STATES).toContain('WA');
    expect(US_STATES).toContain('NY');
    expect(US_STATES).toContain('TX');
    expect(US_STATES).toContain('FL');
    expect(US_STATES_LIST.length).toBe(51);
  });

  it('returns correct region lists by market', () => {
    const caRegions = getRegionsForMarket('CA');
    expect(caRegions.length).toBe(13);
    expect(caRegions[0].code).toBe('AB');

    const usRegions = getRegionsForMarket('US');
    expect(usRegions.length).toBe(51);
    expect(usRegions.some((r) => r.code === 'CA')).toBe(true);
  });

  it('returns correct region labels by market', () => {
    expect(getRegionLabel('CA')).toBe('Province / Territory');
    expect(getRegionLabel('US')).toBe('State / Region');
  });

  it('returns correct default region code by market', () => {
    expect(getDefaultRegion('CA')).toBe('BC');
    expect(getDefaultRegion('US')).toBe('CA');
  });

  it('resolves region option by code across CA and US', () => {
    expect(getRegionByCode('BC')?.name).toBe('British Columbia');
    expect(getRegionByCode('WA')?.name).toBe('Washington');
    expect(getRegionByCode('unknown')).toBeUndefined();
  });

  it('validates whether a code belongs to a given market', () => {
    expect(isValidRegionForMarket('BC', 'CA')).toBe(true);
    expect(isValidRegionForMarket('BC', 'US')).toBe(false);
    expect(isValidRegionForMarket('WA', 'US')).toBe(true);
    expect(isValidRegionForMarket('WA', 'CA')).toBe(false);
  });
});
