import { describe, it, expect } from 'vitest';
import {
  getEstimatorInventoryModelName,
  getActiveInventoryCountByModel,
} from '@/lib/inventory/counts';
import { INITIAL_SAMPLE_LISTINGS } from '@/components/discovery/InventoryExplorer';

describe('Inventory Counts & Estimator Model Mapping', () => {
  describe('getEstimatorInventoryModelName', () => {
    it('correctly maps RAV4 powertrains to dealer inventory model names', () => {
      expect(getEstimatorInventoryModelName('rav4', 'phev')).toBe('RAV4 Plug-in Hybrid');
      expect(getEstimatorInventoryModelName('rav4', 'hev')).toBe('RAV4 Hybrid');
      expect(getEstimatorInventoryModelName('rav4', 'gas')).toBe('RAV4');
    });

    it('correctly maps Prius powertrains', () => {
      expect(getEstimatorInventoryModelName('prius', 'phev')).toBe('Prius Prime');
      expect(getEstimatorInventoryModelName('prius', 'hev')).toBe('Prius');
    });

    it('correctly maps Grand Highlander, Corolla, and Corolla Cross', () => {
      expect(getEstimatorInventoryModelName('grand-highlander', 'hev')).toBe('Grand Highlander Hybrid');
      expect(getEstimatorInventoryModelName('grand-highlander', 'gas')).toBe('Grand Highlander');
      expect(getEstimatorInventoryModelName('corolla', 'hev')).toBe('Corolla Hybrid');
      expect(getEstimatorInventoryModelName('corolla', 'gas')).toBe('Corolla');
      expect(getEstimatorInventoryModelName('corolla-cross', 'hev')).toBe('Corolla Cross Hybrid');
    });

    it('correctly maps models with standard catalog names', () => {
      expect(getEstimatorInventoryModelName('sienna')).toBe('Sienna');
      expect(getEstimatorInventoryModelName('tacoma')).toBe('Tacoma');
      expect(getEstimatorInventoryModelName('land-cruiser')).toBe('Land Cruiser');
    });
  });

  describe('getActiveInventoryCountByModel', () => {
    it('returns exact count from sample listings when countsOrListings is omitted', () => {
      const rav4PhevCount = getActiveInventoryCountByModel('RAV4 Plug-in Hybrid');
      expect(rav4PhevCount).toBeGreaterThanOrEqual(1);

      const siennaCount = getActiveInventoryCountByModel('Sienna');
      expect(siennaCount).toBeGreaterThanOrEqual(2);

      const unknownCount = getActiveInventoryCountByModel('NonExistentModel999');
      expect(unknownCount).toBe(0);
    });

    it('calculates counts from a provided count map', () => {
      const countsMap = {
        'RAV4 Plug-in Hybrid': 4,
        'RAV4 Hybrid': 8,
        'Sienna': 12,
        'Tacoma': 3,
      };

      expect(getActiveInventoryCountByModel('RAV4 Plug-in Hybrid', countsMap)).toBe(4);
      expect(getActiveInventoryCountByModel('Sienna', countsMap)).toBe(12);
      expect(getActiveInventoryCountByModel('Tacoma', countsMap)).toBe(3);
      expect(getActiveInventoryCountByModel('Corolla', countsMap)).toBe(0);
    });

    it('calculates counts directly from a listings array', () => {
      const mockListings = [
        {
          id: '1',
          make: 'Toyota',
          model: 'RAV4 Plug-in Hybrid',
          trim: 'SE AWD',
          modelYear: 2026,
          vin: null,
          provisionalId: null,
          isProvisionalVin: true,
          dealerName: 'Dealer A',
          dealerCity: 'Vancouver',
          dealerProvince: 'BC',
          status: 'Advertised',
          lastChecked: '2026-10-20',
          vdpUrl: null,
          msrp: 48000,
          sellingPrice: 48000,
          mandatoryFees: null,
          hasUnverifiedFees: true,
          powertrain: 'Plug-in Hybrid',
        },
        {
          id: '2',
          make: 'Toyota',
          model: 'RAV4 Hybrid',
          trim: 'XSE AWD',
          modelYear: 2026,
          vin: null,
          provisionalId: null,
          isProvisionalVin: true,
          dealerName: 'Dealer B',
          dealerCity: 'Surrey',
          dealerProvince: 'BC',
          status: 'Advertised',
          lastChecked: '2026-10-20',
          vdpUrl: null,
          msrp: 46000,
          sellingPrice: 46000,
          mandatoryFees: null,
          hasUnverifiedFees: true,
          powertrain: 'Hybrid',
        },
      ];

      expect(getActiveInventoryCountByModel('RAV4 Plug-in Hybrid', mockListings)).toBe(1);
      expect(getActiveInventoryCountByModel('RAV4 Hybrid', mockListings)).toBe(1);
      expect(getActiveInventoryCountByModel('Sienna', mockListings)).toBe(0);
    });
  });
});
