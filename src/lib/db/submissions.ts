import crypto from 'crypto';
import { createServerClient } from '@/lib/supabase/server';
import { Submission, CanadianProvince, SubmissionStatus, SubmissionStage, PricingType } from '@/lib/types/contracts';

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
      powertrain_name: 'Prime / Plug-in Hybrid (PHEV)',
      trim_slug: 'xse-technology-awd',
      trim_name: 'XSE AWD Technology Package',
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
  ];

  for (const s of samples) {
    inMemorySubmissions.set(s.id, s);
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
      const { data: inserted, error } = await supabase
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
        .select()
        .single();

      if (!error && inserted) {
        return {
          id: inserted.id,
          status: inserted.status,
          currentStage: inserted.current_stage || data.currentStage || 'deposit_placed',
          waitDays: inserted.wait_days,
          isFlagged: inserted.is_flagged,
        };
      }
    } catch (err) {
      console.warn('PostgreSQL insert fallback to memory:', err);
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
