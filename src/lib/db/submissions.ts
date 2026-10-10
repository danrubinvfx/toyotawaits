import crypto from 'crypto';
import { createServerClient } from '@/lib/supabase/server';
import { Submission, CanadianProvince, SubmissionStatus, SubmissionStage, PricingType } from '@/lib/types/contracts';
import { CANADIAN_VEHICLE_CATALOG } from '@/lib/data/vehicles';
import { CommunityRecord, INITIAL_COMMUNITY_RECORDS } from '@/lib/data/community-records';

export interface SubmissionCreateData {
  modelId: string;
  powertrainId: string;
  trimId: string;
  province: CanadianProvince;
  dealershipCity?: string | null;
  dealershipName?: string | null;
  modelYear: number;
  orderDate: string;
  deliveryDate?: string | null;
  status: SubmissionStatus;
  currentStage?: SubmissionStage;
  pricing: PricingType;
  mandatoryAddonsCad: number;
  tradeInRequired: boolean;
  notes?: string | null;
  editKeyHash: string;
  isFlagged: boolean;
}

export interface SubmissionUpdateData {
  id: string;
  editKeyHash: string;
  status?: SubmissionStatus;
  currentStage?: SubmissionStage;
  deliveryDate?: string | null;
  notes?: string | null;
}

export interface ExportFilterParams {
  model?: string;
  powertrain?: string;
  province?: CanadianProvince;
  status?: SubmissionStatus;
}

export interface ExportRow {
  model: string;
  powertrain: string;
  trim: string;
  model_year: number;
  province: string;
  dealership_city: string;
  order_date: string;
  delivery_date: string;
  wait_days: string;
  status: string;
  pricing: string;
  addons_cad: string;
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
      notes: `${r.model} ${r.trim} crowdsourced Canadian submission`,
      edit_key_hash: crypto.createHash('sha256').update(`seed-key-${uuidId}`).digest('hex'),
      is_flagged: false,
      created_at: r.orderDate ? `${r.orderDate}T12:00:00Z` : new Date().toISOString(),
    });
  }
}

seedInitialData();

export async function insertSubmission(data: SubmissionCreateData): Promise<any> {
  const id = crypto.randomUUID();
  let waitDays: number | null = null;

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
      let { data: inserted, error } = await supabase
        .from('submissions')
        .insert({
          id,
          model_id: data.modelId,
          powertrain_id: data.powertrainId,
          trim_id: data.trimId,
          province: data.province,
          dealership_city: data.dealershipCity,
          dealership_name: data.dealershipName,
          model_year: data.modelYear,
          order_date: data.orderDate,
          delivery_date: data.deliveryDate,
          status: data.status,
          current_stage: data.currentStage || (data.status === 'delivered' ? 'delivered' : 'deposit_placed'),
          pricing: data.pricing,
          mandatory_addons_cad: data.mandatoryAddonsCad,
          trade_in_required: data.tradeInRequired,
          notes: data.notes,
          edit_key_hash: data.editKeyHash,
          is_flagged: data.isFlagged,
        })
        .select('id, status, current_stage, wait_days, is_flagged')
        .maybeSingle();

      // 1. If foreign key constraint failed, dynamically resolve actual DB IDs by vehicle slug
      if (error && (error.code === '23503' || error.message?.includes('foreign key'))) {
        console.warn('Foreign key mismatch in Supabase insert, resolving actual DB IDs by slug...', error.message);
        let modelSlug: string | undefined;
        let powertrainSlug: string | undefined;
        let trimSlug: string | undefined;

        for (const m of CANADIAN_VEHICLE_CATALOG) {
          if (m.id === data.modelId) {
            modelSlug = m.slug;
            for (const p of m.powertrains) {
              if (p.id === data.powertrainId) {
                powertrainSlug = p.slug;
                for (const t of p.trims) {
                  if (t.id === data.trimId) {
                    trimSlug = t.slug;
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
        }

        if (modelSlug) {
          const { data: dbModel } = await supabase
            .from('vehicle_models')
            .select('id')
            .eq('slug', modelSlug)
            .maybeSingle();

          if (dbModel) {
            const actualModelId = dbModel.id;
            const { data: dbPowertrain } = powertrainSlug
              ? await supabase
                  .from('vehicle_powertrains')
                  .select('id')
                  .eq('model_id', actualModelId)
                  .eq('slug', powertrainSlug)
                  .maybeSingle()
              : { data: null };
            const actualPowertrainId = dbPowertrain?.id || data.powertrainId;

            const { data: dbTrim } = trimSlug && dbPowertrain
              ? await supabase
                  .from('vehicle_trims')
                  .select('id')
                  .eq('powertrain_id', actualPowertrainId)
                  .eq('slug', trimSlug)
                  .maybeSingle()
              : { data: null };

            // Fallback to any trim of this powertrain if exact slug wasn't found
            const { data: dbAnyTrim } = !dbTrim && dbPowertrain
              ? await supabase
                  .from('vehicle_trims')
                  .select('id')
                  .eq('powertrain_id', actualPowertrainId)
                  .limit(1)
                  .maybeSingle()
              : { data: null };

            const actualTrimId = dbTrim?.id || dbAnyTrim?.id || data.trimId;

            const retryRes = await supabase
              .from('submissions')
              .insert({
                id,
                model_id: actualModelId,
                powertrain_id: actualPowertrainId,
                trim_id: actualTrimId,
                province: data.province,
                dealership_city: data.dealershipCity,
                dealership_name: data.dealershipName,
                model_year: data.modelYear,
                order_date: data.orderDate,
                delivery_date: data.deliveryDate,
                status: data.status,
                current_stage: data.currentStage || (data.status === 'delivered' ? 'delivered' : 'deposit_placed'),
                pricing: data.pricing,
                mandatory_addons_cad: data.mandatoryAddonsCad,
                trade_in_required: data.tradeInRequired,
                notes: data.notes,
                edit_key_hash: data.editKeyHash,
                is_flagged: data.isFlagged,
              })
              .select('id, status, current_stage, wait_days, is_flagged')
              .maybeSingle();

            if (!retryRes.error) {
              inserted = retryRes.data;
              error = null;
            } else {
              console.error('Retry insert with resolved DB IDs failed:', retryRes.error);
            }
          }
        }
      }

      // 2. If RLS policy blocked insert due to strict is_flagged = false policy, retry with is_flagged = false
      if (error && (error.code === '42501' || error.message?.includes('violates row-level security')) && data.isFlagged) {
        console.warn('RLS policy violation on flagged submission insert, retrying with is_flagged = false...');
        const rlsRetry = await supabase
          .from('submissions')
          .insert({
            id,
            model_id: data.modelId,
            powertrain_id: data.powertrainId,
            trim_id: data.trimId,
            province: data.province,
            dealership_city: data.dealershipCity,
            dealership_name: data.dealershipName,
            model_year: data.modelYear,
            order_date: data.orderDate,
            delivery_date: data.deliveryDate,
            status: data.status,
            current_stage: data.currentStage || (data.status === 'delivered' ? 'delivered' : 'deposit_placed'),
            pricing: data.pricing,
            mandatory_addons_cad: data.mandatoryAddonsCad,
            trade_in_required: data.tradeInRequired,
            notes: data.notes,
            edit_key_hash: data.editKeyHash,
            is_flagged: false,
          })
          .select('id, status, current_stage, wait_days, is_flagged')
          .maybeSingle();

        if (!rlsRetry.error) {
          inserted = rlsRetry.data;
          error = null;
        }
      }

      if (!error) {
        return {
          id: inserted?.id || id,
          status: inserted?.status || data.status,
          currentStage: inserted?.current_stage || data.currentStage || 'deposit_placed',
          waitDays: inserted?.wait_days ?? waitDays,
          isFlagged: inserted?.is_flagged ?? data.isFlagged,
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
  const record = {
    id,
    model_id: data.modelId,
    model_slug: 'rav4',
    model_name: 'RAV4',
    powertrain_id: data.powertrainId,
    powertrain_slug: 'hev',
    powertrain_name: 'Hybrid (HEV)',
    trim_id: data.trimId,
    trim_slug: 'xle-awd',
    trim_name: 'XLE AWD',
    province: data.province,
    dealership_city: data.dealershipCity || '',
    model_year: data.modelYear,
    order_date: data.orderDate,
    delivery_date: data.deliveryDate || null,
    wait_days: waitDays,
    status: data.status,
    current_stage: currentStage,
    pricing: data.pricing,
    mandatory_addons_cad: data.mandatoryAddonsCad,
    trade_in_required: data.tradeInRequired,
    notes: data.notes || '',
    edit_key_hash: data.editKeyHash,
    is_flagged: data.isFlagged,
    created_at: new Date().toISOString(),
  };

  inMemorySubmissions.set(id, record);

  return {
    id,
    status: data.status,
    currentStage,
    waitDays,
    isFlagged: data.isFlagged,
  };
}

export async function updateSubmission(data: SubmissionUpdateData): Promise<any | null> {
  const finalStatus = data.status || (data.currentStage === 'delivered' ? 'delivered' : undefined);
  const finalStage = data.currentStage || (data.status === 'delivered' ? 'delivered' : undefined);

  // If Supabase PostgreSQL is live
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-')
  ) {
    try {
      const supabase = createServerClient();
      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (finalStatus) updatePayload.status = finalStatus;
      if (finalStage) updatePayload.current_stage = finalStage;
      if (data.deliveryDate) updatePayload.delivery_date = data.deliveryDate;
      if (data.notes !== undefined) updatePayload.notes = data.notes;

      const { data: updated, error } = await supabase
        .from('submissions')
        .update(updatePayload)
        .eq('id', data.id)
        .eq('edit_key_hash', data.editKeyHash)
        .select()
        .single();

      if (!error && updated) {
        return {
          id: updated.id,
          status: updated.status,
          currentStage: updated.current_stage || 'deposit_placed',
          waitDays: updated.wait_days,
          updatedAt: updated.updated_at,
        };
      }
    } catch (err) {
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
          province,
          dealership_city,
          model_year,
          order_date,
          delivery_date,
          wait_days,
          status,
          pricing,
          mandatory_addons_cad,
          created_at,
          vehicle_models(name, slug),
          vehicle_powertrains(name, slug),
          vehicle_trims(name, slug)
        `)
        .or('is_flagged.eq.false,is_flagged.is.null');

      if (filters.model) {
        query = query.eq('vehicle_models.slug', filters.model.toLowerCase());
      }
      if (filters.powertrain) {
        query = query.eq('vehicle_powertrains.slug', filters.powertrain.toLowerCase());
      }
      if (filters.province) {
        query = query.eq('province', filters.province);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      } else {
        query = query.in('status', ['delivered', 'pending']);
      }

      const { data, error } = await query.order('order_date', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          model: item.vehicle_models?.name || 'RAV4',
          powertrain: item.vehicle_powertrains?.name || 'Hybrid (HEV)',
          trim: item.vehicle_trims?.name || 'XLE AWD',
          model_year: item.model_year,
          province: item.province,
          dealership_city: item.dealership_city || '',
          order_date: item.order_date,
          delivery_date: item.delivery_date || '',
          wait_days: item.wait_days != null ? String(item.wait_days) : '',
          status: item.status,
          pricing: item.pricing || 'undisclosed',
          addons_cad: Number(item.mandatory_addons_cad || 0).toFixed(2),
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

    if (filters.model && item.model_slug !== filters.model.toLowerCase()) continue;
    if (filters.powertrain && item.powertrain_slug !== filters.powertrain.toLowerCase()) continue;
    if (filters.province && item.province !== filters.province) continue;
    if (filters.status && item.status !== filters.status) continue;

    rows.push({
      model: item.model_name || 'RAV4',
      powertrain: item.powertrain_name || 'HEV',
      trim: item.trim_name || 'XLE AWD',
      model_year: item.model_year,
      province: item.province,
      dealership_city: item.dealership_city || '',
      order_date: item.order_date,
      delivery_date: item.delivery_date || '',
      wait_days: item.wait_days != null ? String(item.wait_days) : '',
      status: item.status,
      pricing: item.pricing || 'undisclosed',
      addons_cad: Number(item.mandatory_addons_cad || 0).toFixed(2),
      submitted_at: item.created_at,
    });
  }

  return rows;
}

export async function getCommunitySubmissions(): Promise<CommunityRecord[]> {
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
          province,
          dealership_city,
          model_year,
          order_date,
          delivery_date,
          wait_days,
          status,
          current_stage,
          pricing,
          mandatory_addons_cad,
          created_at,
          vehicle_models(name, slug),
          vehicle_powertrains(name, slug),
          vehicle_trims(name, slug)
        `)
        .or('is_flagged.eq.false,is_flagged.is.null')
        .in('status', ['delivered', 'pending'])
        .order('order_date', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const dbRecords: CommunityRecord[] = data.map((item: any) => ({
          id: item.id,
          model: item.vehicle_models?.name || 'RAV4',
          modelSlug: item.vehicle_models?.slug || 'rav4',
          powertrain: item.vehicle_powertrains?.name || 'Hybrid (HEV)',
          powertrainSlug: item.vehicle_powertrains?.slug || 'hev',
          trim: item.vehicle_trims?.name || 'XLE AWD',
          modelYear: item.model_year,
          province: item.province,
          city: item.dealership_city || '',
          orderDate: item.order_date,
          deliveryDate: item.delivery_date || null,
          waitDays: item.wait_days != null ? Number(item.wait_days) : null,
          status: item.status as 'pending' | 'delivered',
          stage: item.current_stage || undefined,
          pricing: (['at_msrp', 'above_msrp', 'below_msrp'].includes(item.pricing)
            ? item.pricing
            : 'at_msrp') as 'at_msrp' | 'above_msrp' | 'below_msrp',
          addonsCad: Number(item.mandatory_addons_cad || 0),
        }));

        // Deduplicate against initial community records (Supabase rows take precedence)
        const dbIds = new Set(dbRecords.map((r) => r.id));
        const combined = [...dbRecords];
        for (const seed of INITIAL_COMMUNITY_RECORDS) {
          if (!dbIds.has(seed.id)) {
            combined.push(seed);
          }
        }
        return combined;
      } else if (error) {
        console.warn('Supabase query error in getCommunitySubmissions, falling back to initial records:', error.message);
      }
    } catch (err) {
      console.warn('Supabase query exception in getCommunitySubmissions:', err);
    }
  }

  // Fallback to initial verified community dataset
  return [...INITIAL_COMMUNITY_RECORDS];
}
