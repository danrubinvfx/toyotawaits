import type { MetadataRoute } from 'next';
import { createServerClient, isLiveSupabaseConfigured } from '@/lib/supabase/server';
import {
  CANADIAN_VEHICLE_CATALOG,
  CANADIAN_PROVINCES_LIST,
} from '@/lib/data/vehicles';
import { getAllModelConfigs } from '@/lib/data/model-registry';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.toyotawaits.ca';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/inventory`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/estimates`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calculator`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/winter-prep`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tires`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/delivery-prep`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/rav4-se-mods`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/prius-mods`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/sienna-mods`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/toyota-sienna-trailer-hitch-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/grand-highlander-mods`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/land-cruiser-mods`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/winter-tires`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/guides/ev-charging`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/guides/insurance`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Seed baseline map of model -> powertrains and provinces from local catalog constants
  const modelPowertrainsMap = new Map<string, Set<string>>();
  for (const model of CANADIAN_VEHICLE_CATALOG) {
    const slug = model.slug.toLowerCase();
    if (!modelPowertrainsMap.has(slug)) {
      modelPowertrainsMap.set(slug, new Set());
    }
    const ptSet = modelPowertrainsMap.get(slug)!;
    for (const pt of model.powertrains) {
      ptSet.add(pt.slug.toLowerCase());
    }
  }

  for (const config of getAllModelConfigs()) {
    if (!modelPowertrainsMap.has(config.slug)) {
      modelPowertrainsMap.set(config.slug, new Set(['hev']));
    }
  }

  const provinceSlugsSet = new Set<string>(
    CANADIAN_PROVINCES_LIST.map((prov) => prov.code.toLowerCase())
  );

  // Query Supabase for distinct models, powertrains, and submitted provinces
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = createServerClient();
      const [modelsResult, submissionsResult] = await Promise.all([
        supabase
          .from('vehicle_models')
          .select('slug, vehicle_powertrains(slug)')
          .eq('is_active', true),
        supabase
          .from('submissions')
          .select('province')
          .not('province', 'is', null),
      ]);

      if (!modelsResult.error && Array.isArray(modelsResult.data)) {
        for (const row of modelsResult.data) {
          if (!row?.slug) continue;
          const modelSlug = String(row.slug).toLowerCase();
          if (!modelPowertrainsMap.has(modelSlug)) {
            modelPowertrainsMap.set(modelSlug, new Set());
          }
          const ptSet = modelPowertrainsMap.get(modelSlug)!;
          const powertrains = Array.isArray(row.vehicle_powertrains)
            ? row.vehicle_powertrains
            : [];
          for (const pt of powertrains) {
            if (pt?.slug) {
              ptSet.add(String(pt.slug).toLowerCase());
            }
          }
        }
      }

      if (!submissionsResult.error && Array.isArray(submissionsResult.data)) {
        for (const row of submissionsResult.data) {
          if (row?.province) {
            provinceSlugsSet.add(String(row.province).toLowerCase());
          }
        }
      }
    } catch {
      // Fail gracefully and rely on static routes + baseline catalog
    }
  }

  const dynamicRoutes: MetadataRoute.Sitemap = [];
  const distinctProvinceSlugs = Array.from(provinceSlugsSet);

  for (const [modelSlug, powertrains] of modelPowertrainsMap.entries()) {
    dynamicRoutes.push({
      url: `${baseUrl}/${modelSlug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });

    dynamicRoutes.push({
      url: `${baseUrl}/wait-times/${modelSlug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    });

    for (const powertrainSlug of powertrains) {
      dynamicRoutes.push({
        url: `${baseUrl}/${modelSlug}/${powertrainSlug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
      });

      for (const provinceSlug of distinctProvinceSlugs) {
        dynamicRoutes.push({
          url: `${baseUrl}/${modelSlug}/${powertrainSlug}/${provinceSlug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  }

  return [...staticRoutes, ...dynamicRoutes];
}


