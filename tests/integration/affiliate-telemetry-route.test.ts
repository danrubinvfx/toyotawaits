import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/telemetry/affiliate-click/route';
import { createServerClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(),
}));

describe('POST /api/telemetry/affiliate-click', () => {
  let mockInsert: ReturnType<typeof vi.fn>;
  let mockFrom: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: { id: 'telemetry-click-uuid-123' },
          error: null,
        }),
      }),
    });

    mockFrom = vi.fn().mockReturnValue({
      insert: mockInsert,
    });

    vi.mocked(createServerClient).mockReturnValue({
      from: mockFrom,
    } as any);
  });

  it('rejects requests with missing accessory_id', async () => {
    const req = new NextRequest('http://localhost:3000/api/telemetry/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placement: 'inventory_feed',
        target_url: 'https://amazon.ca/toyota',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('accessory_id');
  });

  it('rejects requests with invalid placement', async () => {
    const req = new NextRequest('http://localhost:3000/api/telemetry/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessory_id: 'floor-mats',
        placement: 'unknown_location',
        target_url: 'https://amazon.ca/toyota',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('placement');
  });

  it('rejects requests with missing target_url', async () => {
    const req = new NextRequest('http://localhost:3000/api/telemetry/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessory_id: 'floor-mats',
        placement: 'inventory_feed',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain('target_url');
  });

  it('successfully records affiliate click event from inventory_feed', async () => {
    const payload = {
      accessory_id: 'all-weather-floor-liners',
      placement: 'inventory_feed',
      model_context: 'RAV4 Hybrid',
      target_url: 'https://www.amazon.ca/s?k=Toyota+floor+mats&tag=toyotawaits-20',
    };

    const req = new NextRequest('http://localhost:3000/api/telemetry/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.id).toBe('telemetry-click-uuid-123');

    expect(mockFrom).toHaveBeenCalledWith('telemetry_affiliate_clicks');
    expect(mockInsert).toHaveBeenCalledWith({
      accessory_id: 'all-weather-floor-liners',
      placement: 'inventory_feed',
      model_context: 'RAV4 Hybrid',
      target_url: 'https://www.amazon.ca/s?k=Toyota+floor+mats&tag=toyotawaits-20',
    });
  });

  it('parses beacon plain-text payloads correctly', async () => {
    const payload = {
      accessory_id: '4k-front-rear-dash-cam',
      placement: 'submission_modal',
      model_context: 'Sienna',
      target_url: 'https://www.amazon.ca/s?k=dashcam&tag=toyotawaits-20',
    };

    const req = new NextRequest('http://localhost:3000/api/telemetry/affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
