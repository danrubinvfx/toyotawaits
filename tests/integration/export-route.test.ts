import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/export/route';

describe('GET /api/export', () => {
  it('returns 200 OK with formatted CSV data and UTF-8 BOM', async () => {
    const request = new NextRequest('http://localhost:3000/api/export?format=csv');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/csv');
    expect(response.headers.get('Content-Disposition')).toContain('toyotawaits-data.csv');
    expect(response.headers.get('Cache-Control')).toContain('public');

    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    // Verify UTF-8 BOM bytes (0xEF, 0xBB, 0xBF)
    expect(bytes[0]).toBe(0xef);
    expect(bytes[1]).toBe(0xbb);
    expect(bytes[2]).toBe(0xbf);

    const csvText = new TextDecoder('utf-8').decode(bytes.slice(3));

    // Verify CSV Header line matching RFC 4180 format with full audit schema
    expect(csvText).toContain(
      'id,created_at,order_date,delivered_date,model_year,model_name,trim_name,powertrain,province,wait_days,status,pricing,addons_cad'
    );
    // Verify seeded data presence
    expect(csvText).toContain('RAV4');
    expect(csvText).toContain('delivered');
  });

  it('filters data by model parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/export?model=sienna');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const csvText = await response.text();
    expect(csvText).toContain('Sienna');
  });

  it('exports the complete unpaginated dataset with all 57 community entries', async () => {
    const request = new NextRequest('http://localhost:3000/api/export?format=csv');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const csvText = await response.text();
    const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    // Header line + 57 data rows = 58 total lines
    expect(lines.length).toBe(58);
  });

  it('filters data by powertrain and status returning only matching PHEV records without hybrid leaks', async () => {
    const request = new NextRequest('http://localhost:3000/api/export?powertrain=phev&status=pending');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const csvText = await response.text();
    const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    // Remove header
    const dataLines = lines.slice(1);
    expect(dataLines.length).toBeGreaterThan(0);

    for (const line of dataLines) {
      // Row format: id,created_at,order_date,delivered_date,model_year,model_name,trim_name,powertrain,province,wait_days,status,pricing,addons_cad
      const columns = line.split(',');
      const powertrainVal = columns[7];
      const statusVal = columns[10];

      expect(powertrainVal).toContain('PHEV');
      expect(statusVal).toBe('pending');
    }
  });

  it('filters by model, powertrain, status, and province correctly and includes order_date, delivered_date, and powertrain', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/export?format=csv&model=RAV4&powertrain=phev&status=pending&province=BC'
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    const csvText = await response.text();
    const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    const headerColumns = lines[0].replace(/^\uFEFF/, '').split(',');
    expect(headerColumns).toContain('order_date');
    expect(headerColumns).toContain('delivered_date');
    expect(headerColumns).toContain('powertrain');

    const dataLines = lines.slice(1);
    expect(dataLines.length).toBeGreaterThan(0);

    for (const line of dataLines) {
      const columns = line.split(',');
      const orderDateVal = columns[2];
      const deliveredDateVal = columns[3];
      const modelVal = columns[5];
      const powertrainVal = columns[7];
      const provinceVal = columns[8];
      const statusVal = columns[10];

      expect(orderDateVal).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(deliveredDateVal).toBe('');
      expect(modelVal).toBe('RAV4');
      expect(powertrainVal).toContain('PHEV');
      expect(provinceVal).toBe('BC');
      expect(statusVal).toBe('pending');
    }
  });

  it('returns 400 Bad Request for unsupported export format', async () => {
    const request = new NextRequest('http://localhost:3000/api/export?format=json');
    const response = await GET(request);

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('INVALID_EXPORT_PARAMS');
  });
});
