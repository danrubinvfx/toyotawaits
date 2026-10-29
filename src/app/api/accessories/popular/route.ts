import { NextResponse } from 'next/server';
import { getPopularAccessoryWeightsWithSource } from '@/lib/data/accessories-popularity';

export const revalidate = 3600; // Cache popularity counts for 1 hour

export async function GET() {
  const { counts, source } = await getPopularAccessoryWeightsWithSource();
  return NextResponse.json({
    success: true,
    counts,
    cachedAt: new Date().toISOString(),
    source,
  });
}
