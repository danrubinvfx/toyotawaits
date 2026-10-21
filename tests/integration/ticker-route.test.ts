import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/ticker/route';
import * as serverSupabase from '@/lib/supabase/server';

describe('GET /api/ticker Endpoint (4-Stream Interleaved Feed)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    const mockSelect = vi.fn().mockReturnThis();
    const mockOrder = vi.fn().mockReturnThis();
    const mockLimit = vi.fn().mockResolvedValue({
      data: [
        {
          id: 101,
          headline: 'Toyota Canada boosts PHEV allocations for Q4',
          category: 'ALLOCATION_ALERT',
          url: 'https://example.com/live-news',
          created_at: '2026-10-15T10:00:00Z',
        },
      ],
      error: null,
    });

    vi.spyOn(serverSupabase, 'createServerClient').mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'news_wire') {
          return {
            select: mockSelect,
            order: mockOrder,
            limit: mockLimit,
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          or: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        };
      }),
    } as any);
  });

  it('returns 200 OK with all 4 interleaved streams (news, inventory, delivery, gear) and required cache-control headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/ticker');
    const response = await GET(request);

    expect(response.status).toBe(200);

    const cacheControl = response.headers.get('Cache-Control');
    expect(cacheControl).toBe('public, s-maxage=60, stale-while-revalidate=120');

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);

    const types = data.data.map((item: any) => item.type);
    expect(types).toContain('news');
    expect(types).toContain('inventory');
    expect(types).toContain('delivery');
    expect(types).toContain('gear');

    // Verify no two adjacent items have the same type
    for (let i = 1; i < data.data.length; i++) {
      expect(data.data[i].type).not.toBe(data.data[i - 1].type);
    }
  });

  it('respects the limit query parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/ticker?limit=4');
    const response = await GET(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.length).toBeLessThanOrEqual(4);
  });

  it('strictly adheres to Zero-PII across all ticker items', async () => {
    const request = new NextRequest('http://localhost:3000/api/ticker');
    const response = await GET(request);
    const data = await response.json();

    const piiFields = ['name', 'email', 'vin', 'postal_code', 'phone', 'ip', 'edit_token'];
    for (const item of data.data) {
      for (const field of piiFields) {
        expect((item as any)[field]).toBeUndefined();
      }
    }
  });
});
