// ============================================================================
// MODEL LINEUP CONFIGURATIONS & SCHEMAS
// Canonical model configurations, supported model list, and baseline specs
// ============================================================================

export const SUPPORTED_MODELS = [
  'rav4',
  'sienna',
  'grand-highlander',
  'land-cruiser',
  'prius',
  'prius-prime',
  'tacoma',
  'corolla',
  'corolla-cross',
  'sequoia',
] as const;

export type SupportedModel = (typeof SUPPORTED_MODELS)[number];

export interface ModelPowertrainConfig {
  powertrain: 'gas' | 'hev' | 'gr' | 'phev' | 'hybrid-max';
  name: string;
  trims: string[];
  defaultBaselineDays: number;
  p25Days: number;
  p75Days: number;
  baseMsrpCad: number;
  maxCeilingDays?: number;
}

export interface ModelLineupConfig {
  slug: SupportedModel | string;
  name: string;
  generationStartYear: number;
  powertrains: Record<string, ModelPowertrainConfig>;
}

export const COROLLA_CONFIG: ModelLineupConfig = {
  slug: 'corolla',
  name: 'Toyota Corolla',
  generationStartYear: 2020,
  powertrains: {
    gas: {
      powertrain: 'gas',
      name: 'Gasoline',
      trims: ['L', 'LE', 'SE', 'XSE', 'Hatchback SE', 'Hatchback XSE'],
      defaultBaselineDays: 60,
      p25Days: 30,
      p75Days: 90,
      baseMsrpCad: 23490,
      maxCeilingDays: 120,
    },
    hev: {
      powertrain: 'hev',
      name: 'Hybrid (HEV)',
      trims: ['LE AWD', 'SE AWD', 'XSE AWD'],
      defaultBaselineDays: 165,
      p25Days: 120,
      p75Days: 210,
      baseMsrpCad: 26590,
      maxCeilingDays: 240,
    },
    gr: {
      powertrain: 'gr',
      name: 'GR Performance',
      trims: ['Core', 'Premium', 'Circuit Edition'],
      defaultBaselineDays: 240,
      p25Days: 180,
      p75Days: 330,
      baseMsrpCad: 46850,
      maxCeilingDays: 360,
    },
  },
};

export const COROLLA_CROSS_CONFIG: ModelLineupConfig = {
  slug: 'corolla-cross',
  name: 'Toyota Corolla Cross',
  generationStartYear: 2022,
  powertrains: {
    gas: {
      powertrain: 'gas',
      name: 'Gasoline',
      trims: ['L FWD', 'L AWD', 'LE FWD', 'LE AWD', 'XLE AWD'],
      defaultBaselineDays: 90,
      p25Days: 60,
      p75Days: 135,
      baseMsrpCad: 27250,
      maxCeilingDays: 180,
    },
    hev: {
      powertrain: 'hev',
      name: 'Hybrid (HEV)',
      trims: ['SE AWD', 'XSE AWD'],
      defaultBaselineDays: 270,
      p25Days: 210,
      p75Days: 360,
      baseMsrpCad: 34190,
      maxCeilingDays: 400,
    },
  },
};

export const SEQUOIA_CONFIG: ModelLineupConfig = {
  slug: 'sequoia',
  name: 'Toyota Sequoia',
  generationStartYear: 2023,
  powertrains: {
    hev: {
      powertrain: 'hev',
      name: 'i-FORCE MAX Twin-Turbo V6 Hybrid',
      trims: [
        'SR5 TRD Off-Road',
        'Limited Nightshade',
        'Platinum',
        'TRD Pro',
        'Capstone',
      ],
      defaultBaselineDays: 240,
      p25Days: 180,
      p75Days: 330,
      baseMsrpCad: 84940,
      maxCeilingDays: 420,
    },
  },
};

export const MODEL_CONFIGURATIONS: Record<string, ModelLineupConfig> = {
  corolla: COROLLA_CONFIG,
  'corolla-cross': COROLLA_CROSS_CONFIG,
  sequoia: SEQUOIA_CONFIG,
};
