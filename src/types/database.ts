import type {
  CanadianProvince,
  SubmissionStatus,
  OrderStage,
  SubmissionStage,
  OrderLifecycleState,
  PricingType,
  VehicleModel,
  VehiclePowertrain,
  VehicleTrim,
  Submission,
} from '@/lib/types/contracts';

export type {
  CanadianProvince,
  SubmissionStatus,
  OrderStage,
  SubmissionStage,
  OrderLifecycleState,
  PricingType,
  VehicleModel,
  VehiclePowertrain,
  VehicleTrim,
  Submission,
};

export const ORDER_LIFECYCLE_STATES: readonly OrderLifecycleState[] = [
  'deposit_placed',
  'vin_assigned',
  'in_transit',
  'delivered',
] as const;

export interface OrderLifecycleStateMeta {
  key: OrderLifecycleState;
  step: number;
  label: string;
  badgeLabel: string;
  description: string;
}

export const ORDER_LIFECYCLE_CONFIG: Record<OrderLifecycleState, OrderLifecycleStateMeta> = {
  deposit_placed: {
    key: 'deposit_placed',
    step: 1,
    label: 'Deposit Placed',
    badgeLabel: 'Deposit Placed / Waiting on Allocation',
    description: 'Deposit on file with dealer; waiting for build allocation.',
  },
  vin_assigned: {
    key: 'vin_assigned',
    step: 2,
    label: 'VIN Assigned',
    badgeLabel: 'Build Assigned / VIN Generated',
    description: 'Factory allocation slot assigned and VIN generated.',
  },
  in_transit: {
    key: 'in_transit',
    step: 3,
    label: 'In Transit',
    badgeLabel: 'In Transit / Freight',
    description: 'Freight carrier or rail transport underway to dealership.',
  },
  delivered: {
    key: 'delivered',
    step: 4,
    label: 'Delivered',
    badgeLabel: 'Delivered / Keys in Hand',
    description: 'Vehicle arrived and delivered to buyer; keys in hand.',
  },
};

export interface Database {
  public: {
    Tables: {
      submissions: {
        Row: {
          id: string;
          model_id: string;
          powertrain_id: string;
          trim_id: string;
          province: CanadianProvince;
          dealership_city: string | null;
          dealership_name: string | null;
          model_year: number;
          order_date: string;
          delivery_date: string | null;
          status: SubmissionStatus;
          stage: OrderStage;
          current_stage?: SubmissionStage;
          stage_updated_at: string;
          wait_days: number | null;
          pricing: PricingType;
          mandatory_addons_cad: number;
          trade_in_required: boolean;
          notes: string | null;
          edit_key_hash: string;
          edit_token: string;
          is_flagged: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['submissions']['Row']>;
        Update: Partial<Database['public']['Tables']['submissions']['Row']>;
      };
    };
  };
}
