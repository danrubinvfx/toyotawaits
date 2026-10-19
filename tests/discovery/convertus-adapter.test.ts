/**
 * tests/discovery/convertus-adapter.test.ts
 *
 * Sprint 2: Convertus Ingestion Adapter Unit & Contract Test Suite
 * Master Plan V3.2 Appendix A & Section 3
 */

import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  constructConvertusVdpUrl,
  formatRawPrice,
  normalizeConvertusStatus,
  normalizeDealerBaseUrl,
  parseConvertusPayload,
  parseConvertusRecord,
  parseNumericPrice,
} from '../../lib/discovery/adapters/convertus';
import { isValid17CharVin, NormalizedListingStatus } from '../../lib/discovery/types';

describe('Convertus Ingestion Adapter', () => {
  const fixturePath = path.resolve(
    process.cwd(),
    'audit-artifacts',
    'dealer-discovery',
    'convertus-vms-sample.json'
  );

  it('loads and validates the live fixture file', () => {
    expect(fs.existsSync(fixturePath)).toBe(true);
    const rawContent = fs.readFileSync(fixturePath, 'utf8');
    const parsed = JSON.parse(rawContent);
    expect(parsed.results).toBeInstanceOf(Array);
    expect(parsed.results.length).toBe(1);
  });

  describe('Contract Test: Live Reference Fixture Mapping', () => {
    it('accurately maps the sanitized Jim Pattison Convertus VMS payload', () => {
      const rawContent = fs.readFileSync(fixturePath, 'utf8');
      const result = parseConvertusPayload(rawContent);

      expect(result.success).toBe(true);
      expect(result.count).toBe(1);
      expect(result.totalInPayload).toBe(1);
      expect(result.quarantined).toHaveLength(0);

      const item = result.records[0];

      // Vehicle Attributes
      expect(item.vehicle.vin).toBe('JTDACAAJ0T3038212');
      expect(item.vehicle.isProvisionalVin).toBe(false);
      expect(item.vehicle.provisionalId).toBeNull();
      expect(item.vehicle.make).toBe('Toyota');
      expect(item.vehicle.model).toBe('Crown Signia');
      expect(item.vehicle.trim).toBe('Limited');
      expect(item.vehicle.modelYear).toBe(2026);
      expect(item.vehicle.modelCode).toBe('ACAAJC');
      expect(item.vehicle.packageCode).toBe('B,PRE1');
      expect(item.vehicle.bodyStyle).toBe('SUV');
      expect(item.vehicle.powertrain).toBe('Gas/Electric Hybrid');
      expect(item.vehicle.transmission).toBe('Automatic');
      expect(item.vehicle.driveTrain).toBe('All Wheel Drive');
      expect(item.vehicle.exteriorColor).toBe('Finish Line Red w/Black Roof');
      expect(item.vehicle.interiorColor).toBe('Black');

      // Listing Attributes
      expect(item.listing.sourceListingId).toBe('69116486');
      expect(item.listing.stockNumber).toBe('D-26136');
      expect(item.listing.vdpUrl).toContain('Crown%20Signia');
      expect(item.listing.daysOnLot).toBe(271);
      expect(item.listing.normalizedStatus).toBe(
        NormalizedListingStatus.ADVERTISED_UNCONFIRMED
      );
      expect(item.listing.rawStatus).toContain('in_transit: 0');

      // Financial Attributes
      expect(item.pricing.msrp).toBe(61285);
      expect(item.pricing.rawMsrp).toBe('61285');
      expect(item.pricing.askingPrice).toBe(61957);
      expect(item.pricing.rawAskingPrice).toBe('61957');
      expect(item.pricing.sellingPrice).toBe(63957);
      expect(item.pricing.rawSellingPrice).toBe('63957');
      expect(item.pricing.hasUnverifiedFees).toBe(true); // Empty breakdown array -> unverified fees
    });
  });

  describe('VIN Validation & Provisional Identifier Handling', () => {
    it('accepts valid 17-character ISO VINs', () => {
      expect(isValid17CharVin('JTDACAAJ0T3038212')).toBe(true);
      expect(isValid17CharVin('JTMBGAHB7TY605512')).toBe(true);
      expect(isValid17CharVin('3TYLB5JN2TT130799')).toBe(true);
      expect(isValid17CharVin('5TFNC5DB3TX142652')).toBe(true);
    });

    it('rejects invalid or provisional VINs violating ISO 3779 standards', () => {
      expect(isValid17CharVin(null)).toBe(false);
      expect(isValid17CharVin('')).toBe(false);
      expect(isValid17CharVin('SHORT12345')).toBe(false); // too short
      expect(isValid17CharVin('TOOLONG1234567890123')).toBe(false); // too long
      expect(isValid17CharVin('JTDACAAIOT3038212')).toBe(false); // Contains forbidden 'I'
      expect(isValid17CharVin('JTDACAAJOT3038212')).toBe(false); // Contains forbidden 'O'
      expect(isValid17CharVin('JTDACAAJQT3038212')).toBe(false); // Contains forbidden 'Q'
      expect(isValid17CharVin('PROV-STOCK-9921')).toBe(false);
    });

    it('marks record as provisional when VIN is missing or invalid without synthesizing fake VIN', () => {
      const mockRecord = {
        make: 'Toyota',
        model: 'RAV4',
        year: 2026,
        vin: 'PROVISIONAL-991',
        stock_number: 'STK-8812',
        ad_id: '12345',
      };

      const { record, quarantine } = parseConvertusRecord(mockRecord, 0);

      expect(quarantine).toBeUndefined();
      expect(record).toBeDefined();
      expect(record!.vehicle.vin).toBeNull();
      expect(record!.vehicle.isProvisionalVin).toBe(true);
      expect(record!.vehicle.provisionalId).toBe('PROVISIONAL-991');
    });

    it('derives provisionalId from stock_number when VIN is completely empty', () => {
      const mockRecord = {
        make: 'Toyota',
        model: 'Tacoma',
        year: 2026,
        vin: null,
        stock_number: 'STK-007',
        ad_id: '998877',
      };

      const { record } = parseConvertusRecord(mockRecord, 1);
      expect(record!.vehicle.vin).toBeNull();
      expect(record!.vehicle.isProvisionalVin).toBe(true);
      expect(record!.vehicle.provisionalId).toBe('STK-007');
    });
  });

  describe('Status Normalization (Master Plan V3.2 Page 3)', () => {
    it("maps in_transit = 1 to 'Incoming availability unconfirmed'", () => {
      const { normalized } = normalizeConvertusStatus({
        sale_class: 'New',
        in_transit: 1,
        on_order: 0,
      });
      expect(normalized).toBe(NormalizedListingStatus.INCOMING_UNCONFIRMED);
    });

    it("maps on_order = 1 to 'Incoming availability unconfirmed'", () => {
      const { normalized } = normalizeConvertusStatus({
        sale_class: 'New',
        in_transit: 0,
        on_order: 1,
      });
      expect(normalized).toBe(NormalizedListingStatus.INCOMING_UNCONFIRMED);
    });

    it("maps in_transit = 0 and on_order = 0 to 'Advertised - availability unconfirmed'", () => {
      const { normalized } = normalizeConvertusStatus({
        sale_class: 'New',
        in_transit: 0,
        on_order: 0,
      });
      expect(normalized).toBe(NormalizedListingStatus.ADVERTISED_UNCONFIRMED);
    });

    it("maps sold/reserved flags to 'Reserved / sold'", () => {
      expect(
        normalizeConvertusStatus({ sale_class: 'Sold', in_transit: 0 }).normalized
      ).toBe(NormalizedListingStatus.RESERVED_SOLD);

      expect(
        normalizeConvertusStatus({ sale_class: 'Reserved', in_transit: 1 }).normalized
      ).toBe(NormalizedListingStatus.RESERVED_SOLD);

      expect(
        normalizeConvertusStatus({ sale_class: 'Pending Sale' }).normalized
      ).toBe(NormalizedListingStatus.RESERVED_SOLD);

      expect(
        normalizeConvertusStatus({ sale_class: 'New', is_sold: 1 }).normalized
      ).toBe(NormalizedListingStatus.RESERVED_SOLD);

      expect(
        normalizeConvertusStatus({ sale_class: 'New', reserved: true }).normalized
      ).toBe(NormalizedListingStatus.RESERVED_SOLD);
    });
  });

  describe('Pricing & Fee Parsing Accuracy', () => {
    it('correctly parses numbers and raw strings for various numeric formats', () => {
      expect(parseNumericPrice(61285)).toBe(61285);
      expect(parseNumericPrice('61,285')).toBe(61285);
      expect(parseNumericPrice('$61,285.50')).toBe(61285.5);
      expect(parseNumericPrice(0)).toBeNull();
      expect(parseNumericPrice(-500)).toBeNull();
      expect(parseNumericPrice(null)).toBeNull();
      expect(parseNumericPrice(undefined)).toBeNull();
      expect(parseNumericPrice('N/A')).toBeNull();

      expect(formatRawPrice(61285)).toBe('61285');
      expect(formatRawPrice('$61,285 CAD ')).toBe('$61,285 CAD');
      expect(formatRawPrice(null)).toBeNull();
    });

    it('extracts mandatory fees when explicit breakdown items are present', () => {
      const mockRecord = {
        make: 'Toyota',
        model: 'Corolla',
        year: 2026,
        vin: 'JTDACAAJ0T3038212',
        msrp: 32000,
        asking_price: 33500,
        breakdown: [
          { type: 'fee', amount: 1200, title: 'Freight & PDI' },
          { type: 'mandatory_fee', amount: 300, title: 'Dealer Admin Fee' },
          { type: 'incentive', amount: 1000, title: 'Rebate' }, // should not count as mandatory fee
        ],
      };

      const { record } = parseConvertusRecord(mockRecord, 0);
      expect(record!.pricing.mandatoryFees).toBe(1500);
      expect(record!.pricing.hasUnverifiedFees).toBe(false);
    });

    it('flags unverified fees when fee breakdown is omitted', () => {
      const mockRecord = {
        make: 'Toyota',
        model: 'Corolla',
        year: 2026,
        vin: 'JTDACAAJ0T3038212',
        msrp: 32000,
        asking_price: 33500,
        breakdown: [],
      };

      const { record } = parseConvertusRecord(mockRecord, 0);
      expect(record!.pricing.mandatoryFees).toBeNull();
      expect(record!.pricing.hasUnverifiedFees).toBe(true);
    });
  });

  describe('Resiliency & Quarantining', () => {
    it('handles empty results array cleanly', () => {
      const result = parseConvertusPayload({ results: [] });
      expect(result.success).toBe(true);
      expect(result.count).toBe(0);
      expect(result.totalInPayload).toBe(0);
      expect(result.records).toHaveLength(0);
      expect(result.quarantined).toHaveLength(0);
    });

    it('handles direct array input cleanly', () => {
      const result = parseConvertusPayload([
        { make: 'Toyota', model: 'Sienna', year: 2026, vin: 'JTDACAAJ0T3038212' },
      ]);
      expect(result.success).toBe(true);
      expect(result.count).toBe(1);
    });

    it('gracefully fails on malformed JSON without crashing', () => {
      const result = parseConvertusPayload('INVALID_JSON{{[[');
      expect(result.success).toBe(false);
      expect(result.count).toBe(0);
      expect(result.error).toContain('JSON parse failure');
    });

    it('gracefully fails on invalid non-object payload', () => {
      const result = parseConvertusPayload(null);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid payload structure');
    });

    it('quarantines malformed items while parsing valid items', () => {
      const mixedPayload = {
        results: [
          { make: 'Toyota', model: 'Highlander', year: 2026, vin: 'JTDACAAJ0T3038212' },
          null, // malformed
          { year: 2026, vin: '123' }, // missing make and model
          'random_string_item', // not an object
          { make: 'Toyota', model: 'Camry', year: 2026, vin: 'JTMBGAHB7TY605512' },
        ],
      };

      const result = parseConvertusPayload(mixedPayload);
      expect(result.success).toBe(true);
      expect(result.totalInPayload).toBe(5);
      expect(result.count).toBe(2);
      expect(result.quarantined).toHaveLength(3);

      expect(result.records[0].vehicle.model).toBe('Highlander');
      expect(result.records[1].vehicle.model).toBe('Camry');

      expect(result.quarantined[0].reason).toContain('not a valid vehicle object');
      expect(result.quarantined[1].reason).toContain('Missing mandatory vehicle definition');
      expect(result.quarantined[2].reason).toContain('not a valid vehicle object');
    });
  });

  describe('Canonical Dealer VDP URL Construction & Search Fallback Handling', () => {
    it('prepends dealer base domain when Convertus payload provides a relative VDP path', () => {
      const mockRecord = {
        make: 'Toyota',
        model: 'RAV4',
        year: 2026,
        vin: 'JTDACAAJ0T3038212',
        vdp_url: '/vehicles/2026/toyota/rav4/vancouver/bc/998877/?sale_class=New',
        company_data: {
          company_web_address: 'https://www.jptoyota-downtown.com/',
        },
      };

      const url = constructConvertusVdpUrl(mockRecord);
      expect(url).toBe(
        'https://www.jptoyota-downtown.com/vehicles/2026/toyota/rav4/vancouver/bc/998877/?sale_class=New'
      );
    });

    it('constructs standard Convertus VDP routing when direct VDP link is missing but VMS ID is present', () => {
      const mockRecord = {
        make: 'Toyota',
        model: 'Crown Signia',
        year: 2026,
        vin: 'JTDACAAJ0T3038212',
        ad_id: '69116486',
        sale_class: 'New',
        company_data: {
          company_city: 'Vancouver',
          company_province: 'BC',
          company_web_address: 'https://www.jptoyota-downtown.com',
        },
      };

      const url = constructConvertusVdpUrl(mockRecord);
      expect(url).toBe(
        'https://www.jptoyota-downtown.com/vehicles/2026/Toyota/Crown%20Signia/Vancouver/BC/69116486/?sale_class=New'
      );
    });

    it('falls back cleanly to public new inventory search page when internal VMS ID is missing', () => {
      const mockRecord = {
        make: 'Toyota',
        model: 'Sienna',
        year: 2026,
        vin: 'JTDACAAJ0T3038212',
        company_data: {
          company_web_address: 'https://www.jptoyota-downtown.com',
        },
      };

      const url = constructConvertusVdpUrl(mockRecord);
      expect(url).toBe(
        'https://www.jptoyota-downtown.com/vehicles/new/?keyword=JTDACAAJ0T3038212'
      );
    });

    it('falls back to stock number search when VIN is provisional and VMS ID is missing', () => {
      const mockRecord = {
        make: 'Toyota',
        model: 'Sienna',
        year: 2026,
        vin: null,
        stock_number: 'SI-9944',
        company_data: {
          company_web_address: 'https://www.jptoyota-downtown.com',
        },
      };

      const url = constructConvertusVdpUrl(mockRecord);
      expect(url).toBe('https://www.jptoyota-downtown.com/vehicles/new/?keyword=SI-9944');
    });

    it('corrects missing-hyphen domain typo and replaces dead /new-vehicles/ placeholder', () => {
      const mockRecord = {
        make: 'Toyota',
        model: 'Tacoma',
        year: 2026,
        vin: '3TYLB5EN8RT009988',
        vdp_url: 'https://www.jptoyotadowntown.com/new-vehicles/',
      };

      const url = constructConvertusVdpUrl(mockRecord);
      expect(url).toBe(
        'https://www.jptoyota-downtown.com/vehicles/new/?keyword=3TYLB5EN8RT009988'
      );
    });

    it('normalizes dealer base URL cleanly', () => {
      expect(normalizeDealerBaseUrl('http://www.jptoyotadowntown.com/')).toBe(
        'https://www.jptoyota-downtown.com'
      );
      expect(normalizeDealerBaseUrl('https://www.jptoyota-downtown.com///')).toBe(
        'https://www.jptoyota-downtown.com'
      );
      expect(normalizeDealerBaseUrl('http://www.jptoyotasurrey.com/')).toBe(
        'https://www.jptoyota-surrey.com'
      );
    });

    it('corrects missing-hyphen domain typo for Surrey VDP URLs', () => {
      const mockRecord = {
        make: 'Toyota',
        model: 'RAV4',
        year: 2026,
        vin: '2T36CRAVXTW109453',
        vdp_url: 'https://www.jptoyotasurrey.com/vehicles/2026/Toyota/RAV4/Surrey/BC/71577607/?sale_class=New',
      };

      const url = constructConvertusVdpUrl(mockRecord);
      expect(url).toBe(
        'https://www.jptoyota-surrey.com/vehicles/2026/Toyota/RAV4/Surrey/BC/71577607/?sale_class=New'
      );
    });
  });
});
