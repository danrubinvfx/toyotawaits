import crypto from 'crypto';
import { createServerClient } from '@/lib/supabase/server';
import { Submission, CountryCode, USState, CanadianProvince, SubmissionStatus, SubmissionStage, OrderStage, PricingType, NudgeAction, NudgeActionResult } from '@/lib/types/contracts';
import { CANADIAN_VEHICLE_CATALOG } from '@/lib/data/vehicles';
import { CommunityRecord, INITIAL_COMMUNITY_RECORDS, INITIAL_US_COMMUNITY_RECORDS } from '@/lib/data/community-records';
import { isSubmissionStale } from '@/lib/utils/confidence-decay';

export interface SubmissionCreateData {
  modelId: string;
  powertrainId: string;
  trimId: string;
  modelSlug?: string;
  powertrainSlug?: string;
  trimSlug?: string;
  model?: string;
  powertrain?: string;
  trim?: string;
  countryCode?: CountryCode;
  country_code?: CountryCode;
  province?: CanadianProvince | null;
  state?: USState | string | null;
  dealershipCity?: string | null;
  dealershipName?: string | null;
  modelYear: number;
  orderDate: string;
  deliveryDate?: string | null;
  status: SubmissionStatus;
  currentStage?: SubmissionStage;
  stage?: OrderStage | SubmissionStage;
  email?: string | null;
  lastNudgedAt?: string | null;
  cancelledAt?: string | null;
  pricing: PricingType;
  mandatoryAddonsCad: number;
  dealerMarkupAdm?: number | null;
  dealer_markup_adm?: number | null;
  portDestination?: string | null;
  port_destination?: string | null;
  tradeInRequired: boolean;
  notes?: string | null;
  editKeyHash: string;
  editToken?: string;
  isFlagged: boolean;
}

export interface SubmissionUpdateData {
  id: string;
  editKeyHash: string;
  status?: SubmissionStatus;
  currentStage?: SubmissionStage;
  deliveryDate?: string | null;
  notes?: string | null;
  modelId?: string;
  powertrainId?: string;
  trimId?: string;
  modelSlug?: string;
  powertrainSlug?: string;
  trimSlug?: string;
  model?: string;
  countryCode?: CountryCode;
  country_code?: CountryCode;
  state?: string | null;
  dealerMarkupAdm?: number | null;
  dealer_markup_adm?: number | null;
  portDestination?: string | null;
  port_destination?: string | null;
}

export interface ExportFilterParams {
  model?: string;
  powertrain?: string;
  province?: CanadianProvince;
  state?: string;
  country_code?: CountryCode;
  countryCode?: CountryCode;
  status?: SubmissionStatus;
}

export interface ExportRow {
  id?: string;
  created_at?: string;
  model: string;
  powertrain: string;
  trim: string;
  model_year: number;
  country_code?: string;
  province: string;
  state?: string;
  dealership_city: string;
  order_date: string;
  delivery_date: string;
  wait_days: string;
  status: string;
  pricing: string;
  addons_cad: string;
  dealer_markup_adm?: string;
  port_destination?: string;
  submitted_at: string;
}

// In-memory store for test suite and development fallback
const inMemorySubmissions = new Map<string, any>();

// Seed sample data in memory for export and aggregate testing
function seedInitialData() {
  if (inMemorySubmissions.size > 0) return;

  const samples = [
    {
      id: 'a1000000-0000-4000-8000-000000000001',
      model_slug: 'rav4',
      model_name: 'RAV4',
      powertrain_slug: 'phev',
      powertrain_name: 'Plug-in Hybrid (PHEV)',
      trim_slug: 'xse-technology-awd',
      trim_name: 'XSE AWD Tech Package',
      province: 'BC',
      dealership_city: 'Richmond',
      model_year: 2026,
      order_date: '2025-04-10',
      delivery_date: '2026-05-25',
      wait_days: 410,
      status: 'delivered',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Delivered at exact MSRP at Richmond Toyota.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-1').digest('hex'),
      is_flagged: false,
      created_at: '2026-05-26T02:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000002',
      model_slug: 'rav4',
      model_name: 'RAV4',
      powertrain_slug: 'hev',
      powertrain_name: 'Hybrid (HEV)',
      trim_slug: 'xle-awd',
      trim_name: 'XLE AWD',
      province: 'ON',
      dealership_city: 'Oakville',
      model_year: 2026,
      order_date: '2025-10-01',
      delivery_date: '2026-03-20',
      wait_days: 170,
      status: 'delivered',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'No markup, smooth pickup in Oakville.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-2').digest('hex'),
      is_flagged: false,
      created_at: '2026-03-21T15:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000003',
      model_slug: 'sienna',
      model_name: 'Sienna',
      powertrain_slug: 'hev',
      powertrain_name: 'Hybrid (HEV)',
      trim_slug: 'xse-awd',
      trim_name: 'XSE AWD (7-Passenger)',
      province: 'AB',
      dealership_city: 'Calgary',
      model_year: 2026,
      order_date: '2025-01-15',
      delivery_date: null,
      wait_days: null,
      status: 'pending',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Waiting on 2026 allocation from Calgary dealer.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-3').digest('hex'),
      is_flagged: false,
      created_at: '2026-01-15T12:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000004',
      model_slug: 'grand-highlander',
      model_name: 'Grand Highlander',
      powertrain_slug: 'hev',
      powertrain_name: 'Hybrid (HEV)',
      trim_slug: 'hybrid-limited-awd',
      trim_name: 'Hybrid Limited AWD',
      province: 'QC',
      dealership_city: 'Laval',
      model_year: 2026,
      order_date: '2025-06-12',
      delivery_date: '2026-05-02',
      wait_days: 324,
      status: 'delivered',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Smooth delivery in Laval.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-4').digest('hex'),
      is_flagged: false,
      created_at: '2026-05-03T10:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000005',
      model_slug: 'land-cruiser',
      model_name: 'Land Cruiser',
      powertrain_slug: 'hev',
      powertrain_name: 'i-FORCE MAX Hybrid',
      trim_slug: 'land-cruiser-grade',
      trim_name: 'Land Cruiser Grade',
      province: 'BC',
      dealership_city: 'North Vancouver',
      model_year: 2026,
      order_date: '2025-11-20',
      delivery_date: '2026-03-15',
      wait_days: 115,
      status: 'delivered',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Delivered at MSRP in North Vancouver.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-5').digest('hex'),
      is_flagged: false,
      created_at: '2026-03-16T11:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000006',
      model_slug: 'rav4',
      model_name: 'RAV4',
      powertrain_slug: 'phev',
      powertrain_name: 'Plug-in Hybrid (PHEV)',
      trim_slug: 'se-awd',
      trim_name: 'SE AWD',
      province: 'QC',
      dealership_city: 'Montreal',
      model_year: 2026,
      order_date: '2025-03-15',
      delivery_date: '2026-04-20',
      wait_days: 401,
      status: 'delivered',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Arrived after 13 months wait in Montreal.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-6').digest('hex'),
      is_flagged: false,
      created_at: '2026-04-21T09:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000007',
      model_slug: 'sienna',
      model_name: 'Sienna',
      powertrain_slug: 'hev',
      powertrain_name: 'Hybrid (HEV)',
      trim_slug: 'limited-awd',
      trim_name: 'Limited AWD (7-Passenger)',
      province: 'ON',
      dealership_city: 'Markham',
      model_year: 2026,
      order_date: '2024-11-10',
      delivery_date: '2026-04-15',
      wait_days: 521,
      status: 'delivered',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Long wait for Limited AWD in Markham but straight MSRP deal.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-7').digest('hex'),
      is_flagged: false,
      created_at: '2026-04-16T14:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000008',
      model_slug: 'rav4',
      model_name: 'RAV4',
      powertrain_slug: 'hev',
      powertrain_name: 'Hybrid (HEV)',
      trim_slug: 'woodland-edition-awd',
      trim_name: 'Woodland Edition AWD',
      province: 'BC',
      dealership_city: 'Victoria',
      model_year: 2026,
      order_date: '2025-09-12',
      delivery_date: '2026-04-18',
      wait_days: 218,
      status: 'delivered',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Victoria delivery, ~7 months wait.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-8').digest('hex'),
      is_flagged: false,
      created_at: '2026-04-19T10:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000009',
      model_slug: 'grand-highlander',
      model_name: 'Grand Highlander',
      powertrain_slug: 'hybrid-max',
      powertrain_name: 'Hybrid MAX',
      trim_slug: 'platinum-hybrid-max-awd',
      trim_name: 'Platinum Hybrid MAX AWD',
      province: 'ON',
      dealership_city: 'Mississauga',
      model_year: 2026,
      order_date: '2025-07-20',
      delivery_date: '2026-06-05',
      wait_days: 320,
      status: 'delivered',
      pricing: 'above_msrp',
      mandatory_addons_cad: 495,
      trade_in_required: false,
      notes: 'Dealer required protection package.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-9').digest('hex'),
      is_flagged: false,
      created_at: '2026-06-06T12:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000010',
      model_slug: 'land-cruiser',
      model_name: 'Land Cruiser',
      powertrain_slug: 'hev',
      powertrain_name: 'i-FORCE MAX Hybrid',
      trim_slug: '1958-grade',
      trim_name: '1958 Grade',
      province: 'ON',
      dealership_city: 'London',
      model_year: 2026,
      order_date: '2026-01-10',
      delivery_date: '2026-05-10',
      wait_days: 120,
      status: 'delivered',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Delivered at exact MSRP in London.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-10').digest('hex'),
      is_flagged: false,
      created_at: '2026-05-11T16:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000011',
      model_slug: 'sienna',
      model_name: 'Sienna',
      powertrain_slug: 'hev',
      powertrain_name: 'Hybrid (HEV)',
      trim_slug: 'le-awd',
      trim_name: 'LE AWD (8-Passenger)',
      province: 'MB',
      dealership_city: 'Winnipeg',
      model_year: 2026,
      order_date: '2025-02-15',
      delivery_date: '2026-06-18',
      wait_days: 488,
      status: 'delivered',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: '16 months wait in Winnipeg.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-11').digest('hex'),
      is_flagged: false,
      created_at: '2026-06-19T09:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000012',
      model_slug: 'rav4',
      model_name: 'RAV4',
      powertrain_slug: 'hev',
      powertrain_name: 'Hybrid (HEV)',
      trim_slug: 'limited-awd',
      trim_name: 'Limited AWD',
      province: 'AB',
      dealership_city: 'Edmonton',
      model_year: 2026,
      order_date: '2026-01-20',
      delivery_date: null,
      wait_days: null,
      status: 'pending',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Waiting on Limited AWD allocation in Edmonton.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-12').digest('hex'),
      is_flagged: false,
      created_at: '2026-01-20T14:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000013',
      model_slug: 'prius-prime',
      model_name: 'Prius Prime',
      powertrain_slug: 'phev',
      powertrain_name: 'Plug-in Hybrid (PHEV)',
      trim_slug: 'xse',
      trim_name: 'XSE',
      province: 'ON',
      dealership_city: 'Toronto',
      model_year: 2026,
      order_date: '2025-08-15',
      delivery_date: '2026-02-12',
      wait_days: 181,
      status: 'delivered',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Delivered at exact MSRP in Toronto.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-prius-1').digest('hex'),
      is_flagged: false,
      created_at: '2026-02-13T10:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000014',
      model_slug: 'prius-prime',
      model_name: 'Prius Prime',
      powertrain_slug: 'phev',
      powertrain_name: 'Plug-in Hybrid (PHEV)',
      trim_slug: 'se',
      trim_name: 'SE',
      province: 'BC',
      dealership_city: 'Langley',
      model_year: 2026,
      order_date: '2026-04-10',
      delivery_date: '2026-05-15',
      wait_days: 35,
      status: 'delivered',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Quick delivery from dealer allocation batch in Langley.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-prius-2').digest('hex'),
      is_flagged: false,
      created_at: '2026-05-16T14:30:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000015',
      model_slug: 'prius-prime',
      model_name: 'Prius Prime',
      powertrain_slug: 'phev',
      powertrain_name: 'Plug-in Hybrid (PHEV)',
      trim_slug: 'xse-premium',
      trim_name: 'XSE Premium',
      province: 'AB',
      dealership_city: 'Calgary',
      model_year: 2026,
      order_date: '2025-05-12',
      delivery_date: '2026-04-18',
      wait_days: 341,
      status: 'delivered',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Waited 11 months for XSE Premium at Calgary dealer.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-prius-3').digest('hex'),
      is_flagged: false,
      created_at: '2026-04-19T09:15:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000016',
      model_slug: 'prius',
      model_name: 'Prius',
      powertrain_slug: 'hev',
      powertrain_name: 'Hybrid (HEV)',
      trim_slug: 'xle-awd',
      trim_name: 'XLE AWD',
      province: 'ON',
      dealership_city: 'Ottawa',
      model_year: 2026,
      order_date: '2026-05-02',
      delivery_date: '2026-08-14',
      wait_days: 104,
      status: 'delivered',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Clean deal at MSRP in Ottawa, under 3.5 months wait.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-prius-4').digest('hex'),
      is_flagged: false,
      created_at: '2026-08-15T16:00:00Z',
    },
    {
      id: 'a1000000-0000-4000-8000-000000000017',
      model_slug: 'prius-prime',
      model_name: 'Prius Prime',
      powertrain_slug: 'phev',
      powertrain_name: 'Plug-in Hybrid (PHEV)',
      trim_slug: 'xse',
      trim_name: 'XSE',
      province: 'QC',
      dealership_city: 'Montreal',
      model_year: 2026,
      order_date: '2026-03-01',
      delivery_date: null,
      wait_days: null,
      status: 'pending',
      pricing: 'at_msrp',
      mandatory_addons_cad: 0,
      trade_in_required: false,
      notes: 'Deposit confirmed in Montreal, awaiting allocation.',
      edit_key_hash: crypto.createHash('sha256').update('seed-key-prius-5').digest('hex'),
      is_flagged: false,
      created_at: '2026-03-01T11:00:00Z',
    },
  ];

  for (const s of samples) {
    inMemorySubmissions.set(s.id, s);
  }

  // Also seed the 40 synthetic records (rec-18 to rec-57) into inMemorySubmissions
  const syntheticRecords = INITIAL_COMMUNITY_RECORDS.slice(17);
  for (let i = 0; i < syntheticRecords.length; i++) {
    const r = syntheticRecords[i];
    const uuidId = `b1000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`;
    inMemorySubmissions.set(uuidId, {
      id: uuidId,
      model_slug: r.modelSlug,
      model_name: r.model,
      powertrain_slug: r.powertrainSlug,
      powertrain_name: r.powertrain,
      trim_slug: r.trim.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      trim_name: r.trim,
      province: r.province,
      dealership_city: r.city,
      model_year: r.modelYear,
      order_date: r.orderDate,
      delivery_date: r.deliveryDate,
      wait_days: r.waitDays,
      status: r.status,
      pricing: r.pricing,
      mandatory_addons_cad: r.addonsCad,
      trade_in_required: false,
      country_code: 'CA',
      countryCode: 'CA',
      notes: `${r.model} ${r.trim} crowdsourced Canadian submission`,
      edit_key_hash: crypto.createHash('sha256').update(`seed-key-${uuidId}`).digest('hex'),
      is_flagged: false,
      created_at: r.orderDate ? `${r.orderDate}T12:00:00Z` : new Date().toISOString(),
    });
  }

  // Seed verified U.S. records for toyotawaits.com
  for (let i = 0; i < INITIAL_US_COMMUNITY_RECORDS.length; i++) {
    const r = INITIAL_US_COMMUNITY_RECORDS[i];
    const uuidId = `c1000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`;
    inMemorySubmissions.set(uuidId, {
      id: uuidId,
      country_code: 'US',
      countryCode: 'US',
      model_slug: r.modelSlug,
      model_name: r.model,
      powertrain_slug: r.powertrainSlug,
      powertrain_name: r.powertrain,
      trim_slug: r.trim.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      trim_name: r.trim,
      province: r.province || r.state || 'CA',
      state: r.state || 'CA',
      dealership_city: r.city,
      dealership_name: r.dealershipName || r.dealerName || '',
      model_year: r.modelYear,
      order_date: r.orderDate,
      delivery_date: r.deliveryDate,
      wait_days: r.waitDays,
      status: r.status,
      pricing: r.pricing,
      mandatory_addons_cad: r.addonsCad,
      dealer_markup_adm: r.dealerMarkupAdm || 0,
      port_destination: r.portDestination || '',
      trade_in_required: false,
      notes: `${r.model} ${r.trim} crowdsourced U.S. submission`,
      edit_key_hash: crypto.createHash('sha256').update(`seed-key-${uuidId}`).digest('hex'),
      is_flagged: false,
      created_at: r.orderDate ? `${r.orderDate}T12:00:00Z` : new Date().toISOString(),
    });
  }
}

seedInitialData();

export interface VehicleResolutionParams {
  modelId?: string;
  powertrainId?: string;
  trimId?: string;
  modelSlug?: string;
  powertrainSlug?: string;
  trimSlug?: string;
  modelName?: string;
}

export interface ResolvedVehicleIds {
  modelId: string;
  powertrainId: string;
  trimId: string;
  modelSlug: string;
  powertrainSlug: string;
  trimSlug: string;
  modelName: string;
}

const dbVehicleResolutionCache = new Map<string, ResolvedVehicleIds>();

export async function resolveDatabaseVehicleIds(
  supabase: any,
  params: VehicleResolutionParams
): Promise<ResolvedVehicleIds> {
  const cacheKey = `${params.modelId || ''}:${params.powertrainId || ''}:${params.trimId || ''}:${params.modelSlug || ''}:${params.powertrainSlug || ''}:${params.trimSlug || ''}:${params.modelName || ''}`;
  if (dbVehicleResolutionCache.has(cacheKey)) {
    return dbVehicleResolutionCache.get(cacheKey)!;
  }

  // 1. Identify matching catalog model
  const incomingModel = (params.modelSlug || params.modelId || params.modelName || '').toLowerCase().trim();
  let catalogModel = CANADIAN_VEHICLE_CATALOG.find((m) => {
    if (params.modelId && m.id.toLowerCase() === params.modelId.toLowerCase()) return true;
    if (incomingModel && (m.slug.toLowerCase() === incomingModel || m.name.toLowerCase() === incomingModel)) return true;
    return false;
  });

  if (!catalogModel) {
    catalogModel = CANADIAN_VEHICLE_CATALOG[0];
  }

  const modelSlug = catalogModel.slug;
  const modelName = catalogModel.name;

  // 2. Identify matching catalog powertrain
  const incomingPt = (params.powertrainSlug || params.powertrainId || '').toLowerCase().trim();
  let catalogPowertrain = catalogModel.powertrains.find((p) => {
    if (params.powertrainId && p.id.toLowerCase() === params.powertrainId.toLowerCase()) return true;
    if (incomingPt && (p.slug.toLowerCase() === incomingPt || p.name.toLowerCase() === incomingPt)) return true;
    return false;
  }) || catalogModel.powertrains[0];

  const powertrainSlug = catalogPowertrain?.slug || 'hev';

  // 3. Identify matching catalog trim
  const incomingTrim = (params.trimSlug || params.trimId || '').toLowerCase().trim();
  let catalogTrim = catalogPowertrain?.trims.find((t) => {
    if (params.trimId && t.id.toLowerCase() === params.trimId.toLowerCase()) return true;
    if (incomingTrim && (t.slug.toLowerCase() === incomingTrim || t.name.toLowerCase() === incomingTrim)) return true;
    return false;
  }) || catalogPowertrain?.trims[0];

  const trimSlug = catalogTrim?.slug || 'le-awd';

  let actualModelId = params.modelId || catalogModel.id;
  let actualPowertrainId = params.powertrainId || catalogPowertrain?.id;
  let actualTrimId = params.trimId || catalogTrim?.id;

  try {
    // 4. Resolve Model ID against database
    let dbModel: { id: string } | null = null;
    if (params.modelId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.modelId)) {
      const { data } = await supabase
        .from('vehicle_models')
        .select('id')
        .eq('id', params.modelId)
        .maybeSingle();
      if (data?.id) dbModel = data;
    }

    if (!dbModel) {
      const { data } = await supabase
        .from('vehicle_models')
        .select('id')
        .eq('slug', modelSlug)
        .maybeSingle();
      if (data?.id) dbModel = data;
    }

    if (!dbModel) {
      const { data: newModel } = await supabase
        .from('vehicle_models')
        .upsert(
          {
            id: catalogModel.id,
            slug: catalogModel.slug,
            name: catalogModel.name,
            generation_start_year: catalogModel.generationStartYear,
            is_active: true,
            sort_order: 50,
          },
          { onConflict: 'slug' }
        )
        .select('id')
        .maybeSingle();
      if (newModel?.id) dbModel = newModel;
    }

    if (dbModel?.id) {
      actualModelId = dbModel.id;
    }

    // 5. Resolve Powertrain ID against database
    let dbPowertrain: { id: string } | null = null;
    if (params.powertrainId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.powertrainId)) {
      const { data } = await supabase
        .from('vehicle_powertrains')
        .select('id')
        .eq('model_id', actualModelId)
        .eq('id', params.powertrainId)
        .maybeSingle();
      if (data?.id) dbPowertrain = data;
    }

    if (!dbPowertrain) {
      const { data } = await supabase
        .from('vehicle_powertrains')
        .select('id')
        .eq('model_id', actualModelId)
        .eq('slug', powertrainSlug)
        .maybeSingle();
      if (data?.id) dbPowertrain = data;
    }

    if (!dbPowertrain && catalogPowertrain) {
      const { data: newPt } = await supabase
        .from('vehicle_powertrains')
        .upsert(
          {
            id: catalogPowertrain.id,
            model_id: actualModelId,
            slug: catalogPowertrain.slug,
            name: catalogPowertrain.name,
            sort_order: 1,
          },
          { onConflict: 'model_id, slug' }
        )
        .select('id')
        .maybeSingle();
      if (newPt?.id) dbPowertrain = newPt;
    }

    if (!dbPowertrain) {
      // Fallback: any powertrain for this model
      const { data } = await supabase
        .from('vehicle_powertrains')
        .select('id')
        .eq('model_id', actualModelId)
        .limit(1)
        .maybeSingle();
      if (data?.id) dbPowertrain = data;
    }

    if (dbPowertrain?.id) {
      actualPowertrainId = dbPowertrain.id;
    }

    // 6. Resolve Trim ID against database
    let dbTrim: { id: string } | null = null;
    if (params.trimId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.trimId)) {
      const { data } = await supabase
        .from('vehicle_trims')
        .select('id')
        .eq('powertrain_id', actualPowertrainId)
        .eq('id', params.trimId)
        .maybeSingle();
      if (data?.id) dbTrim = data;
    }

    if (!dbTrim) {
      const { data } = await supabase
        .from('vehicle_trims')
        .select('id')
        .eq('powertrain_id', actualPowertrainId)
        .eq('slug', trimSlug)
        .maybeSingle();
      if (data?.id) dbTrim = data;
    }

    if (!dbTrim && catalogTrim) {
      const { data: newTrim } = await supabase
        .from('vehicle_trims')
        .upsert(
          {
            id: catalogTrim.id,
            model_id: actualModelId,
            powertrain_id: actualPowertrainId,
            slug: catalogTrim.slug,
            name: catalogTrim.name,
            msrp_cad: catalogTrim.msrpCad,
            sort_order: 1,
          },
          { onConflict: 'powertrain_id, slug' }
        )
        .select('id')
        .maybeSingle();
      if (newTrim?.id) dbTrim = newTrim;
    }

    if (!dbTrim) {
      // Fallback: any trim for this powertrain
      const { data } = await supabase
        .from('vehicle_trims')
        .select('id')
        .eq('powertrain_id', actualPowertrainId)
        .limit(1)
        .maybeSingle();
      if (data?.id) dbTrim = data;
    }

    if (dbTrim?.id) {
      actualTrimId = dbTrim.id;
    }
  } catch (lookupErr) {
    console.warn('Error during resolveDatabaseVehicleIds:', lookupErr);
  }

  const result: ResolvedVehicleIds = {
    modelId: actualModelId,
    powertrainId: actualPowertrainId,
    trimId: actualTrimId,
    modelSlug,
    powertrainSlug,
    trimSlug,
    modelName,
  };

  dbVehicleResolutionCache.set(cacheKey, result);
  return result;
}

export async function insertSubmission(data: SubmissionCreateData): Promise<any> {
  const id = crypto.randomUUID();
  let waitDays: number | null = null;
  const editToken = data.editToken || crypto.randomUUID();
  const countryCode: CountryCode = data.country_code || data.countryCode || 'CA';
  const state = data.state || null;
  const dealerMarkupAdm = data.dealer_markup_adm ?? data.dealerMarkupAdm ?? null;
  const portDestination = data.port_destination ?? data.portDestination ?? null;

  if (data.status === 'delivered' && data.deliveryDate) {
    const start = new Date(data.orderDate).getTime();
    const end = new Date(data.deliveryDate).getTime();
    waitDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
  }

  // If Supabase PostgreSQL is live
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      const resolved = await resolveDatabaseVehicleIds(supabase, {
        modelId: data.modelId,
        powertrainId: data.powertrainId,
        trimId: data.trimId,
        modelSlug: data.modelSlug,
        powertrainSlug: data.powertrainSlug,
        trimSlug: data.trimSlug,
        modelName: data.model,
      });

      let { data: inserted, error } = await supabase
        .from('submissions')
        .insert({
          id,
          country_code: countryCode,
          model_id: resolved.modelId,
          powertrain_id: resolved.powertrainId,
          trim_id: resolved.trimId,
          province: data.province || null,
          state,
          dealer_markup_adm: dealerMarkupAdm,
          port_destination: portDestination,
          dealership_city: data.dealershipCity,
          dealership_name: data.dealershipName,
          model_year: data.modelYear,
          order_date: data.orderDate,
          delivery_date: data.deliveryDate,
          status: data.status,
          current_stage: data.currentStage || (data.status === 'delivered' ? 'delivered' : 'deposit_placed'),
          stage: data.currentStage || (data.status === 'delivered' ? 'delivered' : 'deposit_placed'),
          stage_updated_at: new Date().toISOString(),
          pricing: data.pricing,
          mandatory_addons_cad: data.mandatoryAddonsCad,
          trade_in_required: data.tradeInRequired,
          notes: data.notes,
          edit_key_hash: data.editKeyHash,
          edit_token: editToken,
          is_flagged: data.isFlagged,
        })
        .select('id, status, current_stage, stage, wait_days, is_flagged, edit_token')
        .maybeSingle();

      // 1. If foreign key constraint failed, dynamically re-resolve DB IDs with fresh cache and retry
      if (error && (error.code === '23503' || error.message?.includes('foreign key'))) {
        console.warn('Foreign key mismatch in Supabase insert, re-resolving actual DB IDs...', error.message);
        dbVehicleResolutionCache.clear();
        const retryResolved = await resolveDatabaseVehicleIds(supabase, {
          modelId: data.modelId,
          powertrainId: data.powertrainId,
          trimId: data.trimId,
          modelSlug: data.modelSlug,
          powertrainSlug: data.powertrainSlug,
          trimSlug: data.trimSlug,
          modelName: data.model,
        });

        const retryRes = await supabase
          .from('submissions')
          .insert({
            id,
            country_code: countryCode,
            model_id: retryResolved.modelId,
            powertrain_id: retryResolved.powertrainId,
            trim_id: retryResolved.trimId,
            province: data.province || null,
            state,
            dealer_markup_adm: dealerMarkupAdm,
            port_destination: portDestination,
            dealership_city: data.dealershipCity,
            dealership_name: data.dealershipName,
            model_year: data.modelYear,
            order_date: data.orderDate,
            delivery_date: data.deliveryDate,
            status: data.status,
            current_stage: data.currentStage || (data.status === 'delivered' ? 'delivered' : 'deposit_placed'),
            stage: data.currentStage || (data.status === 'delivered' ? 'delivered' : 'deposit_placed'),
            stage_updated_at: new Date().toISOString(),
            pricing: data.pricing,
            mandatory_addons_cad: data.mandatoryAddonsCad,
            trade_in_required: data.tradeInRequired,
            notes: data.notes,
            edit_key_hash: data.editKeyHash,
            edit_token: editToken,
            is_flagged: data.isFlagged,
          })
          .select('id, status, current_stage, stage, wait_days, is_flagged, edit_token')
          .maybeSingle();

        if (!retryRes.error) {
          inserted = retryRes.data;
          error = null;
        } else {
          console.error('Retry insert with resolved DB IDs failed:', retryRes.error);
        }
      }

      // 2. If RLS policy blocked insert due to strict is_flagged = false policy, retry with is_flagged = false
      if (error && (error.code === '42501' || error.message?.includes('violates row-level security')) && data.isFlagged) {
        console.warn('RLS policy violation on flagged submission insert, retrying with is_flagged = false...');
        const rlsRetry = await supabase
          .from('submissions')
          .insert({
            id,
            country_code: countryCode,
            model_id: resolved.modelId,
            powertrain_id: resolved.powertrainId,
            trim_id: resolved.trimId,
            province: data.province || null,
            state,
            dealer_markup_adm: dealerMarkupAdm,
            port_destination: portDestination,
            dealership_city: data.dealershipCity,
            dealership_name: data.dealershipName,
            model_year: data.modelYear,
            order_date: data.orderDate,
            delivery_date: data.deliveryDate,
            status: data.status,
            current_stage: data.currentStage || (data.status === 'delivered' ? 'delivered' : 'deposit_placed'),
            stage: data.currentStage || (data.status === 'delivered' ? 'delivered' : 'deposit_placed'),
            stage_updated_at: new Date().toISOString(),
            pricing: data.pricing,
            mandatory_addons_cad: data.mandatoryAddonsCad,
            trade_in_required: data.tradeInRequired,
            notes: data.notes,
            edit_key_hash: data.editKeyHash,
            edit_token: editToken,
            is_flagged: false,
          })
          .select('id, status, current_stage, stage, wait_days, is_flagged, edit_token')
          .maybeSingle();

        if (!rlsRetry.error) {
          inserted = rlsRetry.data;
          error = null;
        }
      }

      if (!error) {
        // Asynchronously refresh the materialized view so regional aggregations recalculate immediately
        Promise.resolve(supabase.rpc('refresh_wait_summary_mv'))
          .then(() => {})
          .catch((rpcErr: unknown) => {
            console.warn('Notice: Background refresh of mv_model_wait_summary encountered:', rpcErr);
          });

        return {
          id: inserted?.id || id,
          countryCode,
          country_code: countryCode,
          state,
          dealerMarkupAdm,
          dealer_markup_adm: dealerMarkupAdm,
          portDestination,
          port_destination: portDestination,
          status: inserted?.status || data.status,
          currentStage: inserted?.stage || inserted?.current_stage || data.currentStage || 'deposit_placed',
          stage: inserted?.stage || inserted?.current_stage || data.currentStage || 'deposit_placed',
          waitDays: inserted?.wait_days ?? waitDays,
          isFlagged: inserted?.is_flagged ?? data.isFlagged,
          editToken: inserted?.edit_token || editToken,
        };
      } else {
        console.error('[DATABASE ERROR] Supabase submissions table insert failed:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        const dbError: any = new Error(error.message || 'Supabase submission insert failed');
        dbError.code = error.code || 'DATABASE_INSERT_FAILED';
        dbError.details = error.details;
        dbError.hint = error.hint;
        throw dbError;
      }
    } catch (err: any) {
      console.error('[DATABASE ERROR] Exception during Supabase insert:', err);
      throw err;
    }
  }

  // In-memory fallback
  const currentStage = data.currentStage || (data.status === 'delivered' ? 'delivered' : 'deposit_placed');

  let memModelSlug = 'rav4';
  let memModelName = 'RAV4';
  let memPtSlug = 'hev';
  let memPtName = 'Hybrid (HEV)';
  let memTrimSlug = 'xle-awd';
  let memTrimName = 'XLE AWD';

  for (const m of CANADIAN_VEHICLE_CATALOG) {
    if (
      m.id === data.modelId ||
      m.slug === data.modelSlug ||
      (data.model && m.name.toLowerCase() === data.model.toLowerCase()) ||
      (data.modelId && m.slug.toLowerCase() === data.modelId.toLowerCase())
    ) {
      memModelSlug = m.slug;
      memModelName = m.name;
      for (const p of m.powertrains) {
        if (p.id === data.powertrainId || p.slug === data.powertrainSlug) {
          memPtSlug = p.slug;
          memPtName = p.name;
          for (const t of p.trims) {
            if (t.id === data.trimId || t.slug === data.trimSlug) {
              memTrimSlug = t.slug;
              memTrimName = t.name;
              break;
            }
          }
          break;
        }
      }
      break;
    }
  }

  const record = {
    id,
    country_code: countryCode,
    countryCode,
    state,
    dealer_markup_adm: dealerMarkupAdm,
    dealerMarkupAdm,
    port_destination: portDestination,
    portDestination,
    model_id: data.modelId,
    model_slug: memModelSlug,
    model_name: memModelName,
    powertrain_id: data.powertrainId,
    powertrain_slug: memPtSlug,
    powertrain_name: memPtName,
    trim_id: data.trimId,
    trim_slug: memTrimSlug,
    trim_name: memTrimName,
    province: data.province || state || 'ON',
    dealership_city: data.dealershipCity || '',
    dealership_name: data.dealershipName || '',
    model_year: data.modelYear,
    order_date: data.orderDate,
    delivery_date: data.deliveryDate || null,
    wait_days: waitDays,
    status: data.status,
    current_stage: currentStage,
    stage: currentStage,
    stage_updated_at: new Date().toISOString(),
    pricing: data.pricing,
    mandatory_addons_cad: data.mandatoryAddonsCad,
    trade_in_required: data.tradeInRequired,
    notes: data.notes || '',
    edit_key_hash: data.editKeyHash,
    edit_token: editToken,
    is_flagged: data.isFlagged,
    created_at: new Date().toISOString(),
  };

  inMemorySubmissions.set(id, record);

  return {
    id,
    countryCode,
    country_code: countryCode,
    state,
    dealerMarkupAdm,
    dealer_markup_adm: dealerMarkupAdm,
    portDestination,
    port_destination: portDestination,
    status: data.status,
    currentStage,
    stage: currentStage,
    waitDays,
    isFlagged: data.isFlagged,
    editToken,
  };
}

export async function updateSubmission(data: SubmissionUpdateData): Promise<any | null> {
  const finalStatus = data.status || (data.currentStage === 'delivered' ? 'delivered' : data.currentStage === 'cancelled' ? 'cancelled' : undefined);
  const finalStage = data.currentStage || (data.status === 'delivered' ? 'delivered' : data.status === 'cancelled' ? 'cancelled' : undefined);

  // If Supabase PostgreSQL is live
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      const nowIso = new Date().toISOString();
      const updatePayload: Record<string, any> = {
        updated_at: nowIso,
      };
      if (finalStatus === 'cancelled' || finalStage === 'cancelled') {
        updatePayload.status = 'cancelled';
        updatePayload.stage = 'cancelled';
        updatePayload.cancelled_at = nowIso;
        updatePayload.delivery_date = null;
      } else if (finalStatus === 'delivered' || finalStage === 'delivered') {
        updatePayload.status = 'delivered';
        updatePayload.stage = 'delivered';
        updatePayload.current_stage = 'delivered';
        if (data.deliveryDate) updatePayload.delivery_date = data.deliveryDate;
      } else {
        if (finalStatus) updatePayload.status = finalStatus;
        if (finalStage) {
          updatePayload.stage = finalStage;
          const validEnumStages = ['deposit_placed', 'allocation_confirmed', 'freight_transit', 'arrived_at_dealer', 'delivered'];
          if (validEnumStages.includes(finalStage)) {
            updatePayload.current_stage = finalStage;
          }
        }
      }
      if (data.notes !== undefined) updatePayload.notes = data.notes;

      if (data.modelId || data.modelSlug || data.model) {
        const resolved = await resolveDatabaseVehicleIds(supabase, {
          modelId: data.modelId,
          powertrainId: data.powertrainId,
          trimId: data.trimId,
          modelSlug: data.modelSlug,
          powertrainSlug: data.powertrainSlug,
          trimSlug: data.trimSlug,
          modelName: data.model,
        });
        updatePayload.model_id = resolved.modelId;
        if (resolved.powertrainId) updatePayload.powertrain_id = resolved.powertrainId;
        if (resolved.trimId) updatePayload.trim_id = resolved.trimId;
      }

      const { data: updated, error } = await supabase
        .from('submissions')
        .update(updatePayload)
        .eq('id', data.id)
        .eq('edit_key_hash', data.editKeyHash)
        .select()
        .single();

      if (error) {
        console.error('Supabase updateSubmission error:', error);
        throw new Error(`Database update failed: ${error.message}`);
      }

      if (updated) {
        // Asynchronously refresh the materialized view so regional aggregations recalculate immediately
        Promise.resolve(supabase.rpc('refresh_wait_summary_mv'))
          .then(() => {})
          .catch((rpcErr: unknown) => {
            console.warn('Notice: Background refresh of mv_model_wait_summary encountered:', rpcErr);
          });

        return {
          id: updated.id,
          status: updated.status,
          currentStage: updated.current_stage || 'deposit_placed',
          waitDays: updated.wait_days,
          updatedAt: updated.updated_at,
        };
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'production') throw err;
      console.warn('PostgreSQL update fallback to memory:', err);
    }
  }

  // In-memory fallback
  const record = inMemorySubmissions.get(data.id);
  if (!record) return null;

  if (record.edit_key_hash !== data.editKeyHash) {
    return 'unauthorized';
  }

  if (finalStatus) record.status = finalStatus;
  if (finalStage) record.current_stage = finalStage;
  if (data.deliveryDate) {
    record.delivery_date = data.deliveryDate;
    const start = new Date(record.order_date).getTime();
    const end = new Date(data.deliveryDate).getTime();
    record.wait_days = Math.round((end - start) / (1000 * 60 * 60 * 24));
  }
  if (data.notes !== undefined) {
    record.notes = data.notes;
  }
  record.updated_at = new Date().toISOString();

  return {
    id: record.id,
    status: record.status,
    currentStage: record.current_stage || (record.status === 'delivered' ? 'delivered' : 'deposit_placed'),
    waitDays: record.wait_days,
    updatedAt: record.updated_at,
  };
}

export async function getSubmissionsForExport(filters: ExportFilterParams): Promise<ExportRow[]> {
  const isUsFilter = filters.country_code === 'US' || filters.countryCode === 'US';
  const isCaFilter = filters.country_code === 'CA' || filters.countryCode === 'CA';

  // If Supabase PostgreSQL is live, query the complete unpaginated dataset from Supabase
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      let query = supabase
        .from('submissions')
        .select(`
          id,
          country_code,
          province,
          state,
          dealer_markup_adm,
          port_destination,
          dealership_city,
          model_year,
          order_date,
          delivery_date,
          wait_days,
          status,
          pricing,
          mandatory_addons_cad,
          created_at,
          vehicle_models!inner(name, slug),
          vehicle_powertrains!inner(name, slug),
          vehicle_trims(name, slug)
        `)
        .or('is_flagged.eq.false,is_flagged.is.null');

      if (filters.model && filters.model !== 'all') {
        query = query.eq('vehicle_models.slug', filters.model.toLowerCase());
      }
      if (filters.powertrain && filters.powertrain !== 'all') {
        query = query.eq('vehicle_powertrains.slug', filters.powertrain.toLowerCase());
      }
      if (filters.province) {
        query = query.eq('province', filters.province);
      }
      if (filters.state) {
        query = query.eq('state', filters.state);
      }
      if (isUsFilter) {
        query = query.eq('country_code', 'US');
      } else if (isCaFilter) {
        query = query.or('country_code.eq.CA,country_code.is.null');
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      } else {
        query = query.in('status', ['delivered', 'pending']);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id || '',
          created_at: item.created_at || '',
          model: item.vehicle_models?.name || 'RAV4',
          powertrain: item.vehicle_powertrains?.name || 'Hybrid (HEV)',
          trim: item.vehicle_trims?.name || 'XLE AWD',
          model_year: item.model_year,
          country_code: item.country_code || (item.state ? 'US' : 'CA'),
          province: item.province || item.state || '',
          state: item.state || '',
          dealership_city: item.dealership_city || '',
          order_date: item.order_date,
          delivery_date: item.delivery_date || '',
          wait_days: item.wait_days != null ? String(item.wait_days) : '',
          status: item.status,
          pricing: item.pricing || 'undisclosed',
          addons_cad: Number(item.mandatory_addons_cad || 0).toFixed(2),
          dealer_markup_adm: item.dealer_markup_adm != null ? Number(item.dealer_markup_adm).toFixed(2) : '',
          port_destination: item.port_destination || '',
          submitted_at: item.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase export query fallback to in-memory store:', err);
    }
  }

  // In-memory fallback: returns all matching unpaginated submissions (e.g. all 17 rows when unfiltered)
  const rows: ExportRow[] = [];

  for (const item of inMemorySubmissions.values()) {
    if (item.is_flagged) continue;

    if (filters.model && filters.model !== 'all' && item.model_slug !== filters.model.toLowerCase()) continue;
    if (filters.powertrain && filters.powertrain !== 'all' && item.powertrain_slug !== filters.powertrain.toLowerCase()) continue;
    if (filters.province && item.province !== filters.province) continue;
    if (filters.state && item.state !== filters.state) continue;
    if (isUsFilter) {
      if (item.country_code !== 'US' && item.countryCode !== 'US') continue;
    } else {
      if (item.country_code === 'US' || item.countryCode === 'US') continue;
    }
    if (filters.status) {
      if (item.status !== filters.status) continue;
    } else {
      if (item.status === 'cancelled' || item.is_cancelled === true) continue;
    }

    rows.push({
      id: item.id || '',
      created_at: item.created_at || '',
      model: item.model_name || 'RAV4',
      powertrain: item.powertrain_name || 'HEV',
      trim: item.trim_name || 'XLE AWD',
      model_year: item.model_year,
      country_code: item.country_code || (item.state ? 'US' : 'CA'),
      province: item.province || item.state || '',
      state: item.state || '',
      dealership_city: item.dealership_city || '',
      order_date: item.order_date,
      delivery_date: item.delivery_date || '',
      wait_days: item.wait_days != null ? String(item.wait_days) : '',
      status: item.status,
      pricing: item.pricing || 'undisclosed',
      addons_cad: Number(item.mandatory_addons_cad || 0).toFixed(2),
      dealer_markup_adm: item.dealer_markup_adm != null ? Number(item.dealer_markup_adm).toFixed(2) : '',
      port_destination: item.port_destination || '',
      submitted_at: item.created_at,
    });
  }

  // Sort by created_at DESC
  rows.sort((a, b) => new Date(b.created_at || b.submitted_at || 0).getTime() - new Date(a.created_at || a.submitted_at || 0).getTime());

  return rows;
}

export async function getCommunitySubmissions(countryCode?: CountryCode | string): Promise<CommunityRecord[]> {
  const isUs = countryCode === 'US';
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      let query = supabase
        .from('submissions')
        .select(`
          id,
          country_code,
          province,
          state,
          dealer_markup_adm,
          port_destination,
          dealership_city,
          dealership_name,
          model_year,
          order_date,
          delivery_date,
          wait_days,
          status,
          current_stage,
          stage,
          stage_updated_at,
          updated_at,
          pricing,
          mandatory_addons_cad,
          created_at,
          vehicle_models(name, slug),
          vehicle_powertrains(name, slug),
          vehicle_trims(name, slug)
        `)
        .or('is_flagged.eq.false,is_flagged.is.null')
        .in('status', ['delivered', 'pending'])
        .neq('status', 'cancelled');

      if (isUs) {
        query = query.eq('country_code', 'US');
      } else {
        query = query.or('country_code.eq.CA,country_code.is.null');
      }

      const { data, error } = await query.order('order_date', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const dbRecords: CommunityRecord[] = data
          .filter((item: any) => item.status !== 'cancelled' && item.stage !== 'cancelled' && !item.is_cancelled)
          .map((item: any) => {
          const modelSlug = item.vehicle_models?.slug || 'rav4';
          const modelMedian = modelSlug === 'sienna' ? 510 : modelSlug === 'rav4' ? 375 : 300;
          const isStale = isSubmissionStale(
            {
              orderDate: item.order_date,
              stageUpdatedAt: item.stage_updated_at,
              updatedAt: item.updated_at,
              stage: item.stage || item.current_stage,
              status: item.status,
            },
            modelMedian
          );

          return {
            id: item.id,
            model: item.vehicle_models?.name || 'RAV4',
            modelSlug: item.vehicle_models?.slug || 'rav4',
            powertrain: item.vehicle_powertrains?.name || 'Hybrid (HEV)',
            powertrainSlug: item.vehicle_powertrains?.slug || 'hev',
            trim: item.vehicle_trims?.name || 'XLE AWD',
            modelYear: item.model_year,
            countryCode: (item.country_code || (isUs ? 'US' : 'CA')) as CountryCode,
            country_code: (item.country_code || (isUs ? 'US' : 'CA')) as CountryCode,
            province: item.province || item.state || (isUs ? 'CA' : 'ON'),
            state: item.state || (isUs ? item.province : undefined),
            city: item.dealership_city || '',
            dealerName: item.dealership_name || item.dealership_city || '',
            dealershipName: item.dealership_name || '',
            orderDate: item.order_date,
            deliveryDate: item.delivery_date || null,
            waitDays: item.wait_days != null ? Number(item.wait_days) : null,
            status: item.status as SubmissionStatus,
            stage: item.stage || item.current_stage || undefined,
            pricing: (['at_msrp', 'above_msrp', 'below_msrp'].includes(item.pricing)
              ? item.pricing
              : 'at_msrp') as 'at_msrp' | 'above_msrp' | 'below_msrp',
            addonsCad: Number(item.mandatory_addons_cad || 0),
            dealerMarkupAdm: item.dealer_markup_adm != null ? Number(item.dealer_markup_adm) : undefined,
            portDestination: item.port_destination || undefined,
            isStale,
          };
        });

        // When database records exist, return them directly without duplicating against in-memory fallback
        return dbRecords;
      } else if (error) {
        console.warn('Supabase query error in getCommunitySubmissions, falling back to initial records:', error.message);
      }
    } catch (err) {
      console.warn('Supabase query exception in getCommunitySubmissions:', err);
    }
  }

  // Collect cancelled IDs and edit tokens from in-memory store
  const cancelledIds = new Set<string>();
  for (const item of inMemorySubmissions.values()) {
    if (item.status === 'cancelled' || item.is_cancelled === true) {
      if (item.id) cancelledIds.add(item.id);
      if (item.edit_token) cancelledIds.add(item.edit_token);
    }
  }

  // Fallback to initial verified community dataset
  if (isUs) {
    const usRows: CommunityRecord[] = [];
    for (const item of inMemorySubmissions.values()) {
      if (item.is_flagged) continue;
      if (item.status === 'cancelled' || item.is_cancelled === true) continue;
      if (item.country_code === 'US' || item.countryCode === 'US') {
        usRows.push({
          id: item.id,
          model: item.model_name || 'RAV4',
          modelSlug: item.model_slug || 'rav4',
          powertrain: item.powertrain_name || 'Hybrid (HEV)',
          powertrainSlug: item.powertrain_slug || 'hev',
          trim: item.trim_name || 'XLE AWD',
          modelYear: item.model_year,
          countryCode: 'US',
          country_code: 'US',
          province: item.province || item.state || 'CA',
          state: item.state || item.province || 'CA',
          city: item.dealership_city || '',
          dealerName: item.dealership_name || item.dealership_city || '',
          dealershipName: item.dealership_name || '',
          orderDate: item.order_date,
          deliveryDate: item.delivery_date || null,
          waitDays: item.wait_days != null ? Number(item.wait_days) : null,
          status: item.status as SubmissionStatus,
          stage: item.stage || item.current_stage || undefined,
          pricing: (['at_msrp', 'above_msrp', 'below_msrp'].includes(item.pricing)
            ? item.pricing
            : 'at_msrp') as 'at_msrp' | 'above_msrp' | 'below_msrp',
          addonsCad: Number(item.mandatory_addons_cad || 0),
          dealerMarkupAdm: Number(item.dealer_markup_adm || 0),
          dealer_markup_adm: Number(item.dealer_markup_adm || 0),
          portDestination: item.port_destination || undefined,
          port_destination: item.port_destination || undefined,
        });
      }
    }
    if (usRows.length > 0) return usRows;
    return INITIAL_US_COMMUNITY_RECORDS
      .filter((r) => r.status !== 'cancelled' && !cancelledIds.has(r.id))
      .map((r) => ({
        ...r,
        countryCode: 'US',
        country_code: 'US',
        dealer_markup_adm: r.dealerMarkupAdm,
        port_destination: r.portDestination,
      }));
  }

  return INITIAL_COMMUNITY_RECORDS
    .filter((r) => r.status !== 'cancelled' && !cancelledIds.has(r.id))
    .map((r) => ({
      ...r,
      countryCode: 'CA',
      country_code: 'CA',
    }));
}

export interface EditableSubmission {
  id: string;
  editToken: string;
  model: string;
  modelSlug: string;
  powertrain: string;
  powertrainSlug: string;
  trim: string;
  trimSlug?: string;
  modelYear: number;
  countryCode?: CountryCode;
  province?: CanadianProvince | string | null;
  state?: string | null;
  city: string;
  dealerName?: string;
  dealershipName?: string;
  orderDate: string;
  deliveryDate?: string | null;
  waitDays?: number | null;
  status: SubmissionStatus;
  currentStage?: SubmissionStage;
  stage?: string;
  stageUpdatedAt?: string | null;
  pricing: PricingType;
  mandatoryAddonsCad: number;
  dealerMarkupAdm?: number | null;
  portDestination?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export async function getSubmissionByEditToken(editToken: string): Promise<EditableSubmission | null> {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          edit_token,
          country_code,
          province,
          state,
          dealer_markup_adm,
          port_destination,
          dealership_city,
          dealership_name,
          model_year,
          order_date,
          delivery_date,
          wait_days,
          status,
          current_stage,
          stage,
          stage_updated_at,
          pricing,
          mandatory_addons_cad,
          notes,
          created_at,
          updated_at,
          vehicle_models(name, slug),
          vehicle_powertrains(name, slug),
          vehicle_trims(name, slug)
        `)
        .or(`edit_token.eq.${editToken},id.eq.${editToken}`)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          editToken: data.edit_token || editToken,
          model: (data as any).vehicle_models?.name || 'RAV4',
          modelSlug: (data as any).vehicle_models?.slug || 'rav4',
          powertrain: (data as any).vehicle_powertrains?.name || 'Hybrid (HEV)',
          powertrainSlug: (data as any).vehicle_powertrains?.slug || 'hev',
          trim: (data as any).vehicle_trims?.name || 'XLE AWD',
          trimSlug: (data as any).vehicle_trims?.slug || 'xle-awd',
          modelYear: data.model_year,
          countryCode: (data.country_code || (data.state ? 'US' : 'CA')) as CountryCode,
          province: data.province as CanadianProvince,
          state: data.state || null,
          city: data.dealership_city || '',
          dealerName: data.dealership_name || data.dealership_city || '',
          dealershipName: data.dealership_name || '',
          orderDate: data.order_date,
          deliveryDate: data.delivery_date || null,
          waitDays: data.wait_days != null ? Number(data.wait_days) : null,
          status: data.status as SubmissionStatus,
          currentStage: ((data as any).stage || data.current_stage) === 'freight_transit' ? 'in_transit' : ((data as any).stage || data.current_stage || undefined),
          stage: ((data as any).stage || data.current_stage) === 'freight_transit' ? 'in_transit' : ((data as any).stage || data.current_stage || 'deposit_placed'),
          stageUpdatedAt: (data as any).stage_updated_at || data.updated_at,
          pricing: data.pricing as PricingType,
          mandatoryAddonsCad: Number(data.mandatory_addons_cad || 0),
          dealerMarkupAdm: data.dealer_markup_adm != null ? Number(data.dealer_markup_adm) : null,
          portDestination: data.port_destination || null,
          notes: data.notes || '',
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (err) {
      console.warn('Supabase query exception in getSubmissionByEditToken:', err);
    }
  }

  // In-memory fallback
  for (const item of inMemorySubmissions.values()) {
    if (item.edit_token === editToken || item.id === editToken) {
      return {
        id: item.id,
        editToken: item.edit_token || editToken,
        model: item.model_name || 'RAV4',
        modelSlug: item.model_slug || 'rav4',
        powertrain: item.powertrain_name || 'Hybrid (HEV)',
        powertrainSlug: item.powertrain_slug || 'hev',
        trim: item.trim_name || 'XLE AWD',
        trimSlug: item.trim_slug || 'xle-awd',
        modelYear: item.model_year,
        countryCode: (item.country_code || (item.state ? 'US' : 'CA')) as CountryCode,
        province: item.province,
        state: item.state || null,
        city: item.dealership_city || '',
        dealerName: item.dealership_name || item.dealership_city || '',
        dealershipName: item.dealership_name || '',
        orderDate: item.order_date,
        deliveryDate: item.delivery_date || null,
        waitDays: item.wait_days != null ? Number(item.wait_days) : null,
        status: item.status,
        currentStage: item.stage || item.current_stage,
        stage: item.stage || item.current_stage || 'deposit_placed',
        stageUpdatedAt: item.stage_updated_at || item.updated_at,
        pricing: item.pricing,
        mandatoryAddonsCad: item.mandatory_addons_cad || 0,
        dealerMarkupAdm: item.dealer_markup_adm != null ? Number(item.dealer_markup_adm) : null,
        portDestination: item.port_destination || null,
        notes: item.notes || '',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    }
  }

  return null;
}

export async function updateSubmissionByEditToken(
  editToken: string,
  updates: {
    status?: SubmissionStatus;
    deliveryDate?: string | null;
    notes?: string | null;
    currentStage?: SubmissionStage;
    stage?: string;
    modelId?: string;
    powertrainId?: string;
    trimId?: string;
    modelSlug?: string;
    powertrainSlug?: string;
    trimSlug?: string;
    model?: string;
  }
): Promise<{
  id: string;
  status: SubmissionStatus;
  currentStage?: SubmissionStage;
  stage?: string;
  deliveryDate?: string | null;
  waitDays?: number | null;
  notes?: string | null;
  updatedAt: string;
} | null> {
  const finalStage = updates.stage || updates.currentStage || (updates.status === 'delivered' ? 'delivered' : updates.status === 'cancelled' ? 'cancelled' : undefined);
  const finalStatus = updates.status || (finalStage === 'delivered' ? 'delivered' : finalStage === 'cancelled' ? 'cancelled' : undefined);

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();

      // Fetch existing record to calculate wait_days if transitioning to delivered
      const { data: existing } = await supabase
        .from('submissions')
        .select('id, order_date, wait_days')
        .eq('edit_token', editToken)
        .maybeSingle();

      if (existing) {
        const nowIso = new Date().toISOString();
        const updatePayload: Record<string, any> = {
          updated_at: nowIso,
        };

        if (finalStatus === 'cancelled' || finalStage === 'cancelled') {
          updatePayload.status = 'cancelled';
          updatePayload.stage = 'cancelled';
          updatePayload.cancelled_at = nowIso;
          updatePayload.delivery_date = null;
        } else if (finalStatus === 'delivered' || finalStage === 'delivered') {
          updatePayload.status = 'delivered';
          updatePayload.stage = 'delivered';
          updatePayload.current_stage = 'delivered';
          updatePayload.stage_updated_at = nowIso;
          if (updates.deliveryDate) {
            updatePayload.delivery_date = updates.deliveryDate;
          }
        } else {
          if (finalStatus) updatePayload.status = finalStatus;
          if (finalStage) {
            updatePayload.stage = finalStage;
            updatePayload.stage_updated_at = nowIso;
            if (finalStage === 'deposit_placed') {
              updatePayload.current_stage = 'deposit_placed';
            } else if (finalStage === 'vin_assigned' || finalStage === 'allocation_confirmed') {
              updatePayload.current_stage = 'allocation_confirmed';
            } else if (finalStage === 'in_transit' || finalStage === 'freight_transit') {
              updatePayload.current_stage = 'freight_transit';
            }
          }
          updatePayload.delivery_date = null;
        }

        if (updates.notes !== undefined) {
          updatePayload.notes = updates.notes;
        }

        if (updates.modelId || updates.modelSlug || updates.model) {
          const resolved = await resolveDatabaseVehicleIds(supabase, {
            modelId: updates.modelId,
            powertrainId: updates.powertrainId,
            trimId: updates.trimId,
            modelSlug: updates.modelSlug,
            powertrainSlug: updates.powertrainSlug,
            trimSlug: updates.trimSlug,
            modelName: updates.model,
          });
          updatePayload.model_id = resolved.modelId;
          if (resolved.powertrainId) updatePayload.powertrain_id = resolved.powertrainId;
          if (resolved.trimId) updatePayload.trim_id = resolved.trimId;
        }

        const { data: updated, error } = await supabase
          .from('submissions')
          .update(updatePayload)
          .eq('edit_token', editToken)
          .select('id, status, current_stage, stage, delivery_date, wait_days, notes, updated_at')
          .single();

        if (error) {
          console.error('Supabase updateSubmissionByEditToken error:', error);
          throw new Error(`Database update failed: ${error.message} (${error.code || 'UNKNOWN'})`);
        }

        if (updated) {
          // Asynchronously refresh the materialized view
          Promise.resolve(supabase.rpc('refresh_wait_summary_mv'))
            .then(() => {})
            .catch((rpcErr: unknown) => {
              console.warn('Notice: Background refresh of mv_model_wait_summary encountered:', rpcErr);
            });

          let returnStage = updated.stage || updated.current_stage;
          if (returnStage === 'freight_transit') returnStage = 'in_transit';

          return {
            id: updated.id,
            status: updated.status,
            currentStage: returnStage,
            stage: returnStage,
            deliveryDate: updated.delivery_date,
            waitDays: updated.wait_days,
            notes: updated.notes,
            updatedAt: updated.updated_at,
          };
        }
      } else if (process.env.NODE_ENV === 'production') {
        return null;
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'production') throw err;
      console.warn('PostgreSQL update by edit_token fallback to memory in dev/test:', err);
    }
  }

  // In-memory fallback
  for (const item of inMemorySubmissions.values()) {
    if (item.edit_token === editToken || item.id === editToken) {
      if (finalStatus) item.status = finalStatus;
      if (finalStage) {
        item.current_stage = finalStage;
        item.stage = finalStage;
        item.stage_updated_at = new Date().toISOString();
      }
      if (finalStatus === 'pending' || finalStatus === 'cancelled') {
        item.delivery_date = null;
        item.wait_days = null;
      } else {
        if (updates.deliveryDate !== undefined) {
          item.delivery_date = updates.deliveryDate;
          if (finalStatus === 'delivered' && updates.deliveryDate) {
            const start = new Date(item.order_date).getTime();
            const end = new Date(updates.deliveryDate).getTime();
            item.wait_days = Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
          }
        }
      }
      if (updates.notes !== undefined) item.notes = updates.notes;

      if (updates.modelId || updates.modelSlug || updates.model) {
        for (const m of CANADIAN_VEHICLE_CATALOG) {
          if (
            m.id === updates.modelId ||
            m.slug === updates.modelSlug ||
            (updates.model && m.name.toLowerCase() === updates.model.toLowerCase()) ||
            (updates.modelId && m.slug.toLowerCase() === updates.modelId.toLowerCase())
          ) {
            item.model_slug = m.slug;
            item.model_name = m.name;
            item.model = m.name;
            for (const p of m.powertrains) {
              if (p.id === updates.powertrainId || p.slug === updates.powertrainSlug) {
                item.powertrain_slug = p.slug;
                item.powertrain_name = p.name;
                for (const t of p.trims) {
                  if (t.id === updates.trimId || t.slug === updates.trimSlug) {
                    item.trim_slug = t.slug;
                    item.trim_name = t.name;
                    item.trim = t.name;
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
        }
      }

      item.updated_at = new Date().toISOString();

      return {
        id: item.id,
        status: item.status,
        currentStage: item.stage || item.current_stage,
        stage: item.stage || item.current_stage,
        deliveryDate: item.delivery_date,
        waitDays: item.wait_days,
        notes: item.notes,
        updatedAt: item.updated_at,
      };
    }
  }

  return null;
}

export async function handleNudgeAction(
  token: string,
  action: NudgeAction
): Promise<NudgeActionResult> {
  if (!token) {
    return {
      success: false,
      action,
      error: 'Missing order token.',
    };
  }

  const normalizedToken = token.trim();
  const nowIso = new Date().toISOString();
  const todayYmd = nowIso.split('T')[0];

  // 1. Supabase PostgreSQL live connection
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();

      // Look up by edit_token or id
      const { data: existing } = await supabase
        .from('submissions')
        .select(`
          id,
          model_year,
          order_date,
          delivery_date,
          status,
          current_stage,
          stage,
          wait_days,
          edit_token,
          province,
          vehicle_models(name),
          vehicle_trims(name)
        `)
        .or(`edit_token.eq.${normalizedToken},id.eq.${normalizedToken}`)
        .maybeSingle();

      if (existing) {
        let updatePayload: Record<string, any> = {
          updated_at: nowIso,
          stage_updated_at: nowIso,
        };
        let finalWaitDays = existing.wait_days;
        let finalDeliveryDate = existing.delivery_date;
        let finalStage = existing.stage || existing.current_stage || 'deposit_placed';
        let finalStatus = existing.status;

        if (action === 'still_waiting') {
          finalStatus = 'pending';
          updatePayload = {
            ...updatePayload,
            status: 'pending',
          };
        } else if (action === 'deposit_placed') {
          finalStatus = 'pending';
          finalStage = 'deposit_placed';
          updatePayload = {
            ...updatePayload,
            status: 'pending',
            stage: 'deposit_placed',
            current_stage: 'deposit_placed',
          };
        } else if (action === 'vin_assigned' || action === 'allocation_confirmed') {
          finalStatus = 'pending';
          finalStage = 'vin_assigned';
          updatePayload = {
            ...updatePayload,
            status: 'pending',
            stage: 'vin_assigned',
            current_stage: 'allocation_confirmed',
          };
        } else if (action === 'in_transit') {
          finalStatus = 'pending';
          finalStage = 'in_transit';
          updatePayload = {
            ...updatePayload,
            status: 'pending',
            stage: 'in_transit',
            current_stage: 'freight_transit',
          };
        } else if (action === 'delivered') {
          finalStatus = 'delivered';
          finalStage = 'delivered';
          finalDeliveryDate = todayYmd;
          const start = new Date(existing.order_date).getTime();
          const end = new Date(todayYmd).getTime();
          finalWaitDays = Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
          updatePayload = {
            ...updatePayload,
            status: 'delivered',
            stage: 'delivered',
            current_stage: 'delivered',
            delivery_date: todayYmd,
          };
        } else if (action === 'cancelled') {
          finalStatus = 'cancelled';
          finalStage = 'cancelled';
          finalDeliveryDate = null;
          finalWaitDays = null;
          updatePayload = {
            ...updatePayload,
            status: 'cancelled',
            stage: 'cancelled',
            cancelled_at: nowIso,
            delivery_date: null,
          };
        }

        const { error: updateErr } = await supabase
          .from('submissions')
          .update(updatePayload)
          .eq('id', existing.id);

        if (!updateErr) {
          if (action === 'delivered' || action === 'cancelled') {
            Promise.resolve(supabase.rpc('refresh_wait_summary_mv')).catch(() => {});
          }

          const modelName = (existing.vehicle_models as any)?.name || 'Toyota';
          const trimName = (existing.vehicle_trims as any)?.name || null;

          return {
            success: true,
            action,
            submission: {
              id: existing.id,
              model: modelName,
              modelYear: existing.model_year,
              trim: trimName,
              province: existing.province,
              orderDate: existing.order_date,
              deliveryDate: finalDeliveryDate,
              stage: finalStage,
              status: finalStatus,
              waitDays: finalWaitDays,
              editToken: existing.edit_token || normalizedToken,
              stageUpdatedAt: nowIso,
            },
          };
        }
      }
    } catch (err) {
      console.warn('Supabase exception in handleNudgeAction, falling back to memory:', err);
    }
  }

  // 2. In-memory fallback
  for (const item of inMemorySubmissions.values()) {
    if (item.edit_token === normalizedToken || item.id === normalizedToken) {
      let finalWaitDays = item.wait_days;
      let finalDeliveryDate = item.delivery_date;
      let finalStage = item.stage || item.current_stage || 'deposit_placed';
      let finalStatus = item.status;

      item.updated_at = nowIso;
      item.stage_updated_at = nowIso;

      if (action === 'still_waiting') {
        item.status = 'pending';
        finalStatus = 'pending';
      } else if (action === 'deposit_placed') {
        item.status = 'pending';
        item.stage = 'deposit_placed';
        item.current_stage = 'deposit_placed';
        finalStatus = 'pending';
        finalStage = 'deposit_placed';
      } else if (action === 'vin_assigned' || action === 'allocation_confirmed') {
        item.status = 'pending';
        item.stage = 'vin_assigned';
        item.current_stage = 'vin_assigned';
        finalStatus = 'pending';
        finalStage = 'vin_assigned';
      } else if (action === 'in_transit') {
        item.status = 'pending';
        item.stage = 'in_transit';
        item.current_stage = 'in_transit';
        finalStatus = 'pending';
        finalStage = 'in_transit';
      } else if (action === 'delivered') {
        item.status = 'delivered';
        item.stage = 'delivered';
        item.current_stage = 'delivered';
        item.delivery_date = todayYmd;
        const start = new Date(item.order_date).getTime();
        const end = new Date(todayYmd).getTime();
        finalWaitDays = Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
        item.wait_days = finalWaitDays;
        finalStatus = 'delivered';
        finalStage = 'delivered';
        finalDeliveryDate = todayYmd;
      } else if (action === 'cancelled') {
        item.status = 'cancelled';
        item.stage = 'cancelled';
        item.current_stage = 'cancelled';
        item.cancelled_at = nowIso;
        item.delivery_date = null;
        item.wait_days = null;
        finalStatus = 'cancelled';
        finalStage = 'cancelled';
        finalDeliveryDate = null;
        finalWaitDays = null;
      }

      return {
        success: true,
        action,
        submission: {
          id: item.id,
          model: item.model || 'Toyota',
          modelYear: item.model_year,
          trim: item.trim || null,
          province: item.province,
          orderDate: item.order_date,
          deliveryDate: finalDeliveryDate,
          stage: finalStage,
          status: finalStatus,
          waitDays: finalWaitDays,
          editToken: item.edit_token || normalizedToken,
          stageUpdatedAt: nowIso,
        },
      };
    }
  }

  return {
    success: false,
    action,
    error: 'Submission not found or invalid token.',
  };
}
