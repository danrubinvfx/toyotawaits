import type { MetadataRoute } from 'next';
import { getRequestMarketMetadata } from '@/lib/seo/host-metadata';

export const dynamic = 'force-dynamic';
export const { instant } = { instant: false };

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { isUS, baseUrl } = await getRequestMarketMetadata();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/internal/',
        '/out/',
        '/edit/',
        '/orders/',
        '/unsubscribe/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    ...(isUS ? { host: 'https://www.toyotawaits.com' } : {}),
  };
}
