import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/export/route';

describe('GET /api/export', () => {
  it('returns 200 OK with formatted CSV data and UTF-8 BOM', async () => {
    const request = new NextRequest('http://localhost:3000/api/export?format=csv');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/csv');
    expect(response.headers.get('Content-Disposition')).toContain('attachment');
    expect(response.headers.get('Cache-Control')).toContain('public');

    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    // Verify UTF-8 BOM bytes (0xEF, 0xBB, 0xBF)
    expect(bytes[0]).toBe(0xef);
    expect(bytes[1]).toBe(0xbb);
    expect(bytes[2]).toBe(0xbf);

    const csvText = new TextDecoder('utf-8').decode(bytes.slice(3));

    // Verify CSV Header line
    expect(csvText).toContain(
      'model,powertrain,trim,model_year,province,dealership_city,order_date,delivery_date,wait_days,status,pricing,addons_cad,submitted_at'
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
      // Row format: model,powertrain,trim,model_year,province,dealership_city,order_date,delivery_date,wait_days,status,...
      const columns = line.split(',');
      const powertrainVal = columns[1];
      const statusVal = columns[9];

      expect(statusVal).toBe('pending');
      expect(powertrainVal.toLowerCase()).toMatch(/phev|plug-in/);
      expect(powertrainVal.toLowerCase()).not.toBe('hybrid (hev)');
      expect(powertrainVal.toLowerCase()).not.toBe('hev');
    }
  });

  it('filters by model, powertrain, status, and province correctly', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/export?format=csv&model=RAV4&powertrain=phev&status=pending&province=BC'
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    const csvText = await response.text();
    const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    const dataLines = lines.slice(1);
    expect(dataLines.length).toBeGreaterThan(0);

    for (const line of dataLines) {
      const columns = line.split(',');
      const modelVal = columns[0];
      const powertrainVal = columns[1];
      const provinceVal = columns[4];
      const statusVal = columns[9];

      expect(modelVal).toBe('RAV4');
      expect(powertrainVal.toLowerCase()).toMatch(/phev|plug-in/);
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
