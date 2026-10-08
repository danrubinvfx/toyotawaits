// ============================================================================
// CANADIAN VEHICLE CATALOG DATA
// Canonical models, powertrains, and trims with UUIDs matching DB seed data.
// ============================================================================

export interface CatalogTrim {
  id: string;
  slug: string;
  name: string;
  msrpCad: number;
}

export interface CatalogPowertrain {
  id: string;
  slug: string;
  name: string;
  trims: CatalogTrim[];
}

export interface CatalogModel {
  id: string;
  slug: string;
  name: string;
  generationStartYear: number;
  powertrains: CatalogPowertrain[];
}

export const CANADIAN_VEHICLE_CATALOG: CatalogModel[] = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    slug: 'rav4',
    name: 'RAV4',
    generationStartYear: 2019,
    powertrains: [
      {
        id: '20000000-0000-4000-8000-000000000001',
        slug: 'hev',
        name: 'Hybrid (HEV)',
        trims: [
          { id: '30000000-0000-4000-8000-000000000001', slug: 'le-awd', name: 'LE AWD', msrpCad: 37500 },
          { id: '30000000-0000-4000-8000-000000000002', slug: 'xle-awd', name: 'XLE AWD', msrpCad: 41300 },
          { id: '30000000-0000-4000-8000-000000000003', slug: 'woodland-awd', name: 'Woodland Edition AWD', msrpCad: 47000 },
          { id: '30000000-0000-4000-8000-000000000004', slug: 'se-awd', name: 'SE AWD', msrpCad: 43500 },
          { id: '30000000-0000-4000-8000-000000000005', slug: 'xse-awd', name: 'XSE AWD', msrpCad: 50900 },
          { id: '30000000-0000-4000-8000-000000000006', slug: 'limited-awd', name: 'Limited AWD', msrpCad: 52000 },
        ],
      },
      {
        id: '20000000-0000-4000-8000-000000000002',
        slug: 'phev',
        name: 'Plug-in Hybrid (PHEV)',
        trims: [
          { id: '30000000-0000-4000-8000-000000000010', slug: 'se-awd', name: 'SE AWD', msrpCad: 48750 },
          { id: '30000000-0000-4000-8000-000000000011', slug: 'xse-awd', name: 'XSE AWD', msrpCad: 56400 },
          { id: '30000000-0000-4000-8000-000000000012', slug: 'xse-technology-awd', name: 'XSE AWD Technology Package', msrpCad: 59350 },
          { id: '30000000-0000-4000-8000-000000000013', slug: 'gr-sport-awd', name: 'GR SPORT AWD', msrpCad: 57500 },
        ],
      },
      {
        id: '20000000-0000-4000-8000-000000000003',
        slug: 'gas',
        name: 'Gasoline',
        trims: [
          { id: '30000000-0000-4000-8000-000000000021', slug: 'le-awd', name: 'LE AWD', msrpCad: 35650 },
          { id: '30000000-0000-4000-8000-000000000022', slug: 'xle-awd', name: 'XLE AWD', msrpCad: 38550 },
          { id: '30000000-0000-4000-8000-000000000023', slug: 'trail-awd', name: 'Trail AWD', msrpCad: 42450 },
          { id: '30000000-0000-4000-8000-000000000024', slug: 'limited-awd', name: 'Limited AWD', msrpCad: 46050 },
        ],
      },
    ],
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    slug: 'sienna',
    name: 'Sienna',
    generationStartYear: 2021,
    powertrains: [
      {
        id: '20000000-0000-4000-8000-000000000030',
        slug: 'hev',
        name: 'Hybrid (HEV)',
        trims: [
          { id: '30000000-0000-4000-8000-000000000031', slug: 'le-fwd', name: 'LE FWD (8-Passenger)', msrpCad: 49370 },
          { id: '30000000-0000-4000-8000-000000000032', slug: 'le-awd', name: 'LE AWD (8-Passenger)', msrpCad: 51370 },
          { id: '30000000-0000-4000-8000-000000000033', slug: 'xle-fwd', name: 'XLE FWD (8-Passenger)', msrpCad: 52850 },
          { id: '30000000-0000-4000-8000-000000000034', slug: 'xse-fwd', name: 'XSE FWD (7-Passenger)', msrpCad: 54950 },
          { id: '30000000-0000-4000-8000-000000000035', slug: 'xse-awd', name: 'XSE AWD (7-Passenger)', msrpCad: 56950 },
          { id: '30000000-0000-4000-8000-000000000036', slug: 'xse-technology-awd', name: 'XSE Technology Package AWD', msrpCad: 62450 },
          { id: '30000000-0000-4000-8000-000000000037', slug: 'limited-awd', name: 'Limited AWD (7-Passenger)', msrpCad: 67550 },
          { id: '30000000-0000-4000-8000-000000000038', slug: 'platinum-awd', name: 'Platinum AWD (7-Passenger)', msrpCad: 70850 },
        ],
      },
    ],
  },
  {
    id: '10000000-0000-4000-8000-000000000003',
    slug: 'grand-highlander',
    name: 'Grand Highlander',
    generationStartYear: 2024,
    powertrains: [
      {
        id: '20000000-0000-4000-8000-000000000040',
        slug: 'hev',
        name: 'Hybrid (HEV)',
        trims: [
          { id: '30000000-0000-4000-8000-000000000041', slug: 'xle-hybrid-awd', name: 'XLE Hybrid AWD', msrpCad: 54935 },
          { id: '30000000-0000-4000-8000-000000000042', slug: 'limited-hybrid-awd', name: 'Limited Hybrid AWD', msrpCad: 62270 },
        ],
      },
      {
        id: '20000000-0000-4000-8000-000000000043',
        slug: 'hybrid-max',
        name: 'Hybrid MAX',
        trims: [
          { id: '30000000-0000-4000-8000-000000000045', slug: 'platinum-max-awd', name: 'Platinum Hybrid MAX AWD', msrpCad: 66530 },
        ],
      },
      {
        id: '20000000-0000-4000-8000-000000000046',
        slug: 'gas',
        name: 'Gasoline Turbo',
        trims: [
          { id: '30000000-0000-4000-8000-000000000047', slug: 'xle-awd', name: 'XLE AWD', msrpCad: 51635 },
          { id: '30000000-0000-4000-8000-000000000048', slug: 'limited-awd', name: 'Limited AWD', msrpCad: 58770 },
        ],
      },
    ],
  },
  {
    id: '10000000-0000-4000-8000-000000000004',
    slug: 'land-cruiser',
    name: 'Land Cruiser',
    generationStartYear: 2024,
    powertrains: [
      {
        id: '20000000-0000-4000-8000-000000000050',
        slug: 'hev',
        name: 'i-FORCE MAX Hybrid',
        trims: [
          { id: '30000000-0000-4000-8000-000000000051', slug: '1958-grade', name: '1958 Grade', msrpCad: 71055 },
          { id: '30000000-0000-4000-8000-000000000052', slug: 'land-cruiser-grade', name: 'Land Cruiser Grade', msrpCad: 79825 },
          { id: '30000000-0000-4000-8000-000000000053', slug: 'land-cruiser-premium', name: 'Land Cruiser Grade with Premium Package', msrpCad: 86042 },
        ],
      },
    ],
  },
];

export const CANADIAN_PROVINCES_LIST = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' },
] as const;

export function getModelBySlug(slug: string): CatalogModel | undefined {
  return CANADIAN_VEHICLE_CATALOG.find(
    (m) => m.slug.toLowerCase() === slug.toLowerCase()
  );
}

export function getPowertrainBySlug(
  modelSlug: string,
  powertrainSlug: string
): CatalogPowertrain | undefined {
  const model = getModelBySlug(modelSlug);
  if (!model) return undefined;
  return model.powertrains.find(
    (p) => p.slug.toLowerCase() === powertrainSlug.toLowerCase()
  );
}

export function getProvinceByCode(code: string): { code: string; name: string } | undefined {
  return CANADIAN_PROVINCES_LIST.find(
    (p) => p.code.toLowerCase() === code.toLowerCase()
  );
}

export function isRebateEligibleProvince(code: string): boolean {
  const upper = code.toUpperCase();
  // BC, QC, MB, NB, NS, PE, NL have active provincial or territorial EV/PHEV incentives
  return ['BC', 'QC', 'MB', 'NB', 'NS', 'PE', 'NL'].includes(upper);
}

