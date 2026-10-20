/**
 * tests/unit/distance.test.ts
 *
 * Unit tests for Haversine distance calculations and Lower Mainland coordinates presets.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDistanceKm,
  getPresetCoordinates,
  LOWER_MAINLAND_PRESETS,
} from '@/lib/geo/distance';
import { DEALERS, getDealerCoordinates } from '@/config/dealers';

describe('Geo Distance & Preset Utilities', () => {
  describe('calculateDistanceKm', () => {
    it('returns 0 for identical coordinates', () => {
      const dist = calculateDistanceKm(49.2827, -123.1207, 49.2827, -123.1207);
      expect(dist).toBe(0);
    });

    it('accurately calculates distance between Burnaby and Downtown Vancouver dealer (~8.0 km)', () => {
      const burnaby = LOWER_MAINLAND_PRESETS.Burnaby;
      const downtown = DEALERS['jptoyota-downtown'];
      const dist = calculateDistanceKm(burnaby.lat, burnaby.lng, downtown.lat, downtown.lng);
      expect(dist).toBe(8.0);
    });

    it('accurately calculates distance between Burnaby and Surrey dealer (~14.4 km)', () => {
      const burnaby = LOWER_MAINLAND_PRESETS.Burnaby;
      const surrey = DEALERS['jptoyota-surrey'];
      const dist = calculateDistanceKm(burnaby.lat, burnaby.lng, surrey.lat, surrey.lng);
      expect(dist).toBe(14.4);
    });

    it('accurately calculates distance between Burnaby and West Coast Toyota dealer (~21.4 km)', () => {
      const burnaby = LOWER_MAINLAND_PRESETS.Burnaby;
      const westCoast = DEALERS['westcoast-toyota'];
      const dist = calculateDistanceKm(burnaby.lat, burnaby.lng, westCoast.lat, westCoast.lng);
      expect(dist).toBe(21.4);
    });

    it('accurately calculates distance between Surrey preset and Surrey dealer (~3.4 km)', () => {
      const surreyPreset = LOWER_MAINLAND_PRESETS.Surrey;
      const surreyDealer = DEALERS['jptoyota-surrey'];
      const dist = calculateDistanceKm(
        surreyPreset.lat,
        surreyPreset.lng,
        surreyDealer.lat,
        surreyDealer.lng
      );
      expect(dist).toBe(3.4);
    });
  });

  describe('getPresetCoordinates', () => {
    it('returns coordinates for valid Lower Mainland presets', () => {
      expect(getPresetCoordinates('Vancouver')).toEqual({ lat: 49.2827, lng: -123.1207 });
      expect(getPresetCoordinates('Burnaby')).toEqual({ lat: 49.2488, lng: -122.9805 });
      expect(getPresetCoordinates('Surrey')).toEqual({ lat: 49.1913, lng: -122.8490 });
      expect(getPresetCoordinates('Richmond')).toEqual({ lat: 49.1666, lng: -123.1336 });
      expect(getPresetCoordinates('Coquitlam / Tri-Cities')).toEqual({
        lat: 49.2838,
        lng: -122.7932,
      });
      expect(getPresetCoordinates('Langley')).toEqual({ lat: 49.1042, lng: -122.6604 });
      expect(getPresetCoordinates('Abbotsford')).toEqual({ lat: 49.0504, lng: -122.3045 });
    });

    it('handles case-insensitivity and aliases', () => {
      expect(getPresetCoordinates('burnaby')).toEqual({ lat: 49.2488, lng: -122.9805 });
      expect(getPresetCoordinates('coquitlam')).toEqual({ lat: 49.2838, lng: -122.7932 });
    });

    it('returns null for All or unknown locations', () => {
      expect(getPresetCoordinates('All')).toBeNull();
      expect(getPresetCoordinates('All Locations')).toBeNull();
      expect(getPresetCoordinates(null)).toBeNull();
      expect(getPresetCoordinates('Tokyo')).toBeNull();
    });
  });

  describe('getDealerCoordinates', () => {
    it('resolves coordinates by dealer id', () => {
      expect(getDealerCoordinates('jptoyota-downtown')).toEqual({ lat: 49.2638, lng: -123.0888 });
      expect(getDealerCoordinates('jptoyota-surrey')).toEqual({ lat: 49.1912, lng: -122.8024 });
      expect(getDealerCoordinates('westcoast-toyota')).toEqual({ lat: 49.2217, lng: -122.6881 });
    });

    it('resolves coordinates by dealer name or city', () => {
      expect(getDealerCoordinates('Jim Pattison Toyota Downtown', 'Vancouver')).toEqual({
        lat: 49.2638,
        lng: -123.0888,
      });
      expect(getDealerCoordinates('Jim Pattison Toyota Surrey', 'Surrey')).toEqual({
        lat: 49.1912,
        lng: -122.8024,
      });
      expect(getDealerCoordinates('West Coast Toyota', 'Pitt Meadows')).toEqual({
        lat: 49.2217,
        lng: -122.6881,
      });
    });
  });
});
