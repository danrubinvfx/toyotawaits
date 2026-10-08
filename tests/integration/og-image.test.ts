// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/og/route';

describe('GET /api/og', () => {
  it('generates a 200 OK PNG image for RAV4 Prime BC', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/og?model=rav4&powertrain=phev&province=BC'
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    const contentType = response.headers.get('content-type');
    expect(contentType).toContain('image/png');

    const arrayBuffer = await response.arrayBuffer();
    expect(arrayBuffer.byteLength).toBeGreaterThan(0);
  });

  it('generates a 200 OK PNG image with fallback parameters when none are specified', async () => {
    const request = new NextRequest('http://localhost:3000/api/og');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('image/png');
  });

  it('handles Sienna and Grand Highlander requests without error', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/og?model=sienna&powertrain=hev&province=ON'
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('image/png');
  });
});
