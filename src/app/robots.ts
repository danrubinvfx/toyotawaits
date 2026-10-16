import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
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
    sitemap: 'https://toyotawaits.ca/sitemap.xml',
  };
}

