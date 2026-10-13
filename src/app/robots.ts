import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/out/',
    },
    sitemap: 'https://www.toyotawaits.ca/sitemap.xml',
  };
}
