import { describe, it, expect, vi } from 'vitest';
import {
  parseLegacyCsv,
  resolveVehicleIdentifiers,
  scrubPII,
  normalizePricingDeal,
  evaluateOutlier,
  computeFingerprint,
  validateAndTransformRow,
  chunkArray,
  ingestLegacyData,
  RawLegacyRow,
} from '../../scripts/ingest-legacy-data';

describe('Legacy CSV Data Ingestion Pipeline', () => {
  describe('1. CSV Parsing (parseLegacyCsv)', () => {
    it('correctly parses raw CSV string into structured objects', () => {
      const csv = `model_id,powertrain_id,trim_name,province,dealer_city,dealer_name,deposit_date,delivery_date,status,pricing_deal,notes,source_reference
rav4,phev,XSE Technology Package AWD,BC,Richmond,OpenRoad Toyota,2024-03-15,2025-05-10,delivered,msrp,Pre-ordered before rebate changes,r/rav4prime`;

      const rows = parseLegacyCsv(csv);
      expect(rows).toHaveLength(1);
      expect(rows[0].model_id).toBe('rav4');
      expect(rows[0].powertrain_id).toBe('phev');
      expect(rows[0].trim_name).toBe('XSE Technology Package AWD');
      expect(rows[0].province).toBe('BC');
      expect(rows[0].dealer_city).toBe('Richmond');
      expect(rows[0].dealer_name).toBe('OpenRoad Toyota');
      expect(rows[0].deposit_date).toBe('2024-03-15');
      expect(rows[0].delivery_date).toBe('2025-05-10');
      expect(rows[0].status).toBe('delivered');
      expect(rows[0].pricing_deal).toBe('msrp');
      expect(rows[0].notes).toBe('Pre-ordered before rebate changes');
      expect(rows[0].source_reference).toBe('r/rav4prime');
    });

    it('handles quotes, commas within fields, and trims whitespace', () => {
      const csv = `model_id,powertrain_id,trim_name,province,dealer_city,dealer_name,deposit_date,delivery_date,status,pricing_deal,notes,source_reference
sienna,hev,"XSE AWD (7-Passenger)",ON,"Toronto, East",Ken Shaw Toyota,2024-01-10,2025-06-20,delivered,above_msrp,"Waited 17 months, paid extra for mats",historical_community_archive`;

      const rows = parseLegacyCsv(csv);
      expect(rows).toHaveLength(1);
      expect(rows[0].trim_name).toBe('XSE AWD (7-Passenger)');
      expect(rows[0].dealer_city).toBe('Toronto, East');
      expect(rows[0].notes).toBe('Waited 17 months, paid extra for mats');
    });
  });

  describe('2. Vehicle & Trim Resolution (resolveVehicleIdentifiers)', () => {
    it('resolves canonical model and powertrain with exact trim match', () => {
      const resolved = resolveVehicleIdentifiers('rav4', 'phev', 'XSE AWD Technology Package');
      expect(resolved).not.toBeNull();
      expect(resolved?.model.slug).toBe('rav4');
      expect(resolved?.powertrain.slug).toBe('phev');
      expect(resolved?.trim.slug).toBe('xse-technology-awd');
      expect(resolved?.trim.id).toBe('30000000-0000-4000-8000-000000000012');
    });

    it('fuzzy resolves common trim aliases and word orders', () => {
      // Reversed word order in input: "XSE Technology Package AWD" vs catalog "XSE AWD Technology Package"
      const resolved = resolveVehicleIdentifiers('rav4', 'phev', 'XSE Technology Package AWD');
      expect(resolved).not.toBeNull();
      expect(resolved?.trim.slug).toBe('xse-technology-awd');

      // Fuzzy resolve Land Cruiser 1958 Grade
      const lc = resolveVehicleIdentifiers('land-cruiser', 'hev', '1958 Grade');
      expect(lc).not.toBeNull();
      expect(lc?.trim.slug).toBe('1958-grade');

      // Fuzzy resolve Grand Highlander MAX
      const gh = resolveVehicleIdentifiers('grand-highlander', 'hybrid-max', 'Platinum Hybrid MAX AWD');
      expect(gh).not.toBeNull();
      expect(gh?.trim.slug).toBe('platinum-max-awd');

      // Resolve Prius Prime PHEV XSE
      const pp = resolveVehicleIdentifiers('prius-prime', 'phev', 'XSE');
      expect(pp).not.toBeNull();
      expect(pp?.model.slug).toBe('prius-prime');
      expect(pp?.powertrain.slug).toBe('phev');
      expect(pp?.trim.slug).toBe('xse');

      // Resolve Prius HEV XLE AWD
      const p = resolveVehicleIdentifiers('prius', 'hev', 'XLE AWD');
      expect(p).not.toBeNull();
      expect(p?.model.slug).toBe('prius');
      expect(p?.powertrain.slug).toBe('hev');
      expect(p?.trim.slug).toBe('xle-awd');
    });

    it('gracefully falls back to first trim of powertrain when ambiguous and triggers warning', () => {
      const warningSpy = vi.fn();
      const resolved = resolveVehicleIdentifiers('sienna', 'hev', 'Unknown Custom Special Edition', warningSpy);

      expect(resolved).not.toBeNull();
      expect(resolved?.trim.name).toBe('LE FWD (8-Passenger)');
      expect(warningSpy).toHaveBeenCalledWith(
        expect.stringContaining('Falling back to "LE FWD (8-Passenger)"')
      );
    });

    it('returns null for nonexistent model or powertrain', () => {
      const warningSpy = vi.fn();
      const resolved = resolveVehicleIdentifiers('corolla', 'hev', 'LE', warningSpy);
      expect(resolved).toBeNull();
      expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('Unable to resolve vehicle model'));
    });
  });

  describe('3. Zero-PII Scrubber (scrubPII)', () => {
    it('returns null for empty or whitespace notes', () => {
      expect(scrubPII(null).sanitized).toBeNull();
      expect(scrubPII('').sanitized).toBeNull();
      expect(scrubPII('   ').sanitized).toBeNull();
    });

    it('preserves clean community notes without PII', () => {
      const note = 'Dealer honored MSRP with no mandatory protection packages.';
      const res = scrubPII(note);
      expect(res.hasPII).toBe(false);
      expect(res.sanitized).toBe(note);
    });

    it('detects and redacts emails, phone numbers, postal codes, and VINs', () => {
      const dirtyNote =
        'Contact me at john.doe@example.com or 604-555-1234. Delivered to V6X 2W8 with VIN 2T3C1RFV8MC123456.';
      const res = scrubPII(dirtyNote);

      expect(res.hasPII).toBe(true);
      expect(res.sanitized).toContain('[REDACTED_EMAIL]');
      expect(res.sanitized).toContain('[REDACTED_PHONE]');
      expect(res.sanitized).toContain('[REDACTED_POSTAL]');
      expect(res.sanitized).toContain('[REDACTED_VIN]');
      expect(res.sanitized).not.toContain('john.doe@example.com');
      expect(res.sanitized).not.toContain('604-555-1234');
      expect(res.sanitized).not.toContain('V6X 2W8');
      expect(res.sanitized).not.toContain('2T3C1RFV8MC123456');
    });

    it('enforces 280 character limit with ellipsis truncation', () => {
      const longNote = 'This is a long community submission note for tracking wait times. '.repeat(6);
      const res = scrubPII(longNote);
      expect(res.sanitized?.length).toBe(280);
      expect(res.sanitized?.endsWith('...')).toBe(true);
    });
  });

  describe('4. Outlier Evaluator (evaluateOutlier)', () => {
    it('identifies realistic wait times as non-outliers', () => {
      // 200 days wait
      const res = evaluateOutlier('2024-01-01', '2024-07-19');
      expect(res.isOutlier).toBe(false);
      expect(res.waitDays).toBe(200);
    });

    it('flags wait times < 14 days as extreme low outliers', () => {
      // 4 days wait (lot cancellation)
      const res = evaluateOutlier('2025-01-01', '2025-01-05');
      expect(res.isOutlier).toBe(true);
      expect(res.waitDays).toBe(4);
      expect(res.reason).toContain('< 14 days');
    });

    it('flags wait times > 1825 days (5 years) as extreme high outliers', () => {
      // 2000 days wait
      const res = evaluateOutlier('2019-01-01', '2024-06-24');
      expect(res.isOutlier).toBe(true);
      expect(res.waitDays).toBeGreaterThan(1825);
      expect(res.reason).toContain('exceeds 1825 days');
    });
  });

  describe('5. Row Validation & Transformation (validateAndTransformRow)', () => {
    const fixedNow = new Date('2026-10-07T12:00:00Z');

    const validDeliveredRow: RawLegacyRow = {
      model_id: 'rav4',
      powertrain_id: 'phev',
      trim_name: 'XSE Technology Package AWD',
      province: 'BC',
      dealer_city: 'Richmond',
      dealer_name: 'OpenRoad Toyota',
      deposit_date: '2024-03-15',
      delivery_date: '2025-05-10',
      status: 'delivered',
      pricing_deal: 'msrp',
      notes: 'Delivered at MSRP',
      source_reference: 'historical_community_archive',
    };

    it('successfully validates and transforms a valid delivered row', () => {
      const res = validateAndTransformRow(validDeliveredRow, { currentDate: fixedNow });
      expect(res.isValid).toBe(true);
      if (res.isValid) {
        expect(res.record.model_id).toBe('10000000-0000-4000-8000-000000000001');
        expect(res.record.powertrain_id).toBe('20000000-0000-4000-8000-000000000002');
        expect(res.record.trim_id).toBe('30000000-0000-4000-8000-000000000012');
        expect(res.record.province).toBe('BC');
        expect(res.record.status).toBe('delivered');
        expect(res.record.pricing).toBe('at_msrp');
        expect(res.record.order_date).toBe('2024-03-15');
        expect(res.record.delivery_date).toBe('2025-05-10');
        expect(res.record.is_flagged).toBe(false);
        expect(res.isOutlier).toBe(false);
        expect(res.record.edit_key_hash).toHaveLength(64); // SHA-256
      }
    });

    it('successfully validates a pending reservation without delivery date', () => {
      const pendingRow: RawLegacyRow = {
        ...validDeliveredRow,
        status: 'pending',
        delivery_date: '',
      };

      const res = validateAndTransformRow(pendingRow, { currentDate: fixedNow });
      expect(res.isValid).toBe(true);
      if (res.isValid) {
        expect(res.record.status).toBe('pending');
        expect(res.record.delivery_date).toBeNull();
      }
    });

    it('rejects invalid Canadian province', () => {
      const row: RawLegacyRow = { ...validDeliveredRow, province: 'CALIFORNIA' };
      const res = validateAndTransformRow(row, { currentDate: fixedNow });
      expect(res.isValid).toBe(false);
      if (!res.isValid) {
        expect(res.reason).toContain('Invalid Canadian province');
      }
    });

    it('rejects future deposit dates', () => {
      const row: RawLegacyRow = { ...validDeliveredRow, deposit_date: '2028-01-01' };
      const res = validateAndTransformRow(row, { currentDate: fixedNow });
      expect(res.isValid).toBe(false);
      if (!res.isValid) {
        expect(res.reason).toContain('cannot be in the future');
      }
    });

    it('rejects delivery date preceding deposit date', () => {
      const row: RawLegacyRow = {
        ...validDeliveredRow,
        deposit_date: '2025-05-10',
        delivery_date: '2024-03-15',
      };
      const res = validateAndTransformRow(row, { currentDate: fixedNow });
      expect(res.isValid).toBe(false);
      if (!res.isValid) {
        expect(res.reason).toContain('cannot precede deposit_date');
      }
    });

    it('rejects delivered status with missing delivery date', () => {
      const row: RawLegacyRow = { ...validDeliveredRow, status: 'delivered', delivery_date: '' };
      const res = validateAndTransformRow(row, { currentDate: fixedNow });
      expect(res.isValid).toBe(false);
      if (!res.isValid) {
        expect(res.reason).toContain('delivery_date is required');
      }
    });

    it('rejects pending status with extraneous delivery date', () => {
      const row: RawLegacyRow = { ...validDeliveredRow, status: 'pending', delivery_date: '2025-05-10' };
      const res = validateAndTransformRow(row, { currentDate: fixedNow });
      expect(res.isValid).toBe(false);
      if (!res.isValid) {
        expect(res.reason).toContain('delivery_date must be empty');
      }
    });

    it('marks record as is_flagged = true when an outlier duration is detected', () => {
      const outlierRow: RawLegacyRow = {
        ...validDeliveredRow,
        deposit_date: '2025-01-01',
        delivery_date: '2025-01-04', // 3 days wait
      };

      const res = validateAndTransformRow(outlierRow, { currentDate: fixedNow });
      expect(res.isValid).toBe(true);
      if (res.isValid) {
        expect(res.isOutlier).toBe(true);
        expect(res.record.is_flagged).toBe(true);
      }
    });
  });

  describe('6. Deduplication & Fingerprinting (computeFingerprint)', () => {
    it('produces identical fingerprints for duplicate records', () => {
      const fp1 = computeFingerprint('model-1', 'pt-1', 'bc', '2024-03-15', '2025-05-10');
      const fp2 = computeFingerprint('model-1', 'pt-1', 'BC', '2024-03-15', '2025-05-10');
      expect(fp1).toBe(fp2);
    });

    it('produces different fingerprints for different dates or provinces', () => {
      const fp1 = computeFingerprint('model-1', 'pt-1', 'BC', '2024-03-15', '2025-05-10');
      const fp2 = computeFingerprint('model-1', 'pt-1', 'ON', '2024-03-15', '2025-05-10');
      const fp3 = computeFingerprint('model-1', 'pt-1', 'BC', '2024-04-01', '2025-05-10');
      expect(fp1).not.toBe(fp2);
      expect(fp1).not.toBe(fp3);
    });
  });

  describe('7. Chunking Utility (chunkArray)', () => {
    it('partitions arrays into chunks of specified batch size', () => {
      const items = Array.from({ length: 125 }, (_, i) => i);
      const chunks = chunkArray(items, 50);

      expect(chunks).toHaveLength(3);
      expect(chunks[0]).toHaveLength(50);
      expect(chunks[1]).toHaveLength(50);
      expect(chunks[2]).toHaveLength(25);
    });
  });

  describe('8. End-to-End Ingestion Pipeline (ingestLegacyData)', () => {
    const fixedNow = new Date('2026-10-07T12:00:00Z');

    it('processes a mixed CSV batch reporting correct insertions, duplicates, skips, and outliers', async () => {
      const testCsv = `model_id,powertrain_id,trim_name,province,dealer_city,dealer_name,deposit_date,delivery_date,status,pricing_deal,notes,source_reference
# Row 1: Valid
rav4,phev,XSE Technology Package AWD,BC,Richmond,OpenRoad Toyota,2024-03-15,2025-05-10,delivered,msrp,Clean note,r/rav4
# Row 2: Duplicate of Row 1
rav4,phev,XSE Technology Package AWD,BC,Richmond,OpenRoad Toyota,2024-03-15,2025-05-10,delivered,msrp,Clean note,r/rav4
# Row 3: Valid pending
sienna,hev,LE AWD,ON,Toronto,Ken Shaw Toyota,2024-01-10,,pending,msrp,Pending delivery,r/sienna
# Row 4: Outlier (< 14 days)
rav4,hev,LE AWD,AB,Calgary,Stampede Toyota,2025-01-01,2025-01-05,delivered,msrp,Cancellation pickup,r/rav4club
# Row 5: Validation Failure (invalid province)
land-cruiser,hev,1958 Grade,ZZ,Unknown,Dealer,2025-01-01,2025-05-01,delivered,msrp,Invalid,archive
# Row 6: Validation Failure (delivery before deposit)
grand-highlander,hev,XLE Hybrid AWD,QC,Montreal,Spinelli,2025-05-01,2024-01-01,delivered,msrp,Invalid dates,archive`;

      const summary = await ingestLegacyData({
        csvContent: testCsv,
        batchSize: 50,
        dryRun: true,
        currentDate: fixedNow,
      });

      expect(summary.totalProcessed).toBe(6);
      expect(summary.validInserted).toBe(3); // Row 1, Row 3, Row 4 (outlier is valid but quarantined/flagged)
      expect(summary.duplicatesSkipped).toBe(1); // Row 2
      expect(summary.validationSkipped).toBe(2); // Row 5 (invalid prov), Row 6 (inverted dates)
      expect(summary.outliersQuarantined).toBe(1); // Row 4 (4 days wait)
      expect(summary.errors).toHaveLength(2);
    });

    it('successfully processes the actual seed dataset file', async () => {
      const summary = await ingestLegacyData({
        csvFilePath: 'data/legacy-seed-data.csv',
        batchSize: 50,
        dryRun: true,
        currentDate: fixedNow,
      });

      expect(summary.totalProcessed).toBeGreaterThanOrEqual(35);
      expect(summary.validInserted).toBe(summary.totalProcessed);
      expect(summary.duplicatesSkipped).toBe(0);
      expect(summary.validationSkipped).toBe(0);
      expect(summary.errors).toHaveLength(0);
    });
  });
});
